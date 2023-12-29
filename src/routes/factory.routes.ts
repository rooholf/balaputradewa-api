import Elysia, { t } from "elysia"
import { ctx } from "../context/context"
import { factoryODT, } from "../model/model"


export const factoryRoutes = new Elysia()

    .model(factoryODT)
    .group('/factories', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };
                const factories = await db.factories.findMany(
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
                                    suppliers: {
                                        some: {
                                            name: {
                                                contains: q ?? ''
                                            }
                                        }
                                    }
                                },
                                {
                                    orders: {
                                        some: {
                                            invCode: {
                                                contains: q ?? ''
                                            }
                                        }
                                    }
                                }

                            ]
                        },
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            suppliers: true,
                            prices: true,
                            orders: true,
                        },

                    }
                )
                return factories
            },
                {
                    detail: {
                        tags: ['Factories']
                    },
                })
            .post('/', async ({ db, body }) => {
                const { code, name, price } = body
                const factory = await db.factories.create({
                    data: {
                        code,
                        name,
                        prices: {
                            create: {
                                price: body.price
                            }
                        }
                    }
                })
                return factory
            }
                , {
                    body: t.Object({
                        code: t.String(),
                        name: t.String(),
                        price: t.Number(),
                    }),

                    detail: {
                        tags: ['Factories']
                    },
                })
            .get('/:id', async ({ db, params }) => {
                const factory = await db.factories.findUnique({
                    where: {
                        id: parseInt(params.id)
                    },
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        suppliers: true,
                        prices: true,
                        orders: true,
                        bankAccounts: true,
                    }
                })
                return factory
            }
                , {

                    detail: {
                        tags: ['Factories']
                    },
                })
            .put('/:id', async ({ db, body, params }) => {
                const factory = await db.factories.update({
                    where: {
                        id: parseInt(params.id)
                    },
                    data: body
                })
                return factory
            }
                , {

                    body: factoryODT.create,
                    response: {
                        200: factoryODT.response
                    },
                    detail: {
                        tags: ['Factories']
                    },
                })
            .delete('/:id', async ({ db, params }) => {
                const factory = await db.factories.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
                return factory
            }
                , {
                    response: {
                        200: factoryODT.response
                    },
                    detail: {
                        tags: ['Factories']
                    },
                })

            .post('/:id/price', async ({ db, params, body }) => {
                const { id } = params;
                const factory = await db.factories.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        prices: {
                            create: {
                                price: body.price
                            }
                        }
                    },
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        prices: true,
                    }
                })
                return factory
            }
                , {
                    body: t.Object({
                        price: t.Number()
                    }),
                    detail: {
                        tags: ['Factories']
                    },
                })
    })

