/*
  Warnings:

  - You are about to drop the column `invCode` on the `VehicleOrders` table. All the data in the column will be lost.
  - You are about to drop the column `invDate` on the `VehicleOrders` table. All the data in the column will be lost.
  - You are about to drop the column `invTotal` on the `VehicleOrders` table. All the data in the column will be lost.
  - Added the required column `qty` to the `VehicleOrders` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VehicleOrders_id_invCode_idx";

-- DropIndex
DROP INDEX "VehicleOrders_invCode_key";

-- AlterTable
ALTER TABLE "VehicleOrders" DROP COLUMN "invCode",
DROP COLUMN "invDate",
DROP COLUMN "invTotal",
ADD COLUMN     "qty" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "VehicleOrders_id_plate_idx" ON "VehicleOrders"("id", "plate");
