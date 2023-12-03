import Elysia from "elysia"
import { ctx } from "../context/context"
import { userODT } from "../model/model"
import bearer from "@elysiajs/bearer"



export const usersRoutes = new Elysia()
    .use(bearer())
    .model(userODT)
    .group('/users', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query, set }) => {

                const { _page, _end, _sort, _order } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };
                const users = await db.users.findMany(
                    {
                        orderBy,
                        skip: offset,
                        take: limit,
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true
                        }
                    }
                )
                return users
            },
                {
                    detail: {
                        tags: ['Users']
                    },
                }
            )
            .get('/:id', async ({ db, params }) => {
                const user = await db.users.findUnique({
                    where: {
                        id: parseInt(params.id)
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                })
                return user
            }, {
                detail: {
                    tags: ['Users']
                },
            })
            .put('/:id', async ({ db, body, params }) => {
                const user = await db.users.update({
                    where: {
                        id: parseInt(params.id),
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    },
                    data: body
                })
                return user
            }
                , {
                    body: userODT.update,
                    response: {
                        200: userODT.response
                    },
                    detail: {
                        tags: ['Users']
                    },
                })
            .delete('/:id', async ({ db, params }) => {
                const user = await db.users.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
                return user
            }
                , {
                    response: {
                        200: userODT.response
                    },
                    detail: {
                        tags: ['Users']
                    },
                })

    })
