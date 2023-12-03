import Elysia from "elysia"
import { ctx } from "../context/context"
import { vehicleODT } from "../model/model"



export const vehiclesRoutes = new Elysia()

    .model(vehicleODT)
    .group('/vehicles', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order } = query;
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
                        select: {
                            id: true,
                            plate: true,
                            color: true,
                            brand: true,
                            chassis: true,
                        }
                    }
                )
            }, {
                detail: {
                    tags: ['Vehicles']
                },

            })
            .post('/', async ({ db, body }) => {
                const vehicle = await db.vehicles.create({
                    data: body
                })
                return vehicle
            },
                {

                    body: vehicleODT.create,
                    response: {
                        200: vehicleODT.response
                    },
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