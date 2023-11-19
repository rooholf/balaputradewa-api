import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { ModelObt } from './model'
import { factoriesRoutes, farmersRoutes, suppliersRoutes, usersRoutes, vehiclesRoutes } from './routes'

const app = new Elysia({
  name: '@app/ctx',
})
  .use(swagger())
  .model(ModelObt)
  .use(usersRoutes)
  .use(factoriesRoutes)
  .use(suppliersRoutes)
  .use(farmersRoutes)
  .use(vehiclesRoutes)
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)