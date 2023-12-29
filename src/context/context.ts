import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()
const now = new Date();
const invCodeHelper = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}`;

export const ctx = new Elysia({
  name: "@app/ctx",
})
  .decorate("db", db)
  .decorate("invoiceCode", invCodeHelper)