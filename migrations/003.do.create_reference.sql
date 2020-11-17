ALTER TABLE scripts
ADD column category_id INTEGER REFERENCES category(id);