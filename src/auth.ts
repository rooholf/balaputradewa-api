import { Elysia } from "elysia";
import {ctx} from "./context";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";

export const isAuthenticated = (app: Elysia) =>
  app
  .use(ctx)
  .use(jwt({
    name: 'jwt',
    secret: 'Fischl von Luftschloss Narfidort'
  }))
  .use(cookie())
  .derive(async ({ cookie, jwt, set, db }) => {
    console.log(cookie);
    if (!cookie!.access_token) {
      set.status = 401;
      throw new Error("cookie Unauthorized");
    }
    const { id } = await jwt.verify(cookie!.access_token) as JWTPayloadSpec;
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