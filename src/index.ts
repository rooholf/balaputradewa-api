import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { cors } from '@elysiajs/cors'
import { authRoutes, factoryRoutes, factoryInvoicesRoutes, farmersRoutes, supplierInvoiceRoutes, suppliersRoutes, usersRoutes, vehiclesRoutes, bankAccount, bankTransactions, ordersRoutes, dailyOrders, dailyRevenue } from './routes/*'
import { isAuthenticated } from './middleware/auth'
import { productRoutes } from './routes/product.routes'


const app = new Elysia({
  name: '@app/ctx',
})
  .use(swagger({
    path: '/v1/swagger',
    documentation: {
      info: {
        title: 'Elysia API',
        description: 'Elysia API Documentation',
        version: '1.0.0',
      },
      tags: [
        {
          name: 'Auth',
          description: 'Auth API',
        },
        {
          name: 'Factories',
          description: 'Factories API',
        },
        {
          name: 'Farmers',
          description: 'Farmers API',
        },
        {
          name: 'Suppliers',
          description: 'Suppliers API',
        },
        {
          name: 'Users',
          description: 'Users API',
        },
        {
          name: 'Vehicles',
          description: 'Vehicles API',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  }))
  .group('/api/v1', (app) =>
    app
      .use(
        jwt({
          name: 'jwt',
          secret: 'Fischl von Luftschloss Narfidort'
        })
      )
      .use(cookie())
      .use(authRoutes)
      // .use(isAuthenticated)
      .use(usersRoutes)
      .use(factoryRoutes)
      .use(suppliersRoutes)
      .use(farmersRoutes)
      .use(vehiclesRoutes)
      .use(bankAccount)
      .use(bankTransactions)
      .use(factoryInvoicesRoutes)
      .use(supplierInvoiceRoutes)
      .use(ordersRoutes)
      .use(dailyOrders)
      .use(dailyRevenue)
      .use(productRoutes)

  )
  .use(cors())
  .listen({
    port: 3000,
  })

// `server` will be null if listen isn't called

console.log(`Running at http://${app.server!.hostname}:${app.server!.port}`)