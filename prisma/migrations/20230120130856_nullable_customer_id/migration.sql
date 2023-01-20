-- DropForeignKey
ALTER TABLE "DiscussionEvent" DROP CONSTRAINT "DiscussionEvent_customer_id_fkey";

-- AlterTable
ALTER TABLE "DiscussionEvent" ALTER COLUMN "customer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscussionEvent" ADD CONSTRAINT "DiscussionEvent_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
