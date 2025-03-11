CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  favorite BOOLEAN DEFAULT FALSE
);

INSERT INTO contacts (id, name, email, phone) VALUES
('cfb84565-5a16-4fcd-94d5-75fd33f73afd', 'Allen Raymond', 'allen.raymond@example.com', '(992) 914-3792'),
('31abfbf7-b0e9-4d3e-9187-bc46ea9caa28', 'Chaim Lewis', 'chaim.lewis@example.com', '(294) 840-6685'),
('da378f53-df9e-47a2-a2dd-7f9e9fe62639', 'Kennedy Lane', 'kennedy.lane@example.com', '(542) 451-7038'),
('cee88490-248b-4fc6-99d3-1330356642f4', 'Wylie Pope', 'wylie.pope@example.com', '(692) 802-2949'),
('7da52b07-dc8f-4d27-8f77-647c74392eef', 'Cyrus Jackson', 'cyrus.jackson@example.com', '(501) 472-5218'),
('9bfd45dc-cfdf-452f-9107-5bfb750fe4f4', 'Abbot Franks', 'abbot.franks@example.com', '(186) 568-3720'),
('4d9d9630-36f7-429d-8dc7-e3f44d557d6e', 'Reuben Henry', 'reuben.henry@example.com', '(715) 598-5792'),
('e5496665-c90c-4932-b2fe-309f17b6481e', 'Thomas Lucas', 'thomas.lucas@example.com', '(704) 398-7993'),
('70336962-fb30-4097-9948-1d212279e629', 'Alec Howard', 'alec.howard@example.com', '(748) 206-2688');
