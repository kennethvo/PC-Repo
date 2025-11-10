-- Parking Lot*******
-- *                *
-- *                *
--- *****************

-- SETUP:
-- Create a database server (docker)
-- $ docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
-- Connect to the server (Azure Data Studio / Database extension)
-- Test your connection with a simple query (like a select)
-- Execute the Chinook database (from the Chinook_pg.sql file to create Chinook resources in your server)

SELECT * FROM actor;

-- Comment can be done single line with --
-- Comment can be done multi line with /* */

/*
DQL - Data Query Language
Keywords:

SELECT - retrieve data, select the columns from the resulting set
FROM - the table(s) to retrieve data from
WHERE - a conditional filter of the data
GROUP BY - group the data based on one or more columns
HAVING - a conditional filter of the grouped data
ORDER BY - sort the data
*/

SELECT * FROM actor;
SELECT last_name FROM actor;
SELECT * FROM actor WHERE first_name = 'Morgan';
select * from actor where first_name = 'John';

-- BASIC CHALLENGES
-- List all customers (full name, customer id, and country) who are not in the USA
select * from customer where country != 'USA';

-- List all customers from Brazil
SELECT * FROM customer WHERE country = 'Brazil';

-- List all sales agents
-- SELECT * FROM employee WHERE title LIKE '%Agent%;
SELECT * FROM employee WHERE title = 'Sales Support Agent';

-- Retrieve a list of all countries in billing addresses on invoices


-- Retrieve how many invoices there were in 2009, and what was the sales total for that year?
SELECT COUNT(*) AS invoice_count, SUM(total) AS total_sum FROM invoice WHERE EXTRACT(YEAR FROM invoice_date) = 2009;

-- (challenge: find the invoice count sales total for every year using one query)
SELECT extract(YEAR FROM invoice_date) as InvoiceYear, COUNT(*) as InvoiceCount, SUM(total) AS SalesTotal FROM invoice GROUP BY extract(YEAR FROM invoice_date) ORDER BY InvoiceYear;


-- how many line items were there for invoice #37
SELECT extract(YEAR FROM invoice_date) as InvoiceYear, COUNT(*) as InvoiceCount, SUM(total) AS SalesTotal FROM invoice GROUP BY extract(YEAR FROM invoice_date) ORDER BY InvoiceYear;


-- how many invoices per country? BillingCountry  # of invoices -
-- Retrieve the total sales per country, ordered by the highest total sales first.
select billing_country, count(*) as total_invoices, sum(total) as total_sales from invoice group by billing_country order by total_sales DESC;

-- JOINS CHALLENGES
-- Every Album by Artist
SELECT title, name from Artist join Album USING(artist_id)

-- (inner keyword is optional for inner join)
-- All songs of the rock genre


-- Show all invoices of customers from brazil (mailing address not billing)
SELECT invoice.*
FROM invoice
INNER JOIN customer
ON customer.customer_id = invoice.customer_id
WHERE customer.country = 'Brazil';

-- Show all invoices together with the name of the sales agent for each one


-- Which sales agent made the most sales in 2009?
select e.first_name, e.last_name, sum(i.total) as total_sales
from invoice i inner join customer c on i.customer_id = c.customer_id
inner join employee e on c.support_rep_id = e.employee_id
where EXTRACT(YEAR FROM i.invoice_date) = 2009
group by e.employee_id
order by total_sales desc
limit 1

-- How many customers are assigned to each sales agent?
SELECT count(*), employe.first_name
from employee
inner join customer on employee.employee_id = customer.support_rep_id
group by employee.first_name;

-- Which track was purchased the most in 2010?


-- Show the top three best selling artists.
SELECT ar.name, SUM(il.unit_price * il.quantity) AS total_sales
FROM invoice_line il
INNER JOIN track t ON t.track_id = il.track_id
INNER JOIN album a ON a.album_id = t.album_id
INNER JOIN artist ar ON ar.artist_id = a.artist_id
GROUP BY ar.name
ORDER BY total_sales DESC
LIMIT 3;

-- Which customers have the same initials as at least one other customer?


-- Which countries have the most invoices?


-- Which city has the customer with the highest sales total?


-- Who is the highest spending customer?


-- Return the email and full name of of all customers who listen to Rock.


-- Which artist has written the most Rock songs?


-- Which artist has generated the most revenue?




-- ADVANCED CHALLENGES
-- solve these with a mixture of joins, subqueries, CTE, and set operators.
-- solve at least one of them in two different ways, and see if the execution
-- plan for them is the same, or different.

-- 1. which artists did not make any albums at all?


-- 2. which artists did not record any tracks of the Latin genre?
WITH
    temp_data AS (
        SELECT DISTINCT
            album.artist_id
        FROM track
            JOIN genre ON track.genre_id = genre.genre_id
            JOIN album ON album.album_id = track.album_id
        WHERE
            genre.name != 'Latin'
    )
SELECT artist.*
FROM artist
    JOIN temp_data ON artist.artist_id = temp_data.artist_id;

-- 3. which video track has the longest length? (use media type table)
select track.name from track join media_type on track.media_type_id = media_type.media_type_id
where lower(media_type.name) like '%video%' and milliseconds in 
(select max(milliseconds) from track join media_type on track.media_type_id = media_type.media_type_id
where lower(media_type.name) like '%video%'); 



-- 4. boss employee (the one who reports to nobody)


-- 5. how many audio tracks were bought by German customers, and what was
--    the total price paid for them?

SELECT COUNT(*) as total_count, SUM(invoice_line.unit_price) FROM invoice
JOIN invoice_line on invoice_line.invoice_id = invoice.invoice_id
JOIN track on track.track_id = invoice_line.track_id
JOIN media_type on media_type.media_type_id = track.media_type_id
WHERE media_type.media_type_id != 3
AND invoice.billing_country = 'Germany';

-- 6. list the names and countries of the customers supported by an employee
--    who was hired younger than 35.

SELECT CONCAT(customer.first_name, ' ', customer.last_name) as name, customer.country from customer
INNER JOIN employee on employee.employee_id = customer.support_rep_id
WHERE (EXTRACT(YEAR FROM employee.hire_date) - EXTRACT(YEAR FROM employee.birth_date)) < 35;


-- DML exercises

-- 1. insert two new records into the employee table.

-- 2. insert two new records into the tracks table.

-- 3. update customer Aaron Mitchell's name to Robert Walter

-- 4. delete one of the employees you inserted.

-- 5. delete customer Robert Walter.
