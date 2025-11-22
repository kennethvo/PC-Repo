-- Active: 1762361951000@@127.0.0.1@5432@mysampledb
/*
SQL - Structured Query Language
SQL is used to interact with the database, and has many different dialects, or languages. 
We will be using PostgreSQL, but you may run across MySQL, Oracle, SQL Server, or SQLite to name a few.

Each dialect will have some quirks on what keywords are available, or how it handles data types, etc.
For the most part, they're generally interchangable, and knowing one makes it easier to learn the others.

All SQL dialects leverage the same families of sub-language. They're groups of commands to help us perform different types of actions:
DQL, DDL, DML, DCL

DQL - Data Query Language:
DQL is used to retrieve data from the database.

DDL - Data Definition Language:
DDL is used to help us define the structure of the database and the tables in it.

DML - Data Manipulation Language:
DML is used to perform actions on the data in the database.

DCL - Data Control Language:
DCL is used to control access to the database.

We'll be looking at DDL here...

DDL helps us define the structure, not the data. 
It will focus on creating, modifying, and deleting the tables in the database.
Remember that the table will set the rules for what data it can contain, or what requirements the data must meet.

Common command structure is:
[VERB] [NOUN] [Specifics]

VERBS:
CREATE - creates a new object in the database
ALTER - modifies the structure of an object in the database
DROP - deletes an object from the database

NOUNS:
DATABASE - a container for a collection of related data
SCHEMA - a container for a collection of related tables
TABLE - a collection of related data
CONSTRAINT - a rule that applies to the data in a table

CREATE TABLE - creates a new table in the database
ALTER TABLE - modifies the structure of a table
DROP TABLE - deletes a table from the database


Let's start by creating a new database...
*/

CREATE DATABASE mySampleDb;

-- Don't forget to switch to the new database! PostgreSQL is mean, and doesn't let us do that by command in the SQL, but we can do it in the UI if we need to.
-- In VSCode, just right click, and look for "Change Active Connection". Then select "mySampleDb". If you're using someting other than VSCode, you're on your own!

/*
The CREATE SCHEMA command creates a new schema in the database.

A schema is a container for a collection of related tables.
When we query the database, we can refer to multiple tables in the same schema, but not across different schemas.
*/
CREATE SCHEMA mySampleSchema;

/*
you can make your life a little easier here by making all of your commands go to this new schemausing the same UI options as we did for the database.
OR
you can just include the schema that you want to leverage in the commands you use. 

Let's get started by cretaing a generally useless table, but one that has a lot of different data types for us to check out.
Notice that we'll use CREATE TABLE mySampleSchema.myNewTable... this will tell Postgres to create the table in the mySampleSchema schema...
*/
CREATE TABLE mySampleSchema.myNewTable (
    --id INTEGER UNIQUE NOT NULL, -- being UNIQUE and NOT NULL makes something a Candidate Key, but only setting the constraing of PRIMARY KEY will actually make something the PK.
    id INTEGER PRIMARY KEY,
    email VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    salary FLOAT CHECK (salary > 0),
    thirdSalary DECIMAL,
    fourthSalary NUMERIC (10, 2) -- precision (total number of digits),
    -- scale (maximum number or digits to the right of the decimal)
);


/* You could just create a table, like this:

CREATE TABLE mySampleSchema.AnotherSimpleTable (
    id INTEGER,
    name VARCHAR(100)
);

...but it only specifies the bare minimum. No primary key, no constraints, no relationships, nothing. 
Just a table with no structure.

It's usually best to add some basic constraints, like the primary key, or maybe NOT NULL or UNIQUE, or a CHECK constraint.
Once ALL of your tables are created, we can add the relationships using ALTER TABLE.
*/


CREATE TABLE mySampleSchema.AnotherSimpleTable (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100)
);

-- ALTER TABLE will let us modify the structure of the table, like adding a new column or setting a constraint.
ALTER TABLE mySampleSchema.AnotherSimpleTable 
ADD COLUMN newTable_id INTEGER;


-- One common use of ALTER TABLE is to add the relationship between tables, AFTER all of the tables are created.
-- This makes it easier for us to manage the relationship as a constraint - a named property that we can refer to later.
ALTER TABLE mySampleSchema.AnotherSimpleTable 
ADD CONSTRAINT fk_newTable_id
FOREIGN KEY (newTable_id) 
    REFERENCES mySampleSchema.myNewTable (id);


/*
DROP TABLE will let us delete a table from the database
We do need to be aware of the order that we try to drop things in. 
If we drop a table that has a relationship to another table, we need to drop the relationship, or the other table first.
Keeping track of the order of drops is a common source of errors.

A quick work around that makes that moot is to drop the constraint first. By dropping the relationship, you can then drop the tables in any order!
*/

ALTER TABLE mysampleschema.AnotherSimpleTable 
    DROP CONSTRAINT fk_newTable_id;
DROP TABLE mySampleSchema.myNewTable;
DROP TABLE mySampleSchema.AnotherSimpleTable;
DROP SCHEMA mySampleSchema;
DROP DATABASE mySampleDb;