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



USE [Chinook];
Go

SELECT * FROM actor;

-- BASIC CHALLENGES
-- List all customers (full name, customer id, and country) who are not in the USA
SELECT first_name, customer_id, country FROM customer WHERE NOT country = 'USA';

-- List all customers from Brazil
SELECT * FROM customer WHERE customer.country = 'Brazil';

-- List all sales agents
SELECT * FROM employee WHERE employee.title = 'Sales Support Agent';

SELECT * FROM employee WHERE employee.title LIKE '%Agent%';

-- Retrieve a list of all countries in billing addresses on invoices
SELECT billing_country FROM invoice;

-- Retrieve how many invoices there were in 2009, and what was the sales total for that year?
select count(*) as invoice_count, sum(total) as sales_total from invoice where extract(YEAR FROM invoice.invoice_date) = '2009';

-- (challenge: find the invoice count sales total for every year using one query)
select extract(year from invoice.invoice_date) as year, count(*) as Invoice_Count, sum(total) as sales_total from invoice GROUP BY extract(year from invoice.invoice_date);

-- how many line items were there for invoice #37
select invoice_id, count(*) as line_items_count from invoice_line where invoice_line.invoice_id = '37' group by invoice_id;

-- how many invoices per country? BillingCountry  # of invoices
select billing_country as country, count(*) as invoice_count from invoice GROUP BY billing_country;

-- Retrieve the total sales per country, ordered by the highest total sales first.
select billing_country as country, sum(total) as sales_total from invoice group by billing_country, total ORDER BY invoice.total desc;



/*
    JOINS
    - group tables together, show related data from different tables with each other
    - sometimes data in one table references another

    Types of join
    - Inner Join: think of venn diagram, this is the overlap
    - Left Join: left side + overlap
    - Right Join: right side + overlap
    - Outer Join: everything except the overlap
    - Cross Join
    - Self Join

    Writing a join

*/

-- JOINS CHALLENGES
-- Every Album by Artist
SELECT artist.name AS artist_name, album.title AS album_name FROM artist INNER JOIN album 
    ON artist.artist_id = album.artist_id GROUP BY artist.artist_id, album.title;

-- All songs of the rock genre
SELECT track.composer as artist, track.name as song FROM track INNER JOIN genre
    ON track.genre_id = genre.genre_id WHERE track.genre_id = '1' ORDER BY track.composer;

-- Show all invoices of customers from brazil (mailing address not billing)
SELECT customer.customer_id, customer.country, invoice.invoice_date, invoice.total as sales_total FROM invoice INNER JOIN customer
    ON invoice.customer_id = customer.customer_id WHERE customer.country = 'Brazil' ORDER BY invoice.invoice_date;

-- Show all invoices together with the name of the sales agent for each one
select concat(employee.first_name, ' ', employee.last_name) as agent_name, customer.customer_id, invoice.invoice_id, invoice.invoice_date, invoice.total
    from invoice inner join customer on invoice.customer_id = customer.customer_id
    inner join employee on customer.support_rep_id = employee.employee_id order by employee.employee_id, invoice.invoice_date;

-- Which sales agent made the most sales in 2009?
/* code to find value of most sales but not the name of the agent
select max(total_sales)
    from (select employee.employee_id, sum(invoice.total) as total_sales 
            from invoice inner join customer on invoice.customer_id = customer.customer_id 
            inner join employee on customer.support_rep_id = employee.employee_id 
            where extract(year from invoice.invoice_date) = '2009' 
            group by employee.employee_id
        );
*/
select employee.employee_id, concat(employee.first_name, ' ', employee.last_name) as agent_name, sum(invoice.total) as total_sales 
    from invoice inner join customer on invoice.customer_id = customer.customer_id 
    inner join employee on customer.support_rep_id = employee.employee_id
    where extract(year from invoice.invoice_date) = '2009' 
    group by employee.employee_id 
    order by total_sales limit 1;

-- How many customers are assigned to each sales agent?
select employee.employee_id, concat(employee.first_name, ' ', employee.last_name) as agent_name, count(customer.support_rep_id)
    from employee inner join customer on employee.employee_id = customer.support_rep_id group by employee.employee_id;

-- Which track was purchased the most in 2010?
select i.invoice_date, il.* from invoice as i join invoice_line as il on i.invoice_id = il.invoice_line_id;
/*select t.name, sum(l.quantity) as tracks_purchased, extract(year from i.invoice_date) as year_bought from track as t 
inner join invoice_line as l on t.track_id = l.track_id
inner join invoice as i on l.invoice_id = i.invoice_id group by t.name, year_bought;
*/

-- Show the top three best selling artists.
select ar.name, sum(il.unit_price * il.quantity) as total_sales
From invoice_line as ILIKEinner join track t on t.tr

-- Which customers have the same initials as at least one other customer?



-- ADVANCED CHALLENGES
-- solve these with a mixture of joins, subqueries, CTE, and set operators.
-- solve at least one of them in two different ways, and see if the execution
-- plan for them is the same, or different.

-- 1. which artists did not make any albums at all?


-- 2. which artists did not record any tracks of the Latin genre?
WITH
    temp_data as (
        select distinct
            album.artist_id
        from track
            join genre on track.genre_id = genre.genre_id
            join album on album.album_id = track.album_id
        where
            genre.name != 'Latin'
    )
select artist.*
from artist
    join temp_data on artist.artist_id = temp_data.artist_id;

-- 3. which video track has the longest length? (use media type table)
select t.name from track as t join media_type as md on t.media_type_id = md.media_type_id
    where lower(md.name) like '%video%' and milliseconds in
        (select max(milliseconds) from track as t join media_type as md on t.media_type_id = md.media_type_id
        where lower(md.name) like '%video%');

-- 4.  boss employee (the one who reports to nobody)


-- 5. how many audio tracks were bought by German customers, and what was
--    the total price paid for them?
select count(*) as total_count, sum(invoice_line.unit_price) from invoice
    join invoice_line on invoice_line.invoice_id = invoice.invoice_id
    join track on track.track_id = invoice_line.track_id
    join media_type as md on md.media_type_id = track.media_type_id
    where md.media_type_id != 3
    and invoice.billing_country = 'Germany';

-- 6. list the names and countries of the customers supported by an employee
--    who was hired younger than 35.



-- DML exercises

-- 1. insert two new records into the employee table.


-- 2. insert two new records into the tracks table.


-- 3. update customer Aaron Mitchell's name to Robert Walter


-- 4. delete one of the employees you inserted.


-- 5. delete customer Robert Walter.

