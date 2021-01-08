CREATE TABLE admin (
  id INTEGER,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
);
