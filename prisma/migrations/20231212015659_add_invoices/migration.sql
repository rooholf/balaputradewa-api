/*
  Warnings:

  - Added the required column `supplierPriceId` to the `SupplierOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FactoryOrders" ADD COLUMN     "factoryPriceId" INTEGER;

-- AlterTable
ALTER TABLE "SupplierOrders" ADD COLUMN     "supplierPriceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SupplierOrders" ADD CONSTRAINT "SupplierOrders_supplierPriceId_fkey" FOREIGN KEY ("supplierPriceId") REFERENCES "SupplierPrices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrders" ADD CONSTRAINT "FactoryOrders_factoryPriceId_fkey" FOREIGN KEY ("factoryPriceId") REFERENCES "FactoryPrices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
