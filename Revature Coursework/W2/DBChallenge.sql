-- Active: 1762363179651@@127.0.0.1@5432@challengedb
CREATE DATABASE challengedb;

CREATE SCHEMA collegeclasses;

/*******************************************************************************
   Create Tables
********************************************************************************/

CREATE TABLE collegeclasses.StudentTable(
    student_id SERIAL PRIMARY KEY,
    student_first_name VARCHAR(50) NOT NULL,
    student_last_name VARCHAR(100) NOT NULL,
    email VARCHAR (100) NOT NULL CHECK (email LIKE '%@%.%')
);

CREATE TABLE collegeclasses.ProfessorTable (
    professor_id SERIAL PRIMARY KEY,
    professor_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE
);

CREATE TABLE collegeclasses.ClassTable (
    class_id INT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    professor_id INT,
    schedule VARCHAR(50),
    FOREIGN KEY (professor_id) REFERENCES collegeclasses.ProfessorTable(professor_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE collegeclasses.EnrollmentTable (
    student_id INT,
    class_id INT,
    term VARCHAR(50),
    PRIMARY KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES collegeclasses.StudentTable(student_id)
    ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES collegeclasses.ClassTable(class_id)
    ON DELETE CASCADE
);


/*******************************************************************************
   Drop Tables
********************************************************************************/
DROP TABLE collegeclasses.enrollmenttable;
DROP TABLE collegeclasses.classtable;
DROP TABLE collegeclasses.professortable;
DROP TABLE collegeclasses.studenttable;


/*******************************************************************************
   Populate Tables
********************************************************************************/

-- Professors
INSERT INTO collegeclasses.ProfessorTable (professor_name, email) VALUES 
('Dr. Smith', 'smith@uni.edu'),
('Dr. Brown', 'brown@uni.edu');

-- Students
INSERT INTO collegeclasses.StudentTable (student_first_name, student_last_name, email) VALUES 
('Alice', 'Wonderland', 'alicew@uni.edu'),
('Bob', 'Builder', 'bobb@uni.edu'),
('Tim', 'Curry', 'timc@uni.edu'),
('Will', 'Smith', 'wills@uni.edu'),
('Anna', 'Danson', 'annad@uni.edu'),
('David', 'Cheap', 'davidc@uni.edu'),
('Holly', 'Baker', '@uni.edu');

-- ON CONFLICT DO NOTHING
-- use this in above insert statement
-- if record already exists, nothing is added and error is avoided

INSERT INTO collegeclasses.StudentTable (student_first_name, student_last_name, email) VALUES 
('Jane', 'Wonderland', 'myemail');

-- Classes
INSERT INTO collegeclasses.ClassTable VALUES (101, 'Database Systems', 1, 'Mon 10AM');
INSERT INTO collegeclasses.ClassTable VALUES (102, 'Linear Algebra', 2, 'Tue 2PM');

-- Enrollment
INSERT INTO collegeclasses.EnrollmentTable VALUES (1, 102, 'Fall 2025');
INSERT INTO collegeclasses.EnrollmentTable VALUES (1, 101, 'Spring 2026');
INSERT INTO collegeclasses.EnrollmentTable VALUES (2, 102, 'Fall 2025');
INSERT INTO collegeclasses.EnrollmentTable VALUES (2, 101, 'Spring 2026');

INSERT INTO collegeclasses.enrollmenttable VALUES 
(3, 102, 'Fall 2025'),
(3, 101, 'Spring 2026'),
(4, 102, 'Spring 2026'),
(4, 101, 'Fall 2025');

ALTER TABLE collegeclasses.studenttable ADD CONSTRAINT emailcheck CHECK (email LIKE '%_@%_._%');
ALTER TABLE collegeclasses.classtable ADD COLUMN classprefix VARCHAR(5);
UPDATE collegeclasses.classtable SET classprefix = 'MATH' WHERE collegeclasses.classtable.class_id = 102;
UPDATE collegeclasses.classtable SET classprefix = 'CS' WHERE collegeclasses.classtable.class_id = 101;

/*******************************************************************************
   Queries
********************************************************************************/
-- DBCode
-- Get list of classes with professors and the students that will be in that class
SELECT c.class_id, c.class_name, p.professor_name, c.schedule FROM collegeclasses.classtable as c inner join collegeclasses.professortable as p 
    on c.professor_id = p.professor_id;

WITH
    classes as (
        SELECT c.class_id, c.class_name, p.professor_name, c.schedule FROM collegeclasses.classtable as c inner join collegeclasses.professortable as p 
        on c.professor_id = p.professor_id
    )
select enroll.term, concat(student.student_first_name, ' ', student.student_last_name) as student_name, classes.* 
    from collegeclasses.studenttable as student inner join collegeclasses.enrollmenttable as enroll 
    on student.student_id = enroll.student_id
    inner join classes on enroll.class_id = classes.class_id order by enroll.term;


/*******************************************************************************
   Deletes
********************************************************************************/
DELETE FROM collegeclasses.studenttable WHERE student_id = 4;