-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantityUsed" INTEGER NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
