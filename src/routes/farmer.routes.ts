import Elysia, { t } from "elysia"
import { ctx } from "../context/context"
import { farmerODT } from "../model/model"



export const farmersRoutes = new Elysia()

    .model(farmerODT)
    .group('/farmers', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
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
                return farmers
            },
                {

                    detail: {
                        tags: ['Farmers']
                    },
                })
            .post('/', async ({ db, body }) => {
                const farmer = await db.farmers.create({
                    data: body
                })
                return farmer
            },
                {

                    body: farmerODT.create,
                    response: {
                        200: farmerODT.response
                    },
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
                        created_at: true,
                    }
                })
                return farmer
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

            .post('/:id/order', async ({ db, params, body }) => {
                const { farmerId, transactionTotal, transactionType, bankAccountId } = body;

                const farmer = await db.farmers.findUnique({
                    where: {
                        id: farmerId
                    }
                });

                if (!farmer) {
                    throw new Error('Farmer not found');
                }

                const transactionCode = `INV/FAR/${farmerId}/${Date.now()}`;

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
                if (transactionType === 'Debit') {
                    newBalance -= transactionTotal;
                } else if (transactionType === 'Credit') {
                    newBalance += transactionTotal;
                }

                const bankTransaction = await db.bankTransactions.create({
                    data: {
                        amount: transactionTotal,
                        transactionType: transactionType,
                        bankAccountId: bankAccount.id,
                        transactionDate: new Date(), // Add transactionDate property
                        transactionCode
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
                    transactionType: t.Union([t.Literal('Credit'), t.Literal('Debit')]),
                    bankAccountId: t.Number()
                }),
                detail: {
                    tags: ['Farmers']
                },
            })

    })
