import Elysia, { t } from "elysia";
import { ctx } from "../context/context";



export const ordersRoutes = new Elysia()
    .use(ctx)
    .group('/orders', (app) => {
        return app
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q, _status, 'supplier.id': supplierId, 'factory.id': factoryId } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'desc';

                const orderBy = { [sort]: order };

                const orders = [];

                if (supplierId) {
                    const whereSupplier = { id: Number(supplierId) };
                    const supplierOrdersQue = await db.supplierOrders.findMany({
                        where: {
                            supplier: whereSupplier,
                            OR: [
                                {
                                    invCode: {
                                        contains: q ?? '',
                                        mode: 'insensitive'
                                    }
                                },

                                {
                                    status: {
                                        contains: _status ?? '',
                                        mode: 'insensitive'
                                    }
                                },

                            ]
                        },
                        orderBy,
                        skip: offset,
                        take: limit,
                        select: {
                            id: true,
                            invCode: true,
                            invTotal: true,
                            invDate: true,
                            status: true,
                            qty: true,
                            supplier: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true,
                                    products: true,
                                    prices: {
                                        select: {
                                            id: true,
                                            price: true,
                                            isPPN: true,
                                            factoryPrice: {
                                                select: {
                                                    id: true,
                                                    price: true,
                                                    factory: {
                                                        select: {
                                                            id: true,
                                                            name: true,
                                                            code: true,
                                                        }
                                                    }
                                                }
                                            },
                                            created_at: true,

                                        }
                                    },
                                }
                            },
                            supplierPrice: {
                                select: {
                                    id: true,
                                    price: true,
                                    isPPN: true,
                                    factoryPrice: {
                                        select: {
                                            id: true,
                                            price: true,
                                            factory: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    code: true,
                                                }
                                            }
                                        }
                                    },
                                    created_at: true,

                                }
                            },
                            vehicleOrders: true,
                            created_at: true,
                        }
                    });

                    const supplierOrders = supplierOrdersQue.map(order => ({
                        ...order,
                        profits: (order.supplierPrice.factoryPrice.price * order.qty) - order.invTotal,
                    }));

                    orders.push(...supplierOrders);
                }

                if (factoryId) {
                    const whereFactory = { id: Number(factoryId) };
                    const factoryOrders = await db.factoryOrders.findMany({
                        where: {
                            factory: whereFactory,
                            OR: [
                                {
                                    invCode: {
                                        contains: q ?? '',
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    status: {
                                        contains: _status ?? '',
                                        mode: 'insensitive'
                                    }
                                },


                            ]
                        },
                        orderBy,
                        skip: offset,
                        take: limit,
                        select: {
                            id: true,
                            invCode: true,
                            invTotal: true,
                            invDate: true,
                            status: true,
                            qty: true,
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
                            vehicleOrders: true,
                            created_at: true,
                        }
                    });
                    orders.push(...factoryOrders);
                }


                if (!supplierId && !factoryId) {
                    const supplierOrders = await db.supplierOrders.findMany({
                        orderBy,
                        skip: offset,
                        take: limit,
                        where: {
                            OR: [
                                {
                                    invCode: {
                                        contains: q ?? '',
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    status: {
                                        contains: _status ?? '',
                                        mode: 'insensitive'
                                    }
                                },
                            ]
                        },
                        select: {
                            id: true,
                            invCode: true,
                            invTotal: true,
                            invDate: true,
                            status: true,
                            qty: true,
                            supplier: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true,
                                    prices: {
                                        select: {
                                            id: true,
                                            price: true,
                                            isPPN: true,
                                            factoryPrice: {
                                                select: {
                                                    id: true,
                                                    price: true,
                                                    factory: {
                                                        select: {
                                                            id: true,
                                                            name: true,
                                                            code: true,
                                                        }
                                                    }
                                                }
                                            },
                                            created_at: true,

                                        }
                                    },
                                }
                            },
                            supplierPrice: true,
                            vehicleOrders: true,
                            created_at: true,
                        }
                    });
                    const factoryOrders = await db.factoryOrders.findMany({
                        where: {
                            OR: [
                                {
                                    invCode: {
                                        contains: q ?? '',
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    status: {
                                        contains: _status ?? '',
                                        mode: 'insensitive'
                                    }
                                },
                            ]
                        },
                        orderBy,
                        skip: offset,
                        take: limit,
                        select: {
                            id: true,
                            invCode: true,
                            invTotal: true,
                            invDate: true,
                            status: true,
                            qty: true,
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
                            vehicleOrders: true,
                            created_at: true,
                        }
                    });

                    orders.push(...supplierOrders, ...factoryOrders);
                }

                return orders;
            }, {
                detail: {
                    tags: ['Orders']
                },
            })
    })

    .group('/recentOrders', (app) => {
        return app
            .get('/', async ({ db }) => {
                const supplierOrders = await db.supplierOrders.findMany({
                    where: {
                        status: 'Pending'
                    },
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 5,
                    select: {
                        id: true,
                        invCode: true,
                        invTotal: true,
                        invDate: true,
                        status: true,
                        qty: true,
                        supplier: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                prices: true,
                            }
                        },
                        supplierPrice: true,
                        vehicleOrders: true,
                        created_at: true,
                    }
                });

                return supplierOrders;
            }, {
                detail: {
                    tags: ['Recent Orders']
                },
            })
    })