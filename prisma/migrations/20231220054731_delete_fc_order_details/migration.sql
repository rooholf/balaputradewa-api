/*
  Warnings:

  - You are about to drop the column `factoryOrderDetailsId` on the `VehicleOrders` table. All the data in the column will be lost.
  - You are about to drop the `FactoryOrderDetails` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Factories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qty` to the `FactoryOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `FactoryOrders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FactoryOrderDetails" DROP CONSTRAINT "FactoryOrderDetails_factoryOrderId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrderDetails" DROP CONSTRAINT "FactoryOrderDetails_factoryPriceId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleOrders" DROP CONSTRAINT "VehicleOrders_factoryOrderDetailsId_fkey";

-- AlterTable
ALTER TABLE "FactoryOrders" ADD COLUMN     "qty" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "VehicleOrders" DROP COLUMN "factoryOrderDetailsId",
ADD COLUMN     "factoryOrdersId" INTEGER;

-- DropTable
DROP TABLE "FactoryOrderDetails";

-- CreateIndex
CREATE UNIQUE INDEX "Factories_id_key" ON "Factories"("id");

-- AddForeignKey
ALTER TABLE "VehicleOrders" ADD CONSTRAINT "VehicleOrders_factoryOrdersId_fkey" FOREIGN KEY ("factoryOrdersId") REFERENCES "FactoryOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
