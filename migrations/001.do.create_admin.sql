CREATE TABLE if not exists admin (
  id serial PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
