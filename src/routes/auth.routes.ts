import Elysia, { t } from "elysia"
import { ctx } from "../context/context"
import { jwt } from "@elysiajs/jwt"
import cookie from "@elysiajs/cookie"
import { userODT } from "../model/model"


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
            .post('/login', async ({ db, body, jwt, setCookie, }) => {
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
                detail: {
                    tags: ['Auth']
                },
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
                    },
                    detail: {
                        tags: ['Auth']
                    },
                })

            .get('/refresh', async ({ jwt, cookie }) => {
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
                    },
                    detail: {
                        tags: ['Auth']
                    },
                })
            .get('/logout', async ({ setCookie }) => {
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
                    },
                    detail: {
                        tags: ['Auth']
                    },
                })
    })