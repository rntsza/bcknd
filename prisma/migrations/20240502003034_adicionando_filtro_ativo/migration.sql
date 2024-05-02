-- AlterTable
ALTER TABLE "Advogado" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ModeloTexto" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
