import Elysia from "elysia"
import { ctx } from "../context/context"
import { supplierODT } from "../model/model"



export const suppliersRoutes = new Elysia()

    .model(supplierODT)
    .group('/suppliers', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order } = query;
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
                        select: {
                            id: true,
                            code: true,
                            name: true

                        }
                    }
                )
                return suppliers
            }, {

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
            .delete('/:id', async ({ db, params }) => {
                const supplier = await db.suppliers.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
                return supplier
            }, {
                detail: {
                    tags: ['Suppliers']
                },
            })

    })
