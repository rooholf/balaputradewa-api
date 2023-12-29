/*
  Warnings:

  - You are about to drop the column `product` on the `Suppliers` table. All the data in the column will be lost.
  - Added the required column `description` to the `BankTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankTransactions" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "farmerSavingId" INTEGER;

-- AlterTable
ALTER TABLE "Suppliers" DROP COLUMN "product",
ADD COLUMN     "productsId" INTEGER;

-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmerSaving" (
    "id" SERIAL NOT NULL,
    "savingDate" DATE NOT NULL,
    "savingAmount" INTEGER NOT NULL,
    "savingType" TEXT NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerSaving_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_id_key" ON "Products"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Products_code_key" ON "Products"("code");

-- CreateIndex
CREATE INDEX "Products_id_code_idx" ON "Products"("id", "code");

-- CreateIndex
CREATE INDEX "FarmerSaving_id_idx" ON "FarmerSaving"("id");

-- AddForeignKey
ALTER TABLE "Suppliers" ADD CONSTRAINT "Suppliers_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_farmerSavingId_fkey" FOREIGN KEY ("farmerSavingId") REFERENCES "FarmerSaving"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmerSaving" ADD CONSTRAINT "FarmerSaving_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
