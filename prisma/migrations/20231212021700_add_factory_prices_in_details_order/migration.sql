/*
  Warnings:

  - You are about to drop the column `price` on the `FactoryOrderDetails` table. All the data in the column will be lost.
  - Added the required column `factoryPriceId` to the `FactoryOrderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `FactoryOrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FactoryOrderDetails" DROP COLUMN "price",
ADD COLUMN     "factoryPriceId" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetails" ADD CONSTRAINT "FactoryOrderDetails_factoryPriceId_fkey" FOREIGN KEY ("factoryPriceId") REFERENCES "FactoryPrices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
