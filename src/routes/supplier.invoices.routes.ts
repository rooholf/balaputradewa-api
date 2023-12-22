import Elysia, { t } from "elysia";
import { ctx } from "../context/context";


export const supplierInvoiceRoutes = new Elysia()

    .use(ctx)
    .group('/invoices/supplier', (app) => {
        return app
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };

                const invoices = await db.supplierOrders.findMany(
                    {
                        orderBy,
                        skip: offset,
                        take: limit,
                        where: {
                            OR: [
                                {
                                    invCode: {
                                        contains: q ?? ''
                                    },
                                },
                                {
                                    invTotal: {
                                        equals: parseInt(q ?? '0')
                                    },
                                },
                                {
                                    invDate: {
                                        lte: q ? new Date(q) : undefined,
                                        gte: q ? new Date(q) : undefined
                                    },
                                }
                            ]
                        },
                        select: {
                            id: true,
                            invCode: true,
                            invTotal: true,
                            invDate: true,
                            status: true,
                            supplier: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true,
                                }
                            },
                            supplierPrice: {
                                select: {
                                    id: true,
                                    price: true,
                                }
                            },
                        }
                    }
                )
                return invoices
            }, {
                detail: {
                    tags: ['Invoices Supplier']
                },
            })

            .get('/:id', async ({ db, params }) => {
                const invoice = await db.supplierOrders.findUnique({
                    where: {
                        id: parseInt(params.id)
                    },
                    select: {
                        id: true,
                        invCode: true,
                        invTotal: true,
                        invDate: true,
                        supplier: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            }
                        },
                        supplierPrice: {
                            select: {
                                id: true,
                                price: true,
                            }
                        },
                        qty: true,
                    }


                })
                return invoice
            },
                {
                    detail: {
                        tags: ['Invoices Supplier']
                    },
                }
            )

            .post('/:invCode', async ({ set, db, params, body }) => {
                const { ...rest } = body;

                const decodedInvCode = decodeURIComponent(params.invCode);

                const supplierOrder = await db.supplierOrders.findUnique({
                    where: {
                        invCode: decodedInvCode
                    },
                });

                if (supplierOrder!.status === 'Paid') {
                    set.status = 404;
                    throw new Error('Invoice already Paid');
                }

                const bankAccount = await db.bankAccounts.findUnique({
                    where: {
                        id: rest!.bankAccountId,
                    },
                });

                if ((await bankAccount)!.balance < supplierOrder!.invTotal) {
                    set.status = 404;
                    throw new Error('Insufficient Balance');
                }

                const newBankTransaction = await db.bankTransactions.create({
                    data: {
                        bankAccountId: rest!.bankAccountId,
                        amount: supplierOrder!.invTotal,
                        transactionCode: "TRS/" + supplierOrder!.invCode + "/" + Math.floor(Math.random() * 1000),
                        transactionDate: new Date(),
                        transactionType: 'Debit',
                        supplierInvCode: supplierOrder!.invCode,
                    }
                })

                const updateSupplierOrderStatus = await db.supplierOrders.update({
                    where: {
                        invCode: decodedInvCode
                    },
                    data: {
                        status: 'Paid'
                    }
                })

                const updateBankAccountBalance = await db.bankAccounts.update({
                    where: {
                        id: rest!.bankAccountId,
                    },
                    data: {
                        balance: {
                            decrement: supplierOrder!.invTotal
                        }
                    }
                })

                return {
                    message: "success",
                    balance: (await bankAccount)!.balance - supplierOrder!.invTotal,
                    data: newBankTransaction
                }

            }, {
                detail: {
                    tags: ['Invoices Supplier']
                },
                body: t.Object({
                    bankAccountId: t.Number(),
                }),
            })

            .delete('/:invCode', async ({ db, params }) => {

                const decodedInvCode = decodeURIComponent(params.invCode);
                const invoice = await db.supplierOrders.delete({
                    where: {
                        invCode: decodedInvCode
                    }
                })
                return invoice
            }
                , {
                    detail: {
                        tags: ['Invoices Supplier']
                    },
                }
            )
    })