-- Active: 1762362899455@@127.0.0.1@5432@mysampledb
CREATE DATABASE mySampleDb;

--- don't forget to switch to new database before creating schema (look up schema)
CREATE SCHEMA mySampleSchema;

--- creating a table (define columns and datatypes)
CREATE TABLE mySampleSchema.myNewTable ( -- specify the schema so the table is created in the correct location
    -- id INTEGER UNIQUE NOT NULL, (doesn't make it a primary key you have to use the key word)
    id INTEGER PRIMARY KEY,
    email VARCHAR(50) CHECK email LIKE '%@%.%',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- CONSTRAINTS, kind of like conditionals
    salary FLOAT CHECK (salary > 0),
    -- secondSalary DOUBLE, doubles don't exist???
    thirdSalary DECIMAL,
    fourthSalary NUMERIC (10,2) -- precision is total number of digits, scale specifies max number of digits right of decimal

);

CREATE TABLE mySampleSchema.AnotherSimpleTable (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100)
);

-- you can alter tables by adding columns, constraints, etc.
ALTER TABLE mysampleschema.anothersimpletable
ADD COLUMN newTable_id INTEGER;

-- declare your tables first and WAIT before creating your references. you can just create them afterwards when you alter
ALTER TABLE mysampleschema.anothersimpletable
ADD CONSTRAINT fk_newTable_id
FOREIGN KEY (newTable_id) REFERENCES mysampleschema.mynewtable (id);


-- if you drop you have to drop the secondary one first before dropping the first one?
DROP TABLE mysampleschema.anothersimpletable;
DROP TABLE mysampleschema.mynewtable;
DROP CONSTRAINT fk_newtable_id;