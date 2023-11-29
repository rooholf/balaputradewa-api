/*
  Warnings:

  - You are about to drop the `Factory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactoryOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactoryPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupplierOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupplierPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FactoryToSupplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FactoryOrder" DROP CONSTRAINT "FactoryOrder_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrder" DROP CONSTRAINT "FactoryOrder_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryPrice" DROP CONSTRAINT "FactoryPrice_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierOrder" DROP CONSTRAINT "SupplierOrder_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierOrder" DROP CONSTRAINT "SupplierOrder_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierPrice" DROP CONSTRAINT "SupplierPrice_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleOrder" DROP CONSTRAINT "VehicleOrder_plate_fkey";

-- DropForeignKey
ALTER TABLE "VehicleOrder" DROP CONSTRAINT "VehicleOrder_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "_FactoryToSupplier" DROP CONSTRAINT "_FactoryToSupplier_A_fkey";

-- DropForeignKey
ALTER TABLE "_FactoryToSupplier" DROP CONSTRAINT "_FactoryToSupplier_B_fkey";

-- DropTable
DROP TABLE "Factory";

-- DropTable
DROP TABLE "FactoryOrder";

-- DropTable
DROP TABLE "FactoryPrice";

-- DropTable
DROP TABLE "Supplier";

-- DropTable
DROP TABLE "SupplierOrder";

-- DropTable
DROP TABLE "SupplierPrice";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Vehicle";

-- DropTable
DROP TABLE "VehicleOrder";

-- DropTable
DROP TABLE "_FactoryToSupplier";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "color" TEXT,
    "brand" TEXT NOT NULL,
    "chassis" TEXT,
    "supplierId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOrders" (
    "id" SERIAL NOT NULL,
    "transaction_code" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "plate" TEXT NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierOrders" (
    "id" SERIAL NOT NULL,
    "transaction_code" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPrices" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "isPPN" BOOLEAN NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierPrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factories" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryOrders" (
    "id" SERIAL NOT NULL,
    "kode_transaksi" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryPrices" (
    "id" SERIAL NOT NULL,
    "harga" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryPrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FactoriesToSuppliers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_id_email_idx" ON "Users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_plate_key" ON "Vehicles"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOrders_transaction_code_key" ON "VehicleOrders"("transaction_code");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_code_key" ON "Suppliers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierOrders_transaction_code_key" ON "SupplierOrders"("transaction_code");

-- CreateIndex
CREATE UNIQUE INDEX "Factories_code_key" ON "Factories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FactoryOrders_kode_transaksi_key" ON "FactoryOrders"("kode_transaksi");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_kode_key" ON "Transactions"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "_FactoriesToSuppliers_AB_unique" ON "_FactoriesToSuppliers"("A", "B");

-- CreateIndex
CREATE INDEX "_FactoriesToSuppliers_B_index" ON "_FactoriesToSuppliers"("B");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOrders" ADD CONSTRAINT "VehicleOrders_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOrders" ADD CONSTRAINT "VehicleOrders_plate_fkey" FOREIGN KEY ("plate") REFERENCES "Vehicles"("plate") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrders" ADD CONSTRAINT "SupplierOrders_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrders" ADD CONSTRAINT "SupplierOrders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPrices" ADD CONSTRAINT "SupplierPrices_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrders" ADD CONSTRAINT "FactoryOrders_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrders" ADD CONSTRAINT "FactoryOrders_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryPrices" ADD CONSTRAINT "FactoryPrices_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoriesToSuppliers" ADD CONSTRAINT "_FactoriesToSuppliers_A_fkey" FOREIGN KEY ("A") REFERENCES "Factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoriesToSuppliers" ADD CONSTRAINT "_FactoriesToSuppliers_B_fkey" FOREIGN KEY ("B") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
