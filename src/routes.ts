import Elysia, { t } from "elysia"
import { ModelObt } from "./model"
import { ctx } from "./context"


export const usersRoutes = new Elysia()
    .group('/users', (app) => {
        return app
        .use(ctx)
        .get('/', async (ctx) => {
          const users = await ctx.db.users.findMany()
          return users
        },
        {
          response: {
            200: t.Array(ModelObt['user.response'])
          }
        })
        .post('/', async ({db, body}) => {
            const user = await db.users.create({
                data: body
            })
            return user
            },
            {
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'User sudah terdaftar'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['user.create'],
                response: {
                    200: ModelObt['user.response']
                }
            })
        .put('/:id', async ({db, body, params}) => {
            const user = await db.users.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            })
            return user
            }
            ,{
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'DO/User sudah terdaftar'
                            }
                        case 'VALIDATION':
                            return {
                                error: 'Password minimal 8 karakter'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['user.create'],
                response: {
                    200: ModelObt['user.response']
                }
            })
        .delete('/:id', async ({db, params}) => {
            const user = await db.users.delete({
                where: {
                    id: parseInt(params.id)
                }
            })
            return user
            }
            ,{
                response: {
                    200: ModelObt['user.response']
                }
            })
        })
        


export const factoriesRoutes = new Elysia()
    .group('/factories', (app) => {
        return app
        .use(ctx)
        .get('/', async (ctx) => {
          const factories = await ctx.db.factories.findMany()
          return factories
        },
        {
          response: {
            200: t.Array(ModelObt['factory.response'])
          }
        })
        .post('/', async ({db, body}) => {
            const factory = await db.factories.create({
                data: body
            })
            return factory
            }
            ,{
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'Pabrik sudah terdaftar'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['factory.create'],
                response: {
                    200: ModelObt['factory.response']
                }
            })
        .put('/:id', async ({db, body, params}) => {
            const factory = await db.factories.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            })
            return factory
            }
            ,{
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'Pabrik sudah terdaftar'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['factory.create'],
                response: {
                    200: ModelObt['factory.response']
                }
            })
        .delete('/:id', async ({db, params}) => {
            const factory = await db.factories.delete({
                where: {
                    id: parseInt(params.id)
                }
            })
            return factory
            }
            ,{
                response: {
                    200: ModelObt['factory.response']
                }
            })
      })

export const suppliersRoutes = new Elysia()
    .group('/suppliers', (app) => {
        return app
        .use(ctx)
        .get('/', async (ctx) => {
          const suppliers = await ctx.db.suppliers.findMany()
          return suppliers
        },
        {
          response: {
            200: t.Array(ModelObt['supplier.response'])
          }
        })
        .post('/', async ({db, body}) => {
            const supplier = await db.suppliers.create({
                data: body
            })
            return supplier
            },
            {
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'DO/Supplier sudah terdaftar'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['supplier.create'],
                response: {
                    200: ModelObt['supplier.response']
                }
            })
        .put('/:id', async ({db, body, params}) => {
            const supplier = await db.suppliers.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            })
            return supplier
            }
            ,{
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'DO/Supplier sudah terdaftar'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['supplier.create'],
                response: {
                    200: ModelObt['supplier.response']
                }
            })
        .delete('/:id', async ({db, params}) => {
            const supplier = await db.suppliers.delete({
                where: {
                    id: parseInt(params.id)
                }
            })
            return supplier
            }
            ,{
                response: {
                    200: ModelObt['supplier.response']
                }
            })
      })
    
export const farmersRoutes = new Elysia()
      .group('/farmers', (app) => {
        return app
        .use(ctx)
        .get('/', async (ctx) => {
          const farmers = await ctx.db.farmers.findMany()
          return farmers
        },
        {
          response: {
            200: t.Array(ModelObt['farmer.response'])
          }
        })
        .post('/', async ({db, body}) => {
            const farmer = await db.farmers.create({
                data: body
            })
            return farmer
            },
            {
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'Petani sudah terdaftar'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['farmer.create'],
                response: {
                    200: ModelObt['farmer.response']
                }
            })
        .put('/:id', async ({db, body, params}) => {
            const farmer = await db.farmers.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            })
            return farmer
            }
            ,{
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'Petani sudah terdaftar'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['farmer.create'],
                response: {
                    200: ModelObt['farmer.response']
                }
            })
        .delete('/:id', async ({db, params}) => {
            const farmer = await db.farmers.delete({
                where: {
                    id: parseInt(params.id)
                }
            })
            return farmer
            }
            ,{
                response: {
                    200: ModelObt['farmer.response']
                }
            })
        })

export const vehiclesRoutes = new Elysia()
    .group('/vehicles', (app) => {
        return app
        .use(ctx)
        .get('/', async (ctx) => {
          const vehicles = await ctx.db.vehicles.findMany()
          return vehicles
        },
        {
          response: {
            200: t.Array(ModelObt['vehicle.response'])
          }
        })
        .post('/', async ({db, body}) => {
            const vehicle = await db.vehicles.create({
                data: body
            })
            return vehicle
            },
            {
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        case 'P2002':  
                            return {  
                                error: 'Kendaraan sudah terdaftar'
                            }  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['vehicle.create'],
                response: {
                    200: ModelObt['vehicle.response']
                }
            })
        .put('/:id', async ({db, body, params}) => {
            const vehicle = await db.vehicles.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            })
            return vehicle
            }
            ,{
                error({ code }: ErrorCode) {  
                    switch (code) {  
                        // Prisma P2002: "Unique constraint failed on the {constraint}"  
                        default :
                            return {
                                error: 'Internal Server Error'
                            }
                    }  
                },  
                body: ModelObt['vehicle.create'],
                response: {
                    200: ModelObt['vehicle.response']
                }
            })
        .delete('/:id', async ({db, params}) => {
            const vehicle = await db.vehicles.delete({
                where: {
                    id: parseInt(params.id)
                }
            })
            return vehicle
            }
            ,{
                response: {
                    200: ModelObt['vehicle.response']
                }
            })
        })