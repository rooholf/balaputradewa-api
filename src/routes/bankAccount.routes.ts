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
                return {
                    data: bankAccounts,
                    total: count
                }
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
                return bankAccount
            }, {
                detail: {
                    tags: ['Bank Account']
                },
            })

            .post('/', async ({ db, body }) => {
                const bankAccount = await db.bankAccounts.create({
                    data: {
                        ...body
                    }
                })
                return bankAccount
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
                return bankAccount
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
                return bankAccount
            }
                , {
                    detail: {
                        tags: ['Bank Account']
                    },
                })
    })