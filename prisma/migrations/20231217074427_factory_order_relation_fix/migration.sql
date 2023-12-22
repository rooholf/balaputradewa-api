/*
  Warnings:

  - You are about to drop the column `supplierOrderId` on the `FactoryOrderDetails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FactoryOrderDetails" DROP CONSTRAINT "FactoryOrderDetails_supplierOrderId_fkey";

-- AlterTable
ALTER TABLE "FactoryOrderDetails" DROP COLUMN "supplierOrderId";

-- AlterTable
ALTER TABLE "VehicleOrders" ADD COLUMN     "factoryOrderDetailsId" INTEGER,
ADD COLUMN     "factoryOrdersId" INTEGER;

-- AddForeignKey
ALTER TABLE "VehicleOrders" ADD CONSTRAINT "VehicleOrders_factoryOrdersId_fkey" FOREIGN KEY ("factoryOrdersId") REFERENCES "FactoryOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOrders" ADD CONSTRAINT "VehicleOrders_factoryOrderDetailsId_fkey" FOREIGN KEY ("factoryOrderDetailsId") REFERENCES "FactoryOrderDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
