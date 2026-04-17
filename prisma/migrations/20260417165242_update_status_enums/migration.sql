/*
  Warnings:

  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `certificationStatus` on the `VendorProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastLogin";

-- AlterTable
ALTER TABLE "VendorProfile" DROP COLUMN "certificationStatus",
ADD COLUMN     "vendorStatus" "VendorStatus" NOT NULL DEFAULT 'pending';
