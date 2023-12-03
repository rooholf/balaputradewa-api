import Elysia, { t } from "elysia"
import { ctx } from "../context/context"
import { farmerODT } from "../model/model"



export const farmersRoutes = new Elysia()

    .model(farmerODT)
    .group('/farmers', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order } = query;
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
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            address: true,
                            phone: true
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

    })
