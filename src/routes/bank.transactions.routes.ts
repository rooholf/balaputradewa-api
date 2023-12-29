import Elysia, { t } from "elysia";
import { ctx } from "../context/context";
import moment from "moment";

export const bankTransactions = new Elysia()
    .use(ctx)
    .group('/transaction', (app) => {
        return app
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };

                const transactions = await db.bankTransactions.findMany(
                    {
                        orderBy,
                        skip: offset,
                        take: limit,
                        where: {
                            OR: [
                                {
                                    transactionCode: {
                                        contains: q ?? ''
                                    },
                                },
                                {
                                    transactionType: {
                                        contains: q ?? ''
                                    },
                                },
                                {
                                    transactionDate: {
                                        lte: q ? new Date(q) : undefined,
                                        gte: q ? new Date(q) : undefined
                                    },
                                },

                                {
                                    amount: {
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
                            transactionCode: true,
                            transactionDate: true,
                            transactionType: true,
                            description: true,
                            amount: true,
                            created_at: true,
                            updated_at: true,
                        }
                    }
                )

                return transactions
            }, {

                detail: {
                    tags: ['Bank Transaction']
                },

            })

            .post('/', async ({ db, body }) => {
                const { transactionType, amount, farmerOrderId, bankAccountId } = body;

                const transaction = await db.bankTransactions.create({
                    data: {
                        transactionType,
                        amount,
                        description: `Transaction ${transactionType} for farmer order ${farmerOrderId}`,
                        farmerOrderId,
                        bankAccountId,
                        transactionDate: new Date(),
                        transactionCode: `TRX-${moment().format('YYYYMMDDHHmmss')}`,
                    }
                })


                return transaction
            }
                , {
                    detail: {
                        tags: ['Bank Transaction']
                    },
                    body: t.Object({
                        transactionType: t.String(),
                        amount: t.Number(),
                        farmerOrderId: t.Number(),
                        bankAccountId: t.Number(),
                    }),
                })


            .get('/:id', async ({ db, params }) => {
                const { id } = params;
                const transaction = await db.bankTransactions.findUnique({
                    where: {
                        id: parseInt(id)
                    },
                    select: {
                        id: true,
                        transactionCode: true,
                        transactionDate: true,
                        transactionType: true,
                        supplierOrder: true,
                        farmerOrder: true,
                        factoryOrder: true,
                        amount: true,
                        supplierInvCode: true,
                        factoryInvCode: true,
                        farmerOrderId: true,
                        created_at: true,
                        updated_at: true,
                    }
                })

                if (!transaction) {
                    throw new Error('Transaction not found');
                }

                // Create a new object and only add properties that are not null
                const filteredTransaction = Object.fromEntries(
                    Object.entries(transaction).filter(([_, v]) => v != null)
                );

                return filteredTransaction;
            }, {
                detail: {
                    tags: ['Bank Transaction']
                },
            })

            .get('/report', async ({ db, query }) => {
                const { _startDate, _endDate, factoryId } = query;

                let whereClause = {};

                const gte = _startDate ? moment(_startDate).startOf('day') : moment().subtract(30, 'days').startOf('day');
                const lte = _endDate ? moment(_endDate).endOf('day') : moment().endOf('day');


                if (gte && lte) {
                    whereClause = {
                        transactionDate: {
                            gte: new Date(gte.format()),
                            lte: new Date(lte.format()),
                        },
                    };
                }

                const transactions = await db.bankTransactions.findMany({
                    where: whereClause,
                    select: {
                        id: true,
                        transactionCode: true,
                        transactionDate: true,
                        transactionType: true,
                        supplierOrder: true,
                        farmerOrder: true,
                        factoryOrder: {
                            select: {
                                factoryId: true,
                            }
                        },
                        amount: true,
                        description: true,
                        created_at: true,
                        updated_at: true,
                    }
                });

                const supplierTransactions = await db.supplierOrders.findMany({
                    where: {
                        invDate: {
                            gte: new Date(gte.format()),
                            lte: new Date(lte.format()),
                        }
                    },
                    select: {
                        id: true,
                        invCode: true,
                        invDate: true,
                        invTotal: true,
                        status: true,
                        supplier: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            }
                        },
                        supplierPrice: {
                            select: {
                                id: true,
                                price: true,
                            }
                        },
                        created_at: true,
                    }
                });

                const factoryTransactions = await db.factoryOrders.findMany({
                    where: {
                        invDate: {
                            gte: new Date(gte.format()),
                            lte: new Date(lte.format()),
                        },
                        factoryId: factoryId ? { equals: parseInt(factoryId) } : undefined // Add the factoryId condition
                    },
                    select: {
                        id: true,
                        invCode: true,
                        invDate: true,
                        invTotal: true,
                        factory: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            }
                        },
                        factoryPrice: {
                            select: {
                                id: true,
                                price: true,
                            }
                        },
                        BankTransactions: {
                            select: {
                                id: true,
                                transactionCode: true,
                                transactionDate: true,
                                transactionType: true,
                                amount: true,
                                description: true,
                                created_at: true,
                            }
                        },
                        created_at: true,
                    }
                });



                const pendingTransaction = supplierTransactions.filter((transaction) => transaction.status === 'Pending');

                const sumPendingTransaction = pendingTransaction.reduce((acc, transaction) => {
                    return acc + transaction.invTotal;
                }, 0);


                const grossIncome = transactions.reduce((acc, transaction) => {
                    if (transaction.transactionType === 'Debit') {
                        return acc + transaction.amount;
                    } else {
                        return acc;
                    }
                }
                    , 0);

                const countTransaction = transactions.reduce((acc, transaction) => {
                    if (transaction.transactionType === 'Debit') {
                        return acc + 1;
                    } else {
                        return acc;
                    }
                }
                    , 0);

                const profit = transactions.reduce((acc, transaction) => {
                    if (transaction.transactionType === 'Debit') {
                        return acc + transaction.amount;
                    } else {
                        return acc - transaction.amount;
                    }
                }, 0);

                const cost = transactions.reduce((acc, transaction) => {
                    if (transaction.transactionType === 'Credit') {
                        return acc + transaction.amount;
                    } else {
                        return acc;
                    }
                }, 0);



                return {
                    data: transactions,
                    pendingCost: sumPendingTransaction,
                    grossIncome,
                    profit,
                    cost,
                    countTransaction,
                    gte,
                    lte
                };
            }, {
                detail: {
                    tags: ['Bank Transaction']
                },
            })

    })

