CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    subscription VARCHAR(20) CHECK (subscription IN ('starter', 'pro', 'business')) DEFAULT 'starter',
    token TEXT DEFAULT NULL
);

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS owner UUID;

INSERT INTO users (id, email, password, subscription)
VALUES ('00000000-0000-0000-0000-000000000000', 'temp.user@example.com', 'hashedpassword', 'starter')
ON CONFLICT (id) DO NOTHING;

UPDATE contacts SET owner = '00000000-0000-0000-0000-000000000000' WHERE owner IS NULL;

ALTER TABLE contacts ALTER COLUMN owner SET NOT NULL;

ALTER TABLE contacts
ADD CONSTRAINT fk_contacts_user FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_contacts_owner ON contacts(owner);

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);

ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
