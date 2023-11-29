/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `jenis` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_bayar` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_kirim` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Bank_account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Factories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Factory_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Factory_prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Farmers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier_price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FactoriesToSuppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `petani_orders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Factory_orders" DROP CONSTRAINT "Factory_orders_kodePabrik_fkey";

-- DropForeignKey
ALTER TABLE "Factory_orders" DROP CONSTRAINT "Factory_orders_kodeTransaksi_fkey";

-- DropForeignKey
ALTER TABLE "Factory_prices" DROP CONSTRAINT "Factory_prices_kodePabrik_fkey";

-- DropForeignKey
ALTER TABLE "Supplier_orders" DROP CONSTRAINT "Supplier_orders_kodeSupplier_fkey";

-- DropForeignKey
ALTER TABLE "Supplier_orders" DROP CONSTRAINT "Supplier_orders_kodeTransaksi_fkey";

-- DropForeignKey
ALTER TABLE "Supplier_price" DROP CONSTRAINT "Supplier_price_kodeSupplier_fkey";

-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_kodeSupplier_fkey";

-- DropForeignKey
ALTER TABLE "_FactoriesToSuppliers" DROP CONSTRAINT "_FactoriesToSuppliers_A_fkey";

-- DropForeignKey
ALTER TABLE "_FactoriesToSuppliers" DROP CONSTRAINT "_FactoriesToSuppliers_B_fkey";

-- DropForeignKey
ALTER TABLE "petani_orders" DROP CONSTRAINT "petani_orders_idPetani_fkey";

-- DropForeignKey
ALTER TABLE "petani_orders" DROP CONSTRAINT "petani_orders_kodeTransaksi_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "deskripsi",
DROP COLUMN "jenis",
DROP COLUMN "tanggal_bayar",
DROP COLUMN "tanggal_kirim",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Bank_account";

-- DropTable
DROP TABLE "Factories";

-- DropTable
DROP TABLE "Factory_orders";

-- DropTable
DROP TABLE "Factory_prices";

-- DropTable
DROP TABLE "Farmers";

-- DropTable
DROP TABLE "Supplier_orders";

-- DropTable
DROP TABLE "Supplier_price";

-- DropTable
DROP TABLE "Suppliers";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "Vehicles";

-- DropTable
DROP TABLE "_FactoriesToSuppliers";

-- DropTable
DROP TABLE "petani_orders";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "color" TEXT,
    "brand" TEXT NOT NULL,
    "chassis" TEXT,
    "supplierId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOrder" (
    "id" SERIAL NOT NULL,
    "transaction_code" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "plate" TEXT NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierOrder" (
    "id" SERIAL NOT NULL,
    "transaction_code" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPrice" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "isPPN" BOOLEAN NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryOrder" (
    "id" SERIAL NOT NULL,
    "kode_transaksi" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryPrice" (
    "id" SERIAL NOT NULL,
    "harga" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FactoryToSupplier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOrder_transaction_code_key" ON "VehicleOrder"("transaction_code");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierOrder_transaction_code_key" ON "SupplierOrder"("transaction_code");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_code_key" ON "Factory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FactoryOrder_kode_transaksi_key" ON "FactoryOrder"("kode_transaksi");

-- CreateIndex
CREATE UNIQUE INDEX "_FactoryToSupplier_AB_unique" ON "_FactoryToSupplier"("A", "B");

-- CreateIndex
CREATE INDEX "_FactoryToSupplier_B_index" ON "_FactoryToSupplier"("B");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOrder" ADD CONSTRAINT "VehicleOrder_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOrder" ADD CONSTRAINT "VehicleOrder_plate_fkey" FOREIGN KEY ("plate") REFERENCES "Vehicle"("plate") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrder" ADD CONSTRAINT "SupplierOrder_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrder" ADD CONSTRAINT "SupplierOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPrice" ADD CONSTRAINT "SupplierPrice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrder" ADD CONSTRAINT "FactoryOrder_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrder" ADD CONSTRAINT "FactoryOrder_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryPrice" ADD CONSTRAINT "FactoryPrice_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoryToSupplier" ADD CONSTRAINT "_FactoryToSupplier_A_fkey" FOREIGN KEY ("A") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoryToSupplier" ADD CONSTRAINT "_FactoryToSupplier_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
