-- Write SQL for new migration 

ALTER TABLE "seasons"
ADD "start_date" TIMESTAMP,
ADD "end_date" TIMESTAMP;
