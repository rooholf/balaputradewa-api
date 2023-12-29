-- AlterTable
ALTER TABLE "SupplierOrders" ADD COLUMN     "factoryOrderId" INTEGER;

-- AddForeignKey
ALTER TABLE "SupplierOrders" ADD CONSTRAINT "SupplierOrders_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
