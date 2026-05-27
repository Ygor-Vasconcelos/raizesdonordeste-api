-- AlterTable
ALTER TABLE "LogAuditoria" ADD COLUMN     "usuarioId" INTEGER;

-- CreateTable
CREATE TABLE "Fidelidade" (
    "id" SERIAL NOT NULL,
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Fidelidade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fidelidade_usuarioId_key" ON "Fidelidade"("usuarioId");

-- AddForeignKey
ALTER TABLE "Fidelidade" ADD CONSTRAINT "Fidelidade_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogAuditoria" ADD CONSTRAINT "LogAuditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
