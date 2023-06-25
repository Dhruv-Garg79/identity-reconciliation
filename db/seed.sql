CREATE TABLE IF NOT EXISTS contacts ( 
  id serial PRIMARY KEY,
  "phoneNumber" text,
  "email" text,
  "linkedId" integer,
  "linkPrecedence" text,
  "createdAt" timestamp WITH time zone DEFAULT NOW() NOT NULL,
  "updatedAt" timestamp WITH time zone DEFAULT NOW() NOT NULL,
  "deletedAt" timestamp WITH time zone
);

CREATE OR REPLACE FUNCTION update_timestamp_on_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = current_timestamp; 
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_contacts_updatedOn ON contacts;
CREATE TRIGGER update_contacts_updatedOn
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_on_update();
