/*
  Warnings:

  - Added the required column `address` to the `Suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `Suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Suppliers" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "product" TEXT NOT NULL;
