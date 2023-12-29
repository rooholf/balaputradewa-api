import Elysia, { t } from "elysia";
import { ctx } from "../context/context";
import { Prisma } from "@prisma/client";
import moment from "moment";

export const dailyOrders = new Elysia()
    .use(ctx)
    .group('/dailyOrders', (app) => {
        return app
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, _status, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };

                const whereConditions = [];

                if (q) {
                    const invTotalNumber = parseInt(q);
                    if (!isNaN(invTotalNumber)) {
                        whereConditions.push({ invTotal: { equals: invTotalNumber } });
                    }
                    whereConditions.push({ invCode: { contains: q, mode: 'insensitive' as Prisma.QueryMode } });
                }

                if (_status) {
                    whereConditions.push({ status: { equals: _status, mode: 'insensitive' as Prisma.QueryMode } });
                }

                const invoices = await db.factoryOrders.findMany(
                    {
                        orderBy,
                        skip: offset,
                        take: limit,
                        where: whereConditions.length > 0 ? { AND: whereConditions } : {},
                        select: {
                            id: true,
                            invCode: true,
                            invTotal: true,
                            invDate: true,
                            status: true,
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
                            vehicleOrders: {
                                select: {
                                    id: true,
                                    qty: true,
                                    plate: true,
                                }
                            },
                        }
                    }
                );

                const data = [];

                const gte = moment().subtract(20, 'days').startOf('day');
                const lte = moment().endOf('day');

                const dates = [];
                const startDate = moment(gte).startOf('day');
                const endDate = moment(lte).endOf('day');
                let currentDate = startDate.clone();

                while (currentDate.isSameOrBefore(endDate)) {
                    dates.push(currentDate.toDate());
                    currentDate.add(1, 'day');
                }

                for (const date of dates) {
                    const value = invoices.filter(invoice => {
                        const invoiceDate = moment(invoice.invDate).startOf('day').add(1, 'day').toDate(); // Add 1 day to invDate

                        return moment(invoiceDate).isSame(date, 'day');
                    }).length;

                    data.push({ date, value });
                }


                //calculate trend of orders
                const trend = data.reduce((acc, curr) => {
                    return acc + curr.value;
                }, 0);

                // Calculate total
                const total = invoices.length;

                return {
                    data,
                    total,
                    trend,
                };
            });
    });