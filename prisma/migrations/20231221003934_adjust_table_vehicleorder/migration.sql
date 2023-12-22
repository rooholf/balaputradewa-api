/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `SupplierOrders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `VehicleOrders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plate]` on the table `VehicleOrders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SupplierOrders_id_key" ON "SupplierOrders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOrders_id_key" ON "VehicleOrders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOrders_plate_key" ON "VehicleOrders"("plate");
