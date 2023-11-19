import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()
export const ctx = new Elysia({
    name: "@app/ctx",
  })
    .decorate("db", db)