import Elysia, { t } from "elysia"
import { ctx } from "../context/context"
import { supplierODT } from "../model/model"



export const suppliersRoutes = new Elysia()

    .model(supplierODT)
    .group('/suppliers', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };
                const suppliers = await db.suppliers.findMany(
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
                                }
                            ]
                        },
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            created_at: true,
                            factories: true,
                            vehicles: true,
                            prices: true,
                            supplierOrders: true,
                        }
                    }
                )
                return suppliers
            }, {

                detail: {
                    tags: ['Suppliers']
                },

            })
            .get('/:id', async ({ db, params }) => {
                const supplier = await db.suppliers.findUnique({
                    where: {
                        id: parseInt(params.id)
                    },
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        created_at: true,
                    }
                })
                return supplier
            }
                , {

                    detail: {
                        tags: ['Suppliers']
                    },
                })
            .post('/', async ({ db, body }) => {
                const supplier = await db.suppliers.create({
                    data: body
                })
                return supplier
            },
                {

                    body: supplierODT.create,
                    detail: {
                        tags: ['Suppliers']
                    },
                })
            .put('/:id', async ({ db, body, params }) => {
                const supplier = await db.suppliers.update({
                    where: {
                        id: parseInt(params.id)
                    },
                    data: body
                })
                return supplier
            }
                , {

                    body: supplierODT.create,
                    detail: {
                        tags: ['Suppliers']
                    },
                })
            .delete('/:id', ({ db, params }) => {
                return db.suppliers.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
            }, {
                detail: {
                    tags: ['Suppliers']
                },
            })

            .post('/:id/price', async ({ db, params, body }) => {
                const { id } = params;

                const relatedFactory = await db.factories.findFirst({
                    where: {
                        suppliers: {
                            some: {
                                id: parseInt(id),
                            },
                        },
                    },
                });

                const latestFactoryPrice = await db.factoryPrices.findFirst({
                    where: {
                        factoryId: relatedFactory!.id,
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                });

                if (latestFactoryPrice!.price > body.price) {
                    throw new Error('Factory price is higher than supplier price');
                }

                const factory = await db.suppliers.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        prices: {
                            create: [{
                                price: body.price,
                                isPPN: body.isPPN,
                                factoryPriceId: latestFactoryPrice!.id,
                            }]
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
            }, {
                body: t.Object({
                    price: t.Number(),
                    isPPN: t.Boolean(),
                }),
                detail: {
                    tags: ['Suppliers']
                },
            })

    })
