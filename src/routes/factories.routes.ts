import Elysia from "elysia"
import { ctx } from "../context/context"
import { factoryODT, } from "../model/model"


export const factoriesRoutes = new Elysia()

    .model(factoryODT)
    .group('/factories', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order } = query;
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
                        select: {
                            id: true,
                            code: true,
                            name: true,
                        }
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
                const factory = await db.factories.create({
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

    })
