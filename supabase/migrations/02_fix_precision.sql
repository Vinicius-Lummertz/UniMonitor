-- Fix precision for grades and weights
-- Currently NUMERIC(3,2) which caps at 9.99. We need to allow 10.0.
-- Changing to NUMERIC(4,2) allows up to 99.99

ALTER TABLE activities 
ALTER COLUMN weight TYPE NUMERIC(4,2),
ALTER COLUMN grade TYPE NUMERIC(4,2);
