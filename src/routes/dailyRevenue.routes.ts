import Elysia from "elysia";
import { ctx } from "../context/context";
import { Prisma, PrismaClient } from "@prisma/client";
import moment from "moment";

const db = new PrismaClient();

export const dailyRevenue = new Elysia()
    .use(ctx)
    .group('/dailyRevenue', (app) => {
        return app
            .get('/', async ({ query }) => {
                const { _end, _sort, _order, _status, start, end, q } = query;
                const limit = +(_end ?? 10);
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const gte = start ? moment(start, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').toDate() : undefined;
                const lte = end ? moment(end, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').toDate() : undefined;

                const daysDifference = moment(lte).diff(moment(gte), 'days');
                const previousPeriodGte = moment(gte).subtract(daysDifference, 'days').toDate();
                const previousPeriodLte = moment(lte).subtract(daysDifference, 'days').toDate();

                const whereConditions: Prisma.SupplierOrdersWhereInput[] = [];

                if (q) {
                    const invTotalNumber = parseInt(q);
                    if (!isNaN(invTotalNumber)) {
                        whereConditions.push({ invTotal: { equals: invTotalNumber } });
                    }
                    whereConditions.push({ invCode: { contains: q, } });
                }

                if (_status) {
                    whereConditions.push({ status: { equals: _status, } });
                }

                if (lte || gte) {
                    whereConditions.push({
                        invDate: {
                            lte: lte ? new Date(lte) : undefined,
                            gte: gte ? new Date(gte) : undefined
                        }
                    });
                }

                // @ts-ignore
                function calculateTotal(invoices: Prisma.SupplierOrders[]): Prisma.Decimal {
                    return invoices.map((invoice) => {
                        if (invoice.supplierPrice && invoice.supplierPrice.factoryPrice) {
                            const profit = (invoice.supplierPrice.factoryPrice.price - invoice.supplierPrice.price) * invoice.qty;
                            return new Prisma.Decimal(profit);
                        }
                        return new Prisma.Decimal(0);
                    }).reduce((acc, curr) => acc.add(curr), new Prisma.Decimal(0));
                }

                try {
                    const previousPeriodData = await db.supplierOrders.findMany({ // Remove unused variable
                        where: {
                            AND: whereConditions,
                            invDate: {
                                gte: previousPeriodGte,
                                lte: previousPeriodLte
                            }
                        },
                        select: {
                            invTotal: true,
                            invDate: true,
                            qty: true,
                            supplierPrice: {
                                select: {
                                    id: true,
                                    price: true,
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
                                    }
                                }
                            }
                        }
                    });

                    const invoices = await db.supplierOrders.findMany(
                        {
                            where: {
                                AND: whereConditions,
                                invDate: {
                                    gte: gte,
                                    lte: lte
                                }
                            },
                            select: {
                                id: true,
                                invCode: true,
                                invTotal: true,
                                invDate: true,
                                status: true,
                                qty: true,
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
                                BankTransactions: {
                                    select: {
                                        id: true,
                                        amount: true,
                                        transactionDate: true,
                                    }
                                },
                                supplierPrice: {
                                    select: {
                                        id: true,
                                        price: true,
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
                                        }
                                    }
                                }
                            }
                        }
                    );

                    const data = [];

                    if (lte && gte) {
                        const dates = [];
                        const startDate = moment(gte).startOf('day');
                        const endDate = moment(lte).endOf('day');
                        let currentDate = startDate.clone();

                        while (currentDate.isSameOrBefore(endDate)) {
                            dates.push(currentDate.toDate());
                            currentDate.add(1, 'day');
                        }

                        for (const date of dates) {
                            const value = invoices.reduce((acc, invoice) => {
                                const invoiceDate = invoice.BankTransactions?.transactionDate ? moment(invoice.BankTransactions.transactionDate).startOf('day') : null;
                                if (invoiceDate && invoiceDate.isBetween(startDate, endDate, null, '[)') && invoiceDate.isSame(date, 'day')) {
                                    const invoiceValue = (invoice.supplierPrice!.factoryPrice!.price - invoice.supplierPrice!.price) * invoice.qty;
                                    return acc.add(new Prisma.Decimal(invoiceValue));
                                }
                                return acc;
                            }, new Prisma.Decimal(0));
                            data.push({ date, value });
                        }
                    }

                    const total = calculateTotal(invoices);
                    const trend = calculateTotal(previousPeriodData);

                    return {
                        data,
                        total,
                        trend,
                    };
                } catch (error) {

                    return {
                        message: 'An error occurred while fetching the data.',
                    };
                }
            });
    });