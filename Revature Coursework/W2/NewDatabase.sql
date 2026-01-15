-- Active: 1762365246390@@127.0.0.1@5432@mysimpledb
CREATE DATABASE mySimpleDb;

--dont forget to switch to new database
CREATE SCHEMA mySampleSchema;

CREATE TABLE mySampleSchema.myNewTable (
    --id INTEGER UNIQUE NOT NULL,
    id INTEGER PRIMARY KEY,
    email VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    salary FLOAT CHECK (salary > 0),
    --secondSalary DOUBLE,
    thirdSalaray DECIMAL,
    fourthSalary NUMERIC (10,2) --precison (total number of digits), scale (maximum number of digits to the right of the decimal)
);

CREATE TABLE mySampleSchema.anotherSampleTable (
    id INTEGER PRIMARY KEY,
    name VARCHAR (100)
    --CONSTRAINT...
);

ALTER TABLE mySampleSchema.anotherSampleTable
ADD COLUMN newTable_id INTEGER;

ALTER TABLE mySampleSchema.anotherSampleTable
ADD CONSTRAINT fk_newTable_id
FOREIGN KEY (newTable_id) REFERENCES mysampleschema.myNewTable (id);
DROP TABLE mySampleSchema.myNewTable;
DROP TABLE mysampleschema.anotherSimpleTable;
DROP CONSTRAINT fk_newTable_id;

/*
DML- Data Manipulation Language
--Used ton perform actions on the data
-INSERT
-UPDATE
-DELETE
*/

INSERT INTO mySampleSchema.mynewtable
(id, email, salary, thirdSalaray, fourthSalary)
VALUES
(1, 'a@c.com', 10000, 100.00, 100.00),
(2, 'b@c.com', 10000, 100.00, 100.00),
(3, 'c@c.com', 10000, 100.00, 100.00),
(4, 'd@c.com', 10000, 100.00, 100.00),
(5, 'e@c.com', 10000, 100.00, 100.00);
(6, 'f@c.com', 14070, 185.00, 101.00);
ON CONFLICT DO NOTHING;
INSERT INTO mySampleSchema.mynewtable
(id, email, salary, thirdSalaray, fourthSalary)
VALUES
(6, 'f@c.com', 37200, 120.89, 121.00);

INSERT INTO mysampleschema.anothersampletable
(id, name, newTable_id)
VALUES
(1, 'jimmy', 1),
(2, 'sam', 2),
(3, 'turner', 3),
(4, 'marcus', 4),
(5, 'jordan', 5);








