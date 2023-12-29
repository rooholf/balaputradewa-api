import Elysia, { t } from "elysia";
import { ctx } from "../context/context";

export const bankAccount = new Elysia()
    .use(ctx)
    .group('/bank', (app) => {
        return app
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };

                const bankAccounts = await db.bankAccounts.findMany(
                    {
                        orderBy,
                        skip: offset,
                        take: limit,
                        where: {
                            OR: [
                                {
                                    accountNumber: {
                                        contains: q ?? ''
                                    },
                                },
                                {
                                    accountName: {
                                        contains: q ?? ''
                                    },
                                },
                                {
                                    bankName: {
                                        contains: q ?? ''
                                    },
                                },

                                {
                                    balance: {
                                        equals: parseInt(q ?? '0')
                                    },
                                },
                                {
                                    created_at: {
                                        lte: q ? new Date(q) : undefined,
                                        gte: q ? new Date(q) : undefined
                                    },
                                }
                            ]
                        },
                        select: {
                            id: true,
                            accountNumber: true,
                            accountName: true,
                            bankName: true,
                            balance: true,
                            created_at: true,
                            updated_at: true,
                        }
                    }
                )
                const count = await db.bankAccounts.count()
                return bankAccounts;

            }, {
                detail: {
                    tags: ['Bank Account']
                },
            })

            .get('/:id', async ({ db, params }) => {
                const { id } = params;
                const bankAccount = await db.bankAccounts.findUnique({
                    where: {
                        id: parseInt(id)
                    },
                    select: {
                        id: true,
                        accountNumber: true,
                        accountName: true,
                        bankName: true,
                        balance: true,
                        bankTransactions: true,
                        created_at: true,
                        updated_at: true,
                    }
                })
                return bankAccount;
            }, {
                detail: {
                    tags: ['Bank Account']
                },
            })

            .post('/', async ({ db, body }) => {
                const { accountNumber, accountName, bankName, balance } = body;

                const bankAccount = await db.bankAccounts.create({
                    data: {
                        accountNumber,
                        accountName,
                        bankName,
                        balance
                    }
                })

                const bankTransaction = await db.bankTransactions.create({
                    data: {
                        amount: balance,
                        transactionType: 'Debit',
                        transactionDate: new Date(),
                        transactionCode: "TRS-" + bankAccount.id + "-" + Math.floor(Math.random() * 1000),
                        description: "Setoran awal",
                        bankAccounts: {
                            connect: {
                                id: bankAccount.id
                            }
                        }
                    }
                })



                return {
                    bankAccount,
                    bankTransaction
                };
            }
                , {
                    body: t.Object({
                        accountNumber: t.String(),
                        accountName: t.String(),
                        bankName: t.String(),
                        balance: t.Number(),
                    }),
                    detail: {
                        tags: ['Bank Account']
                    },
                })

            .put('/:id', async ({ db, params, body }) => {
                const { id } = params;
                const bankAccount = await db.bankAccounts.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        ...body
                    }
                })
                return bankAccount;
            }
                , {
                    body: t.Object({
                        accountNumber: t.String(),
                        accountName: t.String(),
                        bankName: t.String(),
                    }),
                    detail: {
                        tags: ['Bank Account']
                    },
                })

            .delete('/:id', async ({ db, params }) => {
                const { id } = params;
                const bankAccount = await db.bankAccounts.delete({
                    where: {
                        id: parseInt(id)
                    }
                })
                return bankAccount;
            }
                , {
                    detail: {
                        tags: ['Bank Account']
                    },
                })

            .get('/:id/transactions', async ({ db, params }) => {
                const { id } = params;
                const bankAccount = await db.bankAccounts.findUnique({
                    where: {
                        id: parseInt(id)
                    },
                    select: {
                        bankTransactions: {
                            orderBy: {
                                id: 'desc'
                            }
                        },
                    }
                })

                const data = bankAccount?.bankTransactions.map((item) => item)
                return data;
            }
                , {
                    detail: {
                        tags: ['Bank Account']
                    },
                })

            .post('/:id/transactions', async ({ db, params, body, invoiceCode }) => {
                const { id } = params;
                const { amount, type, description, toBankAccountId } = body;

                const bankAccount = await db.bankAccounts.findUnique({
                    where: { id: parseInt(id) },
                    select: { id: true, balance: true, bankName: true, accountName: true, accountNumber: true }
                });



                const { balance } = bankAccount ?? { balance: 0 }


                const isTransfer = type === 'Transfer' ? true : false

                const newBalance = type === 'Debit' ? balance + amount : balance - amount

                let newDescription = ""

                if (description) {
                    newDescription = type === 'Debit' ? description : "Penarikan " + description
                } else {
                    newDescription = type === 'Debit' ? "Setoran " : "Penarikan "
                }

                if (!isTransfer) {
                    const bankTransaction = await db.bankTransactions.create({
                        data: {
                            amount,
                            transactionType: type,
                            transactionDate: new Date(),
                            transactionCode: "TRS-" + invoiceCode + "-" + Math.floor(Math.random() * 1000),
                            description: newDescription,
                            bankAccounts: {
                                connect: {
                                    id: parseInt(id)
                                }
                            }
                        }
                    })

                    const updateBankAccount = await db.bankAccounts.update({
                        where: {
                            id: parseInt(id)
                        },
                        data: {
                            balance: newBalance
                        }
                    })
                    return {
                        bankTransaction,
                        updateBankAccount
                    };
                } else {
                    if (type === 'Transfer') {
                        if (!toBankAccountId) {
                            throw new Error('Target bank account ID is required for transfers');
                        }

                        const targetBankAccount = await db.bankAccounts.findUnique({
                            where: { id: toBankAccountId },
                            select: { id: true, balance: true, bankName: true, accountName: true, accountNumber: true }
                        });

                        if (!targetBankAccount) {
                            throw new Error('Target bank account not found');
                        }

                        // Check balance for current bank account
                        if (balance < amount) {
                            throw new Error('Insufficient balance');
                        }


                        // Decrease the balance of the current bank account
                        await db.bankAccounts.update({
                            where: { id: parseInt(id) },
                            data: { balance: balance - amount }
                        });

                        // Increase the balance of the target bank account
                        await db.bankAccounts.update({
                            where: { id: toBankAccountId },
                            data: { balance: targetBankAccount.balance + amount }
                        });

                        // Create a transaction for current bank 
                        const bankTransaction = await db.bankTransactions.create({
                            data: {
                                amount,
                                transactionType: type,
                                transactionDate: new Date(),
                                transactionCode: "TRS-" + invoiceCode + "-" + Math.floor(Math.random() * 1000),
                                description: `Transfer Ke rekening ${targetBankAccount.bankName} ${targetBankAccount.accountNumber}`,
                                bankAccounts: { connect: { id: parseInt(id) } }
                            }
                        });

                        // Create a transaction for target bank
                        if (bankAccount) {
                            await db.bankTransactions.create({
                                data: {
                                    amount,
                                    transactionType: type,
                                    transactionDate: new Date(),
                                    transactionCode: "TRS-" + invoiceCode + "-" + Math.floor(Math.random() * 1000),
                                    description: `Transfer Dari rekening ${bankAccount.bankName} ${bankAccount.accountNumber}`,
                                    bankAccounts: { connect: { id: toBankAccountId } }
                                }
                            });
                        }


                        return {
                            bankTransaction
                        };
                    }
                }
            }
                , {
                    body: t.Object({
                        amount: t.Number(),
                        type: t.String(),
                        description: t.Optional(t.String()),
                        toBankAccountId: t.Optional(t.Number())
                    }),
                    detail: {
                        tags: ['Bank Account']
                    },
                })

    })