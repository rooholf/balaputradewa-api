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
    "invCode" TEXT NOT NULL,
    "invDate" DATE NOT NULL,
    "invTotal" INTEGER NOT NULL,
    "plate" TEXT NOT NULL,
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
    "invCode" TEXT NOT NULL,
    "invDate" DATE NOT NULL,
    "invTotal" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "factoryPriceId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierOrderDetails" (
    "id" SERIAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "supplierOrderId" INTEGER NOT NULL,
    "vehicleOrderId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierOrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPrices" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "isPPN" BOOLEAN NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "factoryPriceId" INTEGER NOT NULL,
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
    "invCode" TEXT NOT NULL,
    "invDate" DATE NOT NULL,
    "invTotal" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryOrderDetails" (
    "id" SERIAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "factoryOrderId" INTEGER NOT NULL,
    "supplierOrderId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryOrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryPrices" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryPrices_pkey" PRIMARY KEY ("id")
);

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
    "transactionCode" TEXT NOT NULL,
    "transactionDate" DATE NOT NULL,
    "transactionTotal" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccounts" (
    "id" SERIAL NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankTransactions" (
    "id" SERIAL NOT NULL,
    "transactionDate" DATE NOT NULL,
    "transactionCode" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "bankAccountId" INTEGER NOT NULL,
    "supplierOrderId" INTEGER,
    "factoryOrderId" INTEGER,
    "farmerOrderId" INTEGER,
    "vehicleOrderId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankTransactions_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "Vehicles_id_plate_idx" ON "Vehicles"("id", "plate");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOrders_invCode_key" ON "VehicleOrders"("invCode");

-- CreateIndex
CREATE INDEX "VehicleOrders_id_invCode_idx" ON "VehicleOrders"("id", "invCode");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_code_key" ON "Suppliers"("code");

-- CreateIndex
CREATE INDEX "Suppliers_id_code_idx" ON "Suppliers"("id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierOrders_invCode_key" ON "SupplierOrders"("invCode");

-- CreateIndex
CREATE INDEX "SupplierOrders_id_invCode_idx" ON "SupplierOrders"("id", "invCode");

-- CreateIndex
CREATE INDEX "SupplierOrderDetails_id_idx" ON "SupplierOrderDetails"("id");

-- CreateIndex
CREATE INDEX "SupplierPrices_id_idx" ON "SupplierPrices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Factories_code_key" ON "Factories"("code");

-- CreateIndex
CREATE INDEX "Factories_id_code_idx" ON "Factories"("id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "FactoryOrders_invCode_key" ON "FactoryOrders"("invCode");

-- CreateIndex
CREATE INDEX "FactoryOrders_id_invCode_idx" ON "FactoryOrders"("id", "invCode");

-- CreateIndex
CREATE INDEX "FactoryOrderDetails_id_idx" ON "FactoryOrderDetails"("id");

-- CreateIndex
CREATE INDEX "FactoryPrices_id_idx" ON "FactoryPrices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Farmers_code_key" ON "Farmers"("code");

-- CreateIndex
CREATE INDEX "Farmers_id_code_idx" ON "Farmers"("id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "FarmerOrder_transactionCode_key" ON "FarmerOrder"("transactionCode");

-- CreateIndex
CREATE INDEX "FarmerOrder_id_transactionCode_idx" ON "FarmerOrder"("id", "transactionCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccounts_accountNumber_key" ON "BankAccounts"("accountNumber");

-- CreateIndex
CREATE INDEX "BankAccounts_id_accountNumber_idx" ON "BankAccounts"("id", "accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BankTransactions_transactionCode_key" ON "BankTransactions"("transactionCode");

-- CreateIndex
CREATE INDEX "BankTransactions_id_idx" ON "BankTransactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_FactoriesToSuppliers_AB_unique" ON "_FactoriesToSuppliers"("A", "B");

-- CreateIndex
CREATE INDEX "_FactoriesToSuppliers_B_index" ON "_FactoriesToSuppliers"("B");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOrders" ADD CONSTRAINT "VehicleOrders_plate_fkey" FOREIGN KEY ("plate") REFERENCES "Vehicles"("plate") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrders" ADD CONSTRAINT "SupplierOrders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrders" ADD CONSTRAINT "SupplierOrders_factoryPriceId_fkey" FOREIGN KEY ("factoryPriceId") REFERENCES "FactoryPrices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrderDetails" ADD CONSTRAINT "SupplierOrderDetails_supplierOrderId_fkey" FOREIGN KEY ("supplierOrderId") REFERENCES "SupplierOrders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOrderDetails" ADD CONSTRAINT "SupplierOrderDetails_vehicleOrderId_fkey" FOREIGN KEY ("vehicleOrderId") REFERENCES "VehicleOrders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPrices" ADD CONSTRAINT "SupplierPrices_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPrices" ADD CONSTRAINT "SupplierPrices_factoryPriceId_fkey" FOREIGN KEY ("factoryPriceId") REFERENCES "FactoryPrices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrders" ADD CONSTRAINT "FactoryOrders_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetails" ADD CONSTRAINT "FactoryOrderDetails_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetails" ADD CONSTRAINT "FactoryOrderDetails_supplierOrderId_fkey" FOREIGN KEY ("supplierOrderId") REFERENCES "SupplierOrders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryPrices" ADD CONSTRAINT "FactoryPrices_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmerOrder" ADD CONSTRAINT "FarmerOrder_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_supplierOrderId_fkey" FOREIGN KEY ("supplierOrderId") REFERENCES "SupplierOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_farmerOrderId_fkey" FOREIGN KEY ("farmerOrderId") REFERENCES "FarmerOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransactions" ADD CONSTRAINT "BankTransactions_vehicleOrderId_fkey" FOREIGN KEY ("vehicleOrderId") REFERENCES "VehicleOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoriesToSuppliers" ADD CONSTRAINT "_FactoriesToSuppliers_A_fkey" FOREIGN KEY ("A") REFERENCES "Factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoriesToSuppliers" ADD CONSTRAINT "_FactoriesToSuppliers_B_fkey" FOREIGN KEY ("B") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
