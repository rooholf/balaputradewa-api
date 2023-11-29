import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { userODT, vehicleODT } from './model'
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { cors } from '@elysiajs/cors'
import { authRoutes, factoriesRoutes, farmersRoutes, suppliersRoutes, usersRoutes, vehiclesRoutes } from './routes'
import { isAuthenticated } from './auth'

const app = new Elysia({
  name: '@app/ctx',
})
  .use(swagger({
    documentation: {
      info: {
        title: 'Elysia API',
        description: 'Elysia API Documentation',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local server',
        },
      ],
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
      .use(isAuthenticated)
      .use(usersRoutes)
      .use(factoriesRoutes)
      .use(suppliersRoutes)
      .use(farmersRoutes)
      .use(vehiclesRoutes)

  )
  .use(cors())
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)