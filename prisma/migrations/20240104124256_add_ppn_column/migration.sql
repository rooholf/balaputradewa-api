/*
  Warnings:

  - You are about to drop the column `isPPN` on the `SupplierPrices` table. All the data in the column will be lost.
  - Added the required column `isPPN` to the `Factories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dpp` to the `FactoryOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pph` to the `FactoryOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ppn` to the `FactoryOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factories" ADD COLUMN     "isPPN" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "FactoryOrders" ADD COLUMN     "dpp" INTEGER NOT NULL,
ADD COLUMN     "pph" INTEGER NOT NULL,
ADD COLUMN     "ppn" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SupplierPrices" DROP COLUMN "isPPN";
