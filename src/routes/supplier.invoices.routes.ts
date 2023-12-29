import Elysia, { t } from "elysia";
import { ctx } from "../context/context";
import { Prisma } from "@prisma/client";


export const supplierInvoiceRoutes = new Elysia()

    .use(ctx)
    .group('/invoices/supplier', (app) => {
        return app
            .onError(({ code, error, set }) => {
                if (code === 'NOT_FOUND') {
                    set.status = 404;
                    return new Response(error.toString())
                }
            })
            .get('/', async ({ db, query }) => {

                const { _page, _end, _sort, _order, _status, created_at_gte, created_at_lte, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };
                const whereConditions = [];
                const invoiceSupplier = []

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

                if (created_at_lte || created_at_gte) {
                    whereConditions.push({
                        invDate: {
                            lte: created_at_lte ? new Date(created_at_lte) : undefined,
                            gte: created_at_gte ? new Date(created_at_gte) : undefined
                        }
                    });
                }

                const invoices = await db.supplierOrders.findMany(
                    {
                        orderBy,
                        skip: offset,
                        take: limit,
                        where: whereConditions.length > 0 ? { OR: whereConditions } : {},
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
                                    isPPN: true,
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
                            },
                            vehicleOrders: true,
                            factoryOrder: true,
                            qty: true, // Add qty field to select
                        }
                    }
                );




                const invoicesWithProfits = invoices.map((invoice) => {
                    const noRef = invoice.factoryOrder!.noRef
                    const invRef = invoice.factoryOrder!.invCode
                    const isPPN = invoice.supplierPrice!.isPPN
                    const priceAfterPPN = isPPN ? invoice.supplierPrice!.price * 1.1 : invoice.supplierPrice!.price
                    const profit = (invoice.supplierPrice!.factoryPrice!.price - priceAfterPPN) * invoice.qty
                    return {
                        ...invoice,
                        profit,
                        noRef,
                        invRef,
                    }
                })

                return invoicesWithProfits;
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
                                address: true,
                                products: true,
                                code: true,
                            }
                        },
                        supplierPrice: {
                            select: {
                                id: true,
                                price: true,
                                isPPN: true,
                            }
                        },
                        vehicleOrders: {
                            select: {
                                id: true,
                                qty: true,
                                vehicle: {
                                    select: {
                                        id: true,
                                        plate: true,
                                    }
                                }
                            }
                        },
                        BankTransactions: {
                            select: {
                                id: true,
                                amount: true,
                                transactionCode: true,
                                transactionDate: true,
                                transactionType: true,
                                bankAccounts: {
                                    select: {
                                        id: true,
                                        bankName: true,
                                        accountName: true,
                                        accountNumber: true,
                                    }
                                }
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
                                address: true,
                                products: true,
                                code: true,
                            }
                        },
                        supplierPrice: {
                            select: {
                                id: true,
                                price: true,
                                isPPN: true,
                            }
                        },
                        vehicleOrders: {
                            select: {
                                id: true,
                                qty: true,
                                vehicle: {
                                    select: {
                                        id: true,
                                        plate: true,
                                    }
                                }
                            }
                        },
                        BankTransactions: {
                            select: {
                                id: true,
                                amount: true,
                                transactionCode: true,
                                transactionDate: true,
                                transactionType: true,
                                bankAccounts: {
                                    select: {
                                        id: true,
                                        bankName: true,
                                        accountName: true,
                                        accountNumber: true,
                                    }
                                }
                            }
                        },
                        qty: true,
                    }
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
                        transactionDate: rest.transactionDate ? new Date(rest.transactionDate) : new Date(),
                        transactionType: 'Credit',
                        description: "Pembayaran Produk " + supplierOrder?.supplier.products?.name + " Kepada " + supplierOrder!.supplier.name,
                        supplierInvCode: supplierOrder!.invCode,
                    }
                })

                const updateSupplierOrderStatus = await db.supplierOrders.update({
                    where: {
                        invCode: decodedInvCode
                    },
                    data: {
                        status: 'Paid',
                        invDate: new Date(),
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
                    transactionDate: t.String(),
                }),
                error({ error }) {
                    return error
                }
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