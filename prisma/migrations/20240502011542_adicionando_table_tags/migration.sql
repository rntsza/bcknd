-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModeloTextoTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nome_key" ON "Tag"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "_ModeloTextoTags_AB_unique" ON "_ModeloTextoTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ModeloTextoTags_B_index" ON "_ModeloTextoTags"("B");

-- AddForeignKey
ALTER TABLE "_ModeloTextoTags" ADD CONSTRAINT "_ModeloTextoTags_A_fkey" FOREIGN KEY ("A") REFERENCES "ModeloTexto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModeloTextoTags" ADD CONSTRAINT "_ModeloTextoTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
