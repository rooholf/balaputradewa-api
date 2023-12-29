import Elysia, { t } from "elysia"
import { ctx } from "../context/context"


export const productRoutes = new Elysia()

    .group('/products', (app) => {
        return app
            .use(ctx)
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };

                const products = await db.products.findMany({
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
                    }
                })

                return products
            }, {
                detail: {
                    tags: ['Products']
                }
            })
    })