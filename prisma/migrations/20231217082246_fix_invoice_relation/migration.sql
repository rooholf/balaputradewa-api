/*
  Warnings:

  - You are about to drop the column `factoryOrdersId` on the `VehicleOrders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VehicleOrders" DROP CONSTRAINT "VehicleOrders_factoryOrdersId_fkey";

-- AlterTable
ALTER TABLE "VehicleOrders" DROP COLUMN "factoryOrdersId";
