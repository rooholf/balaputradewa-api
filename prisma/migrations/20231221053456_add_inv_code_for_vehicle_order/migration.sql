/*
  Warnings:

  - A unique constraint covering the columns `[invCode]` on the table `VehicleOrders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invCode` to the `VehicleOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleOrders" ADD COLUMN     "invCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOrders_invCode_key" ON "VehicleOrders"("invCode");
