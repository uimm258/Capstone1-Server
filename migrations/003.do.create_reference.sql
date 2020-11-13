ALTER TABLE IF EXISTS scripts
DROP column category_id;

ALTER TABLE scripts
ADD column category_id INTEGER REFERENCES category(id);