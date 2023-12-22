import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()
const dateString = new Date().toJSON()
const date = dateString.split("T")[0].split("-").join("")
const invCodeHelper = Number(date) + 1;

export const ctx = new Elysia({
  name: "@app/ctx",
})
  .decorate("db", db)
  .decorate("invoiceCode", invCodeHelper)