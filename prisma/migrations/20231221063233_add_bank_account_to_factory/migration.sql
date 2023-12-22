-- AlterTable
ALTER TABLE "BankAccounts" ADD COLUMN     "factoriesId" INTEGER;

-- AddForeignKey
ALTER TABLE "BankAccounts" ADD CONSTRAINT "BankAccounts_factoriesId_fkey" FOREIGN KEY ("factoriesId") REFERENCES "Factories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
