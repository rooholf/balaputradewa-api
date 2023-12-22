import Elysia, { t } from "elysia";
import { v4 as uuidv4 } from 'uuid';
import { ctx } from "../context/context";




interface factoryOrder {
    factoryId: number;
    factoryPriceId: number;
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
                const { _page, _end, _sort, _order, q } = query;
                const limit = +(_end ?? 10);
                const offset = (+(_page ?? 1) - 1) * limit;
                const sort = (_sort ?? 'id').toString();
                const order = _order ?? 'asc';

                const orderBy = { [sort]: order };

                const invoices = await db.factoryOrders.findMany(
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
                const { ...rest } = body;

                const decodedInvCode = decodeURIComponent(params.invCode);

                const factoryOrder = await db.factoryOrders.findUnique({
                    where: {
                        invCode: decodedInvCode
                    },
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
                        transactionDate: new Date(),
                        transactionType: 'Credit',
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

                const factoryInvoiceCode = `INV/${factory!.code}/${invoiceCode}${uuidv4()}`;
                const vehicleOrderQty = rest!.vehicleOrders.reduce((acc, cur) => acc + cur.qty, 0);

                const createOrUpdateFactoryOrderPromise = db.factoryOrders.upsert({
                    where: { invCode: factoryInvoiceCode },
                    create: {
                        invCode: factoryInvoiceCode,
                        invDate: new Date(),
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
                        transactionDate: new Date(),
                        transactionType: 'Credit',
                        factoryInvCode: createOrUpdateFactoryOrder.invCode,
                    }
                });

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
                    const supplierPricePromise = db.supplierPrices.findUnique({ where: { id: Number(supplierId) } });

                    const [supplier, supplierPrice] = await Promise.all([supplierPromise, supplierPricePromise]);

                    // Generate the supplierInvoiceCode
                    const supplierInvoiceCode = `INV/${supplier!.code}/${invoiceCode}${Math.floor(Math.random() * 1000)}`;

                    // Calculate the supplierOrderQty
                    const supplierOrderQty = vehicleOrders.reduce((acc, cur) => acc + cur.qty, 0);

                    // Create or update the supplierOrder
                    const createOrUpdateSupplierOrderPromise = db.supplierOrders.upsert({
                        where: { invCode: supplierInvoiceCode },
                        create: {
                            invCode: supplierInvoiceCode,
                            invDate: new Date(),
                            invTotal: supplierPrice!.price * supplierOrderQty,
                            supplierId: supplier!.id,
                            supplierPriceId: supplierPrice!.id,
                            factoryPriceId: factoryPrice!.id,
                            qty: supplierOrderQty,
                            status: 'Pending',
                        },
                        update: { status: 'Pending' },
                    });

                    const [createOrUpdateSupplierOrder] = await Promise.all([createOrUpdateSupplierOrderPromise]);

                    // Create the vehicleOrders
                    const createVehicleOrderPromises = vehicleOrders.map(async (vehicleOrder) => {
                        const vehicleInvCode = `INV/${vehicleOrder.vehicleId}/${invoiceCode++}`;

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
                            update: {
                                factoryOrdersId: createOrUpdateFactoryOrder.id,
                                supplierOrderId: createOrUpdateSupplierOrder.id,
                                qty: vehicleOrder.qty,
                            }
                        });
                    });

                    const resolvedVehicleOrders = await Promise.all(createVehicleOrderPromises);

                    return { createOrUpdateSupplierOrder, resolvedVehicleOrders };
                });

                const resolvedSupplierOrders = await Promise.all(createSupplierOrders);
                const formattedData = resolvedSupplierOrders.map(({ createOrUpdateSupplierOrder, resolvedVehicleOrders }) => {
                    return {
                        supplierOrder: {
                            invCode: createOrUpdateSupplierOrder.invCode,
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
                    bankAccountId: t.Number(),
                }),
            })
    })


