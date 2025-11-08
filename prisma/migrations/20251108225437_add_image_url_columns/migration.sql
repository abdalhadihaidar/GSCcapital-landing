-- AlterTable
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Statistic" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

