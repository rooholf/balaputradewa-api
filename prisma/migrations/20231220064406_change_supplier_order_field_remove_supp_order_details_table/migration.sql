/*
  Warnings:

  - You are about to drop the `SupplierOrderDetails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `qty` to the `SupplierOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierOrderId` to the `VehicleOrders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SupplierOrderDetails" DROP CONSTRAINT "SupplierOrderDetails_supplierOrderId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierOrderDetails" DROP CONSTRAINT "SupplierOrderDetails_vehicleOrderId_fkey";

-- AlterTable
ALTER TABLE "SupplierOrders" ADD COLUMN     "qty" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "VehicleOrders" ADD COLUMN     "supplierOrderId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SupplierOrderDetails";

-- AddForeignKey
ALTER TABLE "VehicleOrders" ADD CONSTRAINT "VehicleOrders_supplierOrderId_fkey" FOREIGN KEY ("supplierOrderId") REFERENCES "SupplierOrders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
