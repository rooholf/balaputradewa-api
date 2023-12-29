import Elysia, { t } from "elysia"
import { ctx } from "../context/context"
import { supplierODT } from "../model/model"
import { Prisma } from "@prisma/client"



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
                                        contains: q ?? '',
                                        mode: 'insensitive'
                                    },
                                },
                                {
                                    name: {
                                        contains: q ?? '',
                                        mode: 'insensitive'
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

                const data = suppliers.map((supplier) => {
                    const lastCreatedPrice = supplier.prices.slice(-1)[0];
                    const isPPN = lastCreatedPrice?.isPPN ?? false;
                    return {
                        ...supplier,
                        isPPN,
                        lastCreatedPrice,
                    };
                });


                return data
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
                        supplierOrders: true,
                        prices: true,
                        vehicles: true,
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

            .get('/:id/orders', async ({ db, params }) => {
                const { id } = params;
                const orders = await db.supplierOrders.findMany({
                    where: {
                        supplierId: parseInt(id)
                    },
                    select: {
                        id: true,
                        invCode: true,
                        invTotal: true,
                        invDate: true,
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
                })
                return orders
            }
                , {

                    detail: {
                        tags: ['Suppliers']
                    },
                })

            .post('/', async ({ db, body }) => {
                const { code, name, factoryId, address, price, isPPN, productId } = body

                const latestFactoryPrice = await db.factoryPrices.findFirst({
                    where: {
                        factoryId: factoryId,
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                });

                if (latestFactoryPrice!.price < body.price) {
                    throw new Error('Supplier price is higher than factory price');
                }

                const supplier = await db.suppliers.create({
                    data: {
                        code,
                        name,
                        prices: {
                            create: {
                                price,
                                isPPN,
                                factoryPrice: {
                                    connect: {
                                        id: latestFactoryPrice!.id,
                                    },
                                },
                            } as Prisma.SupplierPricesCreateWithoutSupplierInput
                        },
                        address,
                        factories: {
                            connect: {
                                id: factoryId
                            }
                        },
                        products: {
                            connect: {
                                id: productId
                            }
                        }
                    },

                })
                return supplier
            },
                {

                    body: t.Object({
                        code: t.String(),
                        name: t.String(),
                        address: t.String(),
                        price: t.Number(),
                        isPPN: t.Boolean(),
                        productId: t.Number(),
                        factoryId: t.Number(),
                    }),
                    detail: {
                        tags: ['Suppliers']
                    },
                })
            .patch('/:id', async ({ db, body, params }) => {
                const { code, name, factoryId, productId } = body
                const supplier = await db.suppliers.update({
                    where: {
                        id: parseInt(params.id)
                    },
                    data: {
                        code,
                        name,
                        factories: {
                            connect: {
                                id: factoryId
                            }
                        },
                        products: {
                            connect: {
                                id: productId
                            }
                        }
                    }
                })
                return supplier
            }
                , {

                    body: t.Object({
                        code: t.String(),
                        name: t.String(),
                        factoryId: t.Number(),
                        productId: t.Number(),
                    }),
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

                if (!relatedFactory) {
                    throw new Error('No related factory found for this supplier');
                }

                const latestFactoryPrice = await db.factoryPrices.findFirst({
                    where: {
                        factoryId: relatedFactory!.id,
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                });

                if (latestFactoryPrice!.price < body.price) {
                    throw new Error('Supplier price is higher than factory price');
                }

                const supplierPrice = await db.supplierPrices.create({
                    data: {
                        ...body,
                        factoryPriceId: latestFactoryPrice!.id,
                        supplierId: parseInt(id),
                    },
                });

                return supplierPrice
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
