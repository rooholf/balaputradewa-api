import Elysia, { t } from "elysia"
import { ctx } from "../context/context"
import { vehicleODT } from "../model/model"



export const vehiclesRoutes = new Elysia()

    .model(vehicleODT)
    .group('/vehicles', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };
                const vehicles = await db.vehicles.findMany(
                    {
                        orderBy,
                        skip: offset,
                        take: limit,
                        where: {
                            OR: [
                                {
                                    plate: {
                                        contains: q ?? '',

                                    }
                                },
                            ]
                        },
                        select: {
                            id: true,
                            plate: true,
                            color: true,
                            brand: true,
                            chassis: true,
                            supplier: {
                                select: {
                                    id: true,
                                    code: true,
                                    name: true,
                                    prices: {
                                        select: {
                                            id: true,
                                            price: true,
                                            isPPN: true,
                                            created_at: true,
                                        },
                                        orderBy: {
                                            created_at: 'desc'
                                        },
                                        take: 1,
                                    }
                                }
                            }
                        }
                    }
                )
                const vehiclesWithPrice = vehicles.map((vehicle) => {
                    const { supplier: { id, code, name, prices: [price] }, ...rest } = vehicle;
                    return { ...rest, supplier: { id, code, name }, price };
                });

                return vehiclesWithPrice;
            }, {
                detail: {
                    tags: ['Vehicles']
                },

            })
            .get('/:id', async ({ db, params }) => {
                const vehicle = await db.vehicles.findUnique({
                    where: {
                        id: parseInt(params.id)
                    },
                    select: {
                        id: true,
                        plate: true,
                        color: true,
                        brand: true,
                        chassis: true,
                        supplier: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                                prices: {
                                    select: {
                                        id: true,
                                        price: true,
                                        isPPN: true,
                                        created_at: true,
                                    },
                                    orderBy: {
                                        created_at: 'desc'
                                    },
                                    take: 1,
                                }
                            }
                        }
                    }
                })
                return vehicle
            }
                , {

                    detail: {
                        tags: ['Vehicles']
                    },
                })
            .post('/', async ({ db, body }) => {
                const { plate, color, brand, chassis, supplierId } = body
                const supplier = await db.suppliers.findUnique({
                    where: {
                        id: supplierId
                    }
                })
                if (!supplier) {
                    throw new Error('Supplier not found')
                }

                const vehicleExist = await db.vehicles.findFirst({
                    where: {
                        plate: plate
                    }
                })

                if (vehicleExist) {
                    throw new Error('Vehicle already exists')
                }

                const vehicle = await db.vehicles.create({
                    data: body
                })
                return vehicle
            },
                {
                    body: t.Object({
                        plate: t.String(),
                        color: t.String(),
                        brand: t.String(),
                        chassis: t.String(),
                        supplierId: t.Number(),
                    }),
                    detail: {
                        tags: ['Vehicles']
                    },
                })
            .put('/:id', async ({ db, body, params }) => {
                const vehicle = await db.vehicles.update({
                    where: {
                        id: parseInt(params.id)
                    },
                    data: body
                })
                return vehicle
            }
                , {
                    body: vehicleODT.create,
                    response: {
                        200: vehicleODT.response
                    },
                    detail: {
                        tags: ['Vehicles']
                    },
                })
            .delete('/:id', async ({ db, params }) => {
                const vehicle = await db.vehicles.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
                return vehicle
            }
                , {
                    response: {
                        200: vehicleODT.response
                    },
                    detail: {
                        tags: ['Vehicles']
                    },
                })

    })