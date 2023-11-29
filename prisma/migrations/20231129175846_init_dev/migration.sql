/*
  Warnings:

  - You are about to drop the column `harga` on the `FactoryPrices` table. All the data in the column will be lost.
  - Added the required column `price` to the `FactoryPrices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FactoryPrices" DROP COLUMN "harga",
ADD COLUMN     "price" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Farmers" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farmers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmerOrder" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmers_code_key" ON "Farmers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FarmerOrder_code_key" ON "FarmerOrder"("code");

-- AddForeignKey
ALTER TABLE "FarmerOrder" ADD CONSTRAINT "FarmerOrder_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
