-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" SERIAL NOT NULL,
    "plat" TEXT NOT NULL,
    "warna" TEXT,
    "merk" TEXT NOT NULL,
    "rangka" TEXT,
    "kodeSupplier" TEXT NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier_orders" (
    "id" SERIAL NOT NULL,
    "kode_transaksi" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "kodeSupplier" TEXT NOT NULL,
    "kodeTransaksi" TEXT NOT NULL,

    CONSTRAINT "Supplier_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier_price" (
    "id" SERIAL NOT NULL,
    "harga" INTEGER NOT NULL,
    "isPPN" BOOLEAN NOT NULL,
    "kodeSupplier" TEXT NOT NULL,

    CONSTRAINT "Supplier_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factories" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Factories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory_prices" (
    "id" SERIAL NOT NULL,
    "harga" INTEGER NOT NULL,
    "kodePabrik" TEXT NOT NULL,

    CONSTRAINT "Factory_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory_orders" (
    "id" SERIAL NOT NULL,
    "kode_transaksi" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "kodePabrik" TEXT NOT NULL,
    "kodeTransaksi" TEXT NOT NULL,

    CONSTRAINT "Factory_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farmers" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT NOT NULL,

    CONSTRAINT "Farmers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "petani_orders" (
    "id" SERIAL NOT NULL,
    "kode_transaksi" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "idPetani" INTEGER NOT NULL,
    "kodeTransaksi" TEXT NOT NULL,

    CONSTRAINT "petani_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank_account" (
    "id" SERIAL NOT NULL,
    "kode_bank" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Bank_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tanggal_bayar" TIMESTAMP(3),
    "tanggal_kirim" TIMESTAMP(3),
    "tanggal" DATE NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FactoriesToSuppliers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_plat_key" ON "Vehicles"("plat");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_kode_key" ON "Suppliers"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_orders_kode_transaksi_key" ON "Supplier_orders"("kode_transaksi");

-- CreateIndex
CREATE UNIQUE INDEX "Factories_kode_key" ON "Factories"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_orders_kode_transaksi_key" ON "Factory_orders"("kode_transaksi");

-- CreateIndex
CREATE UNIQUE INDEX "Farmers_kode_key" ON "Farmers"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "petani_orders_kode_transaksi_key" ON "petani_orders"("kode_transaksi");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_kode_key" ON "Transaction"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "_FactoriesToSuppliers_AB_unique" ON "_FactoriesToSuppliers"("A", "B");

-- CreateIndex
CREATE INDEX "_FactoriesToSuppliers_B_index" ON "_FactoriesToSuppliers"("B");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_kodeSupplier_fkey" FOREIGN KEY ("kodeSupplier") REFERENCES "Suppliers"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier_orders" ADD CONSTRAINT "Supplier_orders_kodeTransaksi_fkey" FOREIGN KEY ("kodeTransaksi") REFERENCES "Transaction"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier_orders" ADD CONSTRAINT "Supplier_orders_kodeSupplier_fkey" FOREIGN KEY ("kodeSupplier") REFERENCES "Suppliers"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier_price" ADD CONSTRAINT "Supplier_price_kodeSupplier_fkey" FOREIGN KEY ("kodeSupplier") REFERENCES "Suppliers"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory_prices" ADD CONSTRAINT "Factory_prices_kodePabrik_fkey" FOREIGN KEY ("kodePabrik") REFERENCES "Factories"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory_orders" ADD CONSTRAINT "Factory_orders_kodeTransaksi_fkey" FOREIGN KEY ("kodeTransaksi") REFERENCES "Transaction"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory_orders" ADD CONSTRAINT "Factory_orders_kodePabrik_fkey" FOREIGN KEY ("kodePabrik") REFERENCES "Factories"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "petani_orders" ADD CONSTRAINT "petani_orders_kodeTransaksi_fkey" FOREIGN KEY ("kodeTransaksi") REFERENCES "Transaction"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "petani_orders" ADD CONSTRAINT "petani_orders_idPetani_fkey" FOREIGN KEY ("idPetani") REFERENCES "Farmers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoriesToSuppliers" ADD CONSTRAINT "_FactoriesToSuppliers_A_fkey" FOREIGN KEY ("A") REFERENCES "Factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoriesToSuppliers" ADD CONSTRAINT "_FactoriesToSuppliers_B_fkey" FOREIGN KEY ("B") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
