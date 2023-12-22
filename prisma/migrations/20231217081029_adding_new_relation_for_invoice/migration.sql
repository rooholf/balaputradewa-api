/*
  Warnings:

  - You are about to drop the column `factoryOrderId` on the `BankTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `supplierOrderId` on the `BankTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleOrderId` on the `BankTransactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supplierInvCode]` on the table `BankTransactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[factoryInvCode]` on the table `BankTransactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `FactoryOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SupplierOrders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankTransactions" DROP CONSTRAINT "BankTransactions_factoryOrderId_fkey";

-- DropForeignKey
ALTER TABLE "BankTransactions" DROP CONSTRAINT "BankTransactions_supplierOrderId_fkey";

-- DropForeignKey
ALTER TABLE "BankTransactions" DROP CONSTRAINT "BankTransactions_vehicleOrderId_fkey";

-- AlterTable
ALTER TABLE "BankTransactions" DROP COLUMN "factoryOrderId",
DROP COLUMN "supplierOrderId",
DROP COLUMN "vehicleOrderId",
ADD COLUMN     "factoryInvCode" TEXT,
ADD COLUMN     "supplierInvCode" TEXT;

-- AlterTable
ALTER TABLE "FactoryOrders" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SupplierOrders" ADD COLUMN     "status" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BankTransactions_supplierInvCode_key" ON "BankTransactions"("supplierInvCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankTransactions_factoryInvCode_key" ON "BankTransactions"("factoryInvCode");

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_supplierInvCode_fkey" FOREIGN KEY ("supplierInvCode") REFERENCES "SupplierOrders"("invCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_factoryInvCode_fkey" FOREIGN KEY ("factoryInvCode") REFERENCES "FactoryOrders"("invCode") ON DELETE SET NULL ON UPDATE CASCADE;
