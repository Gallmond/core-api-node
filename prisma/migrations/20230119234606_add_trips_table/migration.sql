-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "discussion_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "start" DATE,
    "end" DATE,
    "points_value" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
