/*
  Warnings:

  - You are about to drop the column `tanggal` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Factories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Factory_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Factory_prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Farmers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Supplier_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Supplier_price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factories" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Factory_orders" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Factory_prices" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Farmers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Supplier_orders" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Supplier_price" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Suppliers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "tanggal",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Users_id_email_idx" ON "Users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_email_key" ON "Users"("id", "email");
