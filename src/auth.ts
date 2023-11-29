import { Elysia } from "elysia";
import { ctx } from "./context";
import jwt from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";

export const isAuthenticated = (app: Elysia) =>
  app
    .use(ctx)
    .use(jwt({
      name: 'jwt',
      secret: 'Fischl von Luftschloss Narfidort'
    }))
    .use(bearer())
    .derive(async ({ jwt, set, db, bearer }) => {
      const token = bearer
      if (!token) {
        set.status = 401;
        throw new Error("token Unauthorized");
      }
      const { id } = await jwt.verify(token) as JWTPayloadSpec;
      if (!id) {
        set.status = 401;
        throw new Error("payload Unauthorized");
      }

      const userIdNumber = parseInt(id);
      const user = await db.users.findUnique({
        where: {
          id: userIdNumber,
        },
      });
      if (!user) {
        set.status = 401;
        throw new Error("user Unauthorized");
      }
      return {
        user,
      };
    });