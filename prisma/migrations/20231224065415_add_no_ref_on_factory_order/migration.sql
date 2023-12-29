/*
  Warnings:

  - Added the required column `noRef` to the `FactoryOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FactoryOrders" ADD COLUMN     "noRef" TEXT NOT NULL;
