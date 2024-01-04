import Elysia, { t } from "elysia";
import { ctx } from "../context/context";
import { Prisma } from "@prisma/client";




interface factoryOrder {
    factoryId: number;
    factoryPriceId?: number;
    noRef: string;
    transactionDate?: string;
    bankAccountId: number;
    vehicleOrders: {
        vehicleId: number;
        qty: number;
    }[];
}



export const factoryInvoicesRoutes = new Elysia()

    .use(ctx)
    .group('/invoices/factory', (app) => {
        return app
            .get('/', async ({ db, query }) => {
                const { _page, _end, _sort, _order, _status, created_at_gte, created_at_lte, q } = query;
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
                    whereConditions.push({ invCode: { contains: q, } });
                }

                if (_status) {
                    whereConditions.push({ status: { equals: _status, } });
                }

                if (created_at_lte || created_at_gte) {
                    whereConditions.push({
                        invDate: {
                            lte: created_at_lte ? new Date(created_at_lte) : undefined,
                            gte: created_at_gte ? new Date(created_at_gte) : undefined
                        }
                    });
                }

                const invoices = await db.factoryOrders.findMany(
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
                )



                return invoices
            }, {
                detail: {
                    tags: ['Invoices Factory']
                },
            })

            .get('/:id', async ({ db, params }) => {
                const invoice = await db.factoryOrders.findUnique({
                    where: {
                        id: parseInt(params.id)
                    },
                    select: {
                        id: true,
                        invCode: true,
                        invTotal: true,
                        invDate: true,
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
                                vehicle: {
                                    select: {
                                        id: true,
                                        plate: true,
                                        color: true,
                                    }
                                },
                            }
                        },
                        qty: true,
                    }

                })
                return invoice
            }, {
                detail: {
                    tags: ['Invoices Factory']
                },
            })

            .post('/:invCode', async ({ set, db, params, body }) => {
                const { ...rest } = body as factoryOrder;

                const decodedInvCode = decodeURIComponent(params.invCode);

                const factoryOrder = await db.factoryOrders.findUnique({
                    where: {
                        invCode: decodedInvCode
                    },
                    select: {
                        id: true,
                        invCode: true,
                        invTotal: true,
                        status: true,
                        factory: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            }
                        },
                    }
                });

                if (factoryOrder!.status === 'Paid') {
                    set.status = 404;
                    throw new Error('Invoice already Paid');
                }

                const newBankTransaction = await db.bankTransactions.create({
                    data: {
                        bankAccountId: rest!.bankAccountId,
                        amount: factoryOrder!.invTotal,
                        transactionCode: "TRS/" + factoryOrder!.invCode + "/" + Math.floor(Math.random() * 1000),
                        transactionDate: rest.transactionDate ? new Date(rest.transactionDate) : new Date(),
                        transactionType: 'Credit',
                        description: 'Pembayaran Dari Pabrik ' + factoryOrder!.factory!.name + ' Untuk Invoice ' + factoryOrder!.invCode,
                        factoryInvCode: factoryOrder!.invCode,
                    }
                })

                const updateFactoryOrderStatus = await db.factoryOrders.update({
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
                            increment: factoryOrder!.invTotal
                        }
                    }
                })

                return newBankTransaction

            }, {
                detail: {
                    tags: ['Invoices Factory']
                },
                body: t.Object({
                    bankAccountId: t.Number(),
                    transactionDate: t.Optional(t.String()),
                }),
            })

            .delete('/:invCode', async ({ db, params }) => {
                const decodedInvCode = decodeURIComponent(params.invCode);

                const deleteFactoryOrder = await db.factoryOrders.delete({
                    where: {
                        invCode: decodedInvCode
                    }
                })
                return deleteFactoryOrder
            }
                , {
                    detail: {
                        tags: ['Invoices Factory']
                    },
                })

            .post('/', async ({ db, invoiceCode, body }) => {
                const { ...rest } = body as factoryOrder;

                const factoryPricePromise = rest!.factoryPriceId
                    ? db.factoryPrices.findUnique({ where: { id: rest!.factoryPriceId } })
                    : db.factoryPrices.findFirst({
                        where: { factoryId: rest!.factoryId },
                        orderBy: { created_at: 'desc' },
                    });

                const factoryPromise = db.factories.findUnique({ where: { id: rest!.factoryId } });

                const [factoryPrice, factory] = await Promise.all([factoryPricePromise, factoryPromise]);

                const factoryInvoiceCode = `INV-${factory!.code}-${invoiceCode}-${Math.random().toString(36).substring(2, 15)}`;

                const vehicleOrderQty = rest!.vehicleOrders.reduce((acc, cur) => acc + cur.qty, 0);

                const createOrUpdateFactoryOrderPromise = db.factoryOrders.upsert({
                    where: { invCode: factoryInvoiceCode },
                    create: {
                        invCode: factoryInvoiceCode,
                        invDate: rest.transactionDate ? new Date(rest.transactionDate) : new Date(),
                        noRef: rest!.noRef,
                        invTotal: factoryPrice!.price * vehicleOrderQty,
                        factoryId: factory!.id,
                        factoryPriceId: factoryPrice!.id,
                        qty: vehicleOrderQty,
                        status: 'Pending',
                    },
                    update: { status: 'Pending' },
                });

                const [createOrUpdateFactoryOrder] = await Promise.all([createOrUpdateFactoryOrderPromise]);
                const newBankTransactionPromise = db.bankTransactions.create({
                    data: {
                        bankAccountId: rest!.bankAccountId,
                        amount: createOrUpdateFactoryOrder.invTotal,
                        transactionCode: `TRS/${createOrUpdateFactoryOrder.invCode}/${Math.floor(Math.random() * 1000)}`,
                        transactionDate: rest.transactionDate ? new Date(rest.transactionDate) : new Date(),
                        transactionType: 'Debit',
                        description: 'Pembayaran Dari Pabrik ' + factory?.name + ' Untuk Invoice ' + factoryInvoiceCode,
                        factoryInvCode: createOrUpdateFactoryOrder.invCode,
                    }
                });





                const vehicleOrders = rest!.vehicleOrders;
                const vehiclePromises = vehicleOrders.map(order => db.vehicles.findUnique({ where: { id: order.vehicleId } }));
                const vehicles = await Promise.all(vehiclePromises);

                const groupedVehicleOrders = vehicles.reduce((acc, vehicle, index) => {
                    const existingOrders = acc[vehicle!.supplierId] || [];
                    existingOrders.push(vehicleOrders[index]);
                    acc[vehicle!.supplierId] = existingOrders;
                    return acc;
                }, {} as Record<number, typeof vehicleOrders>);



                const createSupplierOrders = Object.entries(groupedVehicleOrders).map(async ([supplierId, vehicleOrders]) => {
                    // Fetch the supplier and supplierPrice
                    const supplierPromise = db.suppliers.findUnique({ where: { id: Number(supplierId) } });
                    // Get the supplierPrice based on the transactionDate if available, or get the latest price
                    const supplierPricePromise = await db.supplierPrices.findFirst({
                        where: {
                            supplierId: Number(supplierId),
                            OR: [
                                { created_at: { lte: rest.transactionDate ? new Date(rest.transactionDate) : new Date() } },
                                { created_at: { gte: rest.transactionDate ? new Date(rest.transactionDate) : new Date() } },
                            ]
                        },
                        orderBy: { created_at: 'desc' },
                    }).catch(async () => {
                        return await db.supplierPrices.findFirst({
                            where: {
                                supplierId: Number(supplierId),
                            },
                            orderBy: { created_at: 'desc' },
                        });
                    });

                    const [supplier, supplierPrice] = await Promise.all([supplierPromise, supplierPricePromise]);

                    // Generate the supplierInvoiceCode
                    const supplierInvoiceCode = `INV-${supplier!.code}-${invoiceCode}-${Math.random().toString(36).substring(2, 15)}`;

                    // Calculate the supplierOrderQty
                    const supplierOrderQty = vehicleOrders.reduce((acc, cur) => acc + cur.qty, 0);

                    // Check if supplierPrice is null or supplierPrice.isPPN is null
                    if (!supplierPrice || supplierPrice.isPPN === null) {
                        throw new Error('Supplier price is null or isPPN is null');
                    }

                    // Create or update the supplierOrder
                    const createOrUpdateSupplierOrderPromise = db.supplierOrders.upsert({
                        where: { invCode: supplierInvoiceCode },
                        create: {
                            invCode: supplierInvoiceCode,
                            invDate: new Date(),
                            invTotal: !supplierPrice.isPPN ? (supplierPrice.price * supplierOrderQty) : (supplierPrice.price * supplierOrderQty * 1.11),
                            supplierId: supplier!.id,
                            supplierPriceId: supplierPrice!.id,
                            factoryPriceId: factoryPrice!.id,
                            factoryOrderId: createOrUpdateFactoryOrder.id,
                            qty: supplierOrderQty,
                            status: 'Pending',
                        },
                        update: { status: 'Pending' },
                    });

                    const [createOrUpdateSupplierOrder] = await Promise.all([createOrUpdateSupplierOrderPromise]);

                    // Create the vehicleOrders
                    const createVehicleOrderPromises = vehicleOrders.map(async (vehicleOrder) => {
                        const vehicleInvCode = `INV-VOR-${vehicleOrder.vehicleId}-${invoiceCode}-${Math.random().toString(36).substring(2, 15)}`;

                        // Fetch the vehicle from the database
                        const vehicle = await db.vehicles.findUnique({ where: { id: vehicleOrder.vehicleId } });

                        return db.vehicleOrders.upsert({
                            where: { invCode: vehicleInvCode },
                            create: {
                                factoryOrdersId: createOrUpdateFactoryOrder.id,
                                supplierOrderId: createOrUpdateSupplierOrder.id,
                                qty: vehicleOrder.qty,
                                invCode: vehicleInvCode,
                                plate: vehicle?.plate ?? '', // Use the plate from the fetched vehicle or default to an empty string
                            },
                            update: {}
                        });
                    });

                    const resolvedVehicleOrders = await Promise.all(createVehicleOrderPromises);

                    return { createOrUpdateSupplierOrder, resolvedVehicleOrders };
                });

                const resolvedSupplierOrders = await Promise.all(createSupplierOrders);



                const updateFactoryOrderStatusPromise = db.factoryOrders.update({
                    where: { invCode: createOrUpdateFactoryOrder.invCode },
                    data: { status: 'Paid' }
                });

                const updateBankAccountBalancePromise = db.bankAccounts.update({
                    where: { id: rest!.bankAccountId },
                    data: { balance: { increment: createOrUpdateFactoryOrder.invTotal } }
                });

                const [newBankTransaction, updateFactoryOrderStatus, updateBankAccountBalance] = await Promise.all([
                    newBankTransactionPromise,
                    updateFactoryOrderStatusPromise,
                    updateBankAccountBalancePromise
                ]);

                const formattedData = resolvedSupplierOrders.map(({ createOrUpdateSupplierOrder, resolvedVehicleOrders }) => {
                    return {
                        supplierOrder: {
                            invCode: createOrUpdateSupplierOrder.invCode,
                            invTotal: createOrUpdateSupplierOrder.invTotal,
                            vehicleOrders: resolvedVehicleOrders.filter(Boolean).map(vehicleOrder => ({
                                invCode: vehicleOrder!.invCode
                            }))
                        }
                    };
                });

                return {
                    message: "success",
                    data: {
                        invCode: factoryInvoiceCode,
                        suppliers: formattedData,
                    }
                }
            }, {
                detail: {
                    tags: ['Invoices Factory']
                },
                body: t.Object({
                    factoryId: t.Number(),
                    factoryPriceId: t.Optional(t.Number()),
                    vehicleOrders: t.Array(
                        t.Object({
                            vehicleId: t.Number(),
                            qty: t.Number(),
                        })
                    ),
                    noRef: t.String(),
                    transactionDate: t.String(),
                    bankAccountId: t.Number(),
                }),
            })
    })


