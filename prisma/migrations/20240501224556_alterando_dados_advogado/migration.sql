/*
  Warnings:

  - Made the column `password` on table `Advogado` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Advogado" ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "nascimento" DROP NOT NULL;
