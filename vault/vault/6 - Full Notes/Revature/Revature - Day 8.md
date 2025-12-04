
2025-11-05 09:17

Tags: [[SQL]], [[revature]], [[Java]]

# Revature - Day 8
### SQL (structure query language)
- everyone stores data in tables (with ease of relating them to each other)
	- relationships between tables through primary and foreign keys
- atomic data: standalone data (smallest individual piece/separation)

Candidate key - anything that COULD be a unique identifier for an entry
Primary key - unique identifier for each entry (HAS to be unique and HAS to exist)
Composite key - combo of two or more candidate keys
normal forms:
- 1st normal form: every table has a primary key (and is atomic)
- 2nd normal form: the whole key?
- 3rd normal form: nothing but the key.
working with atomic data is more efficient

### DQL (data query language)
- when we use docker we still have a pool of CPU and memory, but when docker runs something, it only uses the smaller piece (while a VM would use a lot more).
	- docker doesn't need its own OS or any extra processing power

- query - to get data back, retrieving data

- DQL - data query (retrieving data)
- DML - data manip. (altering data)
- DDL - definition (defining how the data is set up)
- DCL - control (admin levels of the user querying)

```SQL

-- Comments done single line with --
-- multi line is with /* */
-- * is used to select ALL possible values

/*
KEYWORDS:

SELECT - retrieve data, select the columns from the resulting set
FROM - the table(s) to retrieve data from
WHERE - a conditional filter of the data
GROUP BY - group data based on one or more columns
HAVING - conditional filter of grouped data
ORDER BY - sort the data
*/

-- Command Examples
SELECT * FROM actor;
SELECT last_name FROM actor;

```

- 1:1 1:M M:M
# References