
import Elysia, { t } from "elysia"
import { ctx } from "./context"
import { jwt } from "@elysiajs/jwt"
import cookie from "@elysiajs/cookie"
import { factoryODT, farmerODT, supplierODT, userODT, vehicleODT } from "./model"
import cors from "@elysiajs/cors"

export const authRoutes = new Elysia()
    .model(userODT)
    .group('/auth', (app) => {
        return app
            .use(ctx)
            .use(
                jwt({
                    name: 'jwt',
                    secret: 'Fischl von Luftschloss Narfidort',
                    exp: '7d'
                })
            )
            .use(cookie())
            .post('/login', async ({ db, body, jwt, setCookie }) => {
                const user = await db.users.findUnique({
                    where: {
                        email: body.email
                    },
                })
                if (!user) {
                    throw new Error('User tidak ditemukan')
                }
                const match = await Bun.password.verify(body.password, user.password)
                if (!match) {
                    throw new Error('Password salah')
                }

                const tokenData = {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }

                const accessToken = await jwt.sign({
                    ...tokenData,
                });
                const refreshToken = await jwt.sign({
                    ...tokenData,
                });
                setCookie("access_token", accessToken, {
                    maxAge: 86400 * 7, // 7 days
                    path: "/",
                });
                setCookie("refresh_token", refreshToken, {
                    maxAge: 86400 * 7, // 7 days
                    path: "/",
                });
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                }
            }, {
                body: userODT.sign,
            })
            .post('/register', async ({ db, body }) => {
                const hashedBody = {
                    ...body,
                    password: await Bun.password.hash(body.password, {
                        algorithm: "argon2id", // "argon2id" | "argon2i" | "argon2d"
                        memoryCost: 4, // memory usage in kibibytes
                        timeCost: 3, // the number of iterations
                    })
                }
                const user = await db.users.create({
                    data: hashedBody
                })
                return user
            }
                , {
                    body: userODT.create,
                    response: {
                        200: userODT.response
                    }
                })

            .post('/refresh', async ({ jwt, cookie }) => {
                const { id } = await jwt.verify(cookie!.refresh_token) as JWTPayloadSpec;
                if (!id) {
                    throw new Error("Unauthorized");
                }
                const accessToken = await jwt.sign({
                    userId: id.toString(),
                });
                return {
                    access_token: accessToken,
                };
            }
                , {
                    response: {
                        200: t.Object({
                            access_token: t.String()
                        })
                    }
                })
            .post('/logout', async ({ setCookie }) => {
                setCookie("access_token", "", {
                    maxAge: 0,
                    path: "/",
                });
                setCookie("refresh_token", "", {
                    maxAge: 0,
                    path: "/",
                });
                return {
                    success: true,
                    message: "Berhasil logout"
                }
            }
                , {
                    response: {
                        200: t.Object({
                            success: t.Boolean(),
                            message: t.String()
                        })
                    }
                })
    })
export const usersRoutes = new Elysia()
    .model(userODT)
    .group('/users', (app) => {
        return app
            .use(ctx)
            .get('/', async (ctx) => {
                const users = await ctx.db.users.findMany(
                    {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true
                        }
                    }
                )
                return users
            })
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
                    }
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
                    }
                })
            .use(cors({
                origin: 'http://localhost:5173',
                credentials: true,
            }))
    })



export const factoriesRoutes = new Elysia()

    .model(factoryODT)
    .group('/factories', (app) => {
        return app
            .use(ctx)
            .get('/', async (ctx) => {
                const factories = await ctx.db.factories.findMany()
                return factories
            },
                {
                    response: {
                        200: t.Array(factoryODT.response)
                    }
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
                    }
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
                    }
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
                    }
                })
            .use(cors({
                origin: 'http://localhost:5173',
                credentials: true,
            }))
    })

export const suppliersRoutes = new Elysia()

    .model(supplierODT)
    .group('/suppliers', (app) => {
        return app
            .use(ctx)
            .get('/', async (ctx) => {
                const suppliers = await ctx.db.suppliers.findMany()
                return suppliers
            })
            .post('/', async ({ db, body }) => {
                const supplier = await db.suppliers.create({
                    data: body
                })
                return supplier
            },
                {

                    body: supplierODT.create,

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

                })
            .delete('/:id', async ({ db, params }) => {
                const supplier = await db.suppliers.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
                return supplier
            })
            .use(cors({
                origin: 'http://localhost:5173',
                credentials: true,
            }))
    })

export const farmersRoutes = new Elysia()

    .model(farmerODT)
    .group('/farmers', (app) => {
        return app
            .use(ctx)
            .get('/', async (ctx) => {
                const farmers = await ctx.db.farmers.findMany()
                return farmers
            },
                {
                    response: {
                        200: t.Array(farmerODT.response)
                    }
                })
            .post('/', async ({ db, body }) => {
                const farmer = await db.farmers.create({
                    data: body
                })
                return farmer
            },
                {

                    body: farmerODT.create,
                    response: {
                        200: farmerODT.response
                    }
                })
            .put('/:id', async ({ db, body, params }) => {
                const farmer = await db.farmers.update({
                    where: {
                        id: parseInt(params.id)
                    },
                    data: body
                })
                return farmer
            }
                , {

                    body: farmerODT.create,
                    response: {
                        200: farmerODT.response
                    }
                })
            .delete('/:id', async ({ db, params }) => {
                const farmer = await db.farmers.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
                return farmer
            }
                , {
                    response: {
                        200: farmerODT.response
                    }
                })
            .use(cors({
                origin: 'http://localhost:5173',
                credentials: true,
            }))
    })

export const vehiclesRoutes = new Elysia()

    .model(vehicleODT)
    .group('/vehicles', (app) => {
        return app
            .use(ctx)
            .get('/', async (ctx) => {
                const vehicles = await ctx.db.vehicles.findMany()
                return {
                    success: true,
                    message: "Berhasil",
                    data: vehicles
                }
            })
            .post('/', async ({ db, body }) => {
                const vehicle = await db.vehicles.create({
                    data: body
                })
                return vehicle
            },
                {

                    body: vehicleODT.create,
                    response: {
                        200: vehicleODT.response
                    }
                })
            .put('/:id', async ({ db, body, params }) => {
                const vehicle = await db.vehicles.update({
                    where: {
                        id: parseInt(params.id)
                    },
                    data: body
                })
                return vehicle
            }
                , {
                    body: vehicleODT.create,
                    response: {
                        200: vehicleODT.response
                    }
                })
            .delete('/:id', async ({ db, params }) => {
                const vehicle = await db.vehicles.delete({
                    where: {
                        id: parseInt(params.id)
                    }
                })
                return vehicle
            }
                , {
                    response: {
                        200: vehicleODT.response
                    }
                })
            .use(cors({
                origin: 'http://localhost:5173',
                credentials: true,
            }))
    })