import Elysia, { t } from "elysia"
import { ctx } from "../context/context"
import { farmerODT } from "../model/model"



export const farmersRoutes = new Elysia()

    .model(farmerODT)
    .group('/farmers', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query, set }) => {
                const { _page, _end, _sort, _order, q } = query;

                const count = await db.farmers.count()

                const limit = +(_end ?? count);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };



                const farmers = await db.farmers.findMany(
                    {
                        orderBy,
                        skip: offset,
                        take: limit,
                        where: {
                            OR: [
                                {
                                    code: {
                                        contains: q ?? ''
                                    }
                                },
                                {
                                    name: {
                                        contains: q ?? ''
                                    }
                                },
                                {
                                    address: {
                                        contains: q ?? ''
                                    }
                                },
                                {
                                    phone: {
                                        contains: q ?? ''
                                    }
                                }
                            ]
                        },
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            address: true,
                            phone: true,
                            created_at: true,
                        }
                    }
                )

                if (farmers) {
                    set.headers['x-total-count'] = `${count}`
                }

                return farmers
            },
                {
                    detail: {
                        tags: ['Farmers']
                    },
                })
            .post('/', async ({ db, body }) => {
                const { email, name, address, phone } = body;

                const isEmailExist = await db.farmers.findUnique({
                    where: {
                        code: email
                    }
                })

                if (isEmailExist) {
                    throw new Error('Email already exist')
                }

                const farmer = await db.farmers.create({
                    data: {
                        name,
                        address,
                        phone,
                        code: email
                    }
                })
                return farmer
            },
                {
                    body: t.Object({
                        email: t.String(),
                        name: t.String(),
                        address: t.String(),
                        phone: t.String(),
                    }),
                    detail: {
                        tags: ['Farmers']
                    },
                })
            .get('/:id', async ({ db, params }) => {
                const farmer = await db.farmers.findUnique({
                    where: {
                        id: parseInt(params.id)
                    },
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        address: true,
                        phone: true,
                        farmer_orders: {
                            select: {
                                id: true,
                                transactionCode: true,
                                transactionTotal: true,
                                transactionType: true,
                                transactionDate: true,
                                bankTransactions: {
                                    select: {
                                        id: true,
                                        amount: true,
                                        transactionType: true,
                                        description: true,
                                        transactionDate: true,
                                    }
                                },
                            }
                        },
                        created_at: true,
                    }
                })

                if (farmer) {
                    const { farmer_orders: farmerOrders, ...otherProps } = farmer;
                    const bankTransactions = farmerOrders.flatMap(order => order.bankTransactions);
                    const bankTransactionDescriptions = bankTransactions.map(transaction => transaction.description);
                    return { ...otherProps, farmerOrders, description: bankTransactionDescriptions, bankTransactions };
                }

                return null;
            }
                , {

                    detail: {
                        tags: ['Farmers']
                    },
                })

            .get('/:id/transactions', async ({ db, params }) => {
                const { id } = params;
                const transactions = await db.farmerOrder.findMany({
                    where: {
                        farmerId: parseInt(id)
                    },
                    select: {
                        id: true,
                        transactionCode: true,
                        transactionTotal: true,
                        transactionType: true,
                        transactionDate: true,
                        bankTransactions: {
                            select: {
                                id: true,
                                amount: true,
                                transactionType: true,
                                description: true,
                                transactionDate: true,
                            }
                        },
                        created_at: true,
                    }
                })
                return transactions.map(transaction => ({
                    ...transaction,
                    description: transaction.bankTransactions[0]?.description // Return the description field from BankTransactions
                }));
            }
                , {
                    detail: {
                        tags: ['Farmers']
                    },
                })

            .put('/:id', async ({ db, body, params }) => {
                const farmer = await db.farmers.update({
                    where: {
                        id: parseInt(params.id)
                    },
                    data: body
                })
                return farmer
            }
                , {

                    body: farmerODT.create,
                    response: {
                        200: farmerODT.response
                    },
                    detail: {
                        tags: ['Farmers']
                    },
                })
            .delete('/:id', async ({ db, params }) => {
                const farmer = await db.farmers.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
                return farmer
            }
                , {
                    response: {
                        200: farmerODT.response
                    },
                    detail: {
                        tags: ['Farmers']
                    },
                })

            .post('/:id/order', async ({ db, params, body, invoiceCode }) => {
                const { transactionTotal, transactionType, bankAccountId } = body;

                const farmer = await db.farmers.findUnique({
                    where: {
                        id: parseInt(params.id)
                    }
                });

                if (!farmer) {
                    throw new Error('Farmer not found');
                }

                const transactionCode = `INV-FAR-${farmer.name}-${invoiceCode}-${Math.floor(Math.random() * 1000) + 1}}`;

                const farmerOrder = await db.farmerOrder.create({
                    data: {
                        transactionTotal,
                        transactionType,
                        farmerId: farmer!.id,
                        transactionCode,
                        transactionDate: new Date() // Add transactionDate property
                    }
                });

                const bankAccount = await db.bankAccounts.findUnique({
                    where: {
                        id: bankAccountId
                    }
                });

                if (!bankAccount) {
                    throw new Error('Bank Account not found');
                }

                let newBalance = bankAccount!.balance;
                if (transactionType === 'Saving') {
                    newBalance += transactionTotal;
                } else if (transactionType === 'Loan') {
                    newBalance -= transactionTotal;
                } else if (transactionType === 'Loan Payment') {
                    newBalance += transactionTotal;
                } else if (transactionType === 'Saving Withdrawal') {
                    newBalance -= transactionTotal;
                }

                const bankTransaction = await db.bankTransactions.create({
                    data: {
                        amount: transactionTotal,
                        transactionType: transactionType,
                        bankAccountId: bankAccount.id,
                        description: `Transaction for ${farmer!.name}`,
                        transactionDate: new Date(), // Add transactionDate property
                        transactionCode,
                        farmerOrderId: farmerOrder.id
                    }
                });

                await db.bankAccounts.update({
                    where: {
                        id: bankAccount.id
                    },
                    data: {
                        balance: newBalance
                    }
                });

                return { farmerOrder, bankTransaction };
            }, {
                body: t.Object({
                    farmerId: t.Number(),
                    transactionTotal: t.Number(),
                    transactionType: t.Union([t.Literal('Saving'), t.Literal('Loan'), t.Literal('Loan Payment'), t.Literal('Saving Withdrawal')]),
                    bankAccountId: t.Number()
                }),
                detail: {
                    tags: ['Farmers']
                },
            })

    })
