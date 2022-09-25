-- Created: September 25th, 2022 @ 1:43:29 AM 
-- Write SQL for new migration

ALTER TABLE "_REGISTRATION_TEMPLATE_BY_ADMIN"
ADD max_spots INTEGER, -- default null
ADD show_max_spots BOOLEAN DEFAULT true;

UPDATE "_REGISTRATION_TEMPLATE_BY_ADMIN" SET show_max_spots = true;
