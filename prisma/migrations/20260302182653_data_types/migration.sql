/*
  Warnings:

  - The `date` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
