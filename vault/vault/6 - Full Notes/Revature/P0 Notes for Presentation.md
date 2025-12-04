
2025-11-21 11:08

Tags:

# P0 Notes for Presentation

## Goal of project
- create a letterboxd-esque project

## Functionality
### Layers
- model layer
	- all the object classes, represents the actual database entities
	- they're just containers with getters setters
- repo layer
	- direct db interaction using JDBC
	- basic CRUD ops
	- some SQL querying for user interaction later on
	- handles the SQLExceptions
- service layer
	- uses repos to perform operations
	- handles the api calls (the big one)
	- returns data to UI
- UI
	- all menus and the 2 ASCII arts that i have
	- gets user input
	- calls service (NO DIRECT DB OR REPO ACCESS)
- other files i have alongside these
	- SQLInit - initialize the actual schema of the database, create tables and constraints and foreign keys
	- DatabaseConnection

## WHAT I REUSED FROM LECTURES
### Layer interaction
### M:M Relationships and 3NF
- the main m:m relationship is the users and movies relationship through reviews and watchlist
```
-- Users table 
user_id | username 
1 | pranav 
2 | alvey 
3 | manu 
-- Movies table 
movie_id | tmdb_id | title 
5 | 27205 | la la land 
7 | 603 | sleeping beauty
9 | 155 | the smurfs with neil patrick harris
-- Reviews table (THE LINKS!) 
review_id | user_id | movie_id | rating | review_text 
1 | 1 | 5 | 4.5 | "yea i liked it" 
2 | 1 | 7 | 4.0 | "yea i liked it" 
3 | 1 | 9 | 2.5 | "yea i liked it" 
4 | 2 | 5 | 1.0 | "yea i liked it" 
5 | 3 | 5 | 5.0 | "yea i liked it"
```

## WHAT I LEARNED FOR THIS PROJECT
### Connection pooling
- when the app starts, we create 5 connections up front and store them in an arraylist. 
- after the user registers or logins, we borrow a connection from that pool and since the connections are already initialized, the connection is fast (if it fails too we just return the connection back to the pool we don't destroy it)
- everything else about the connection is the same as the postgres example for expense tracker, however with this project it just allows for me to have faster connections and less memory usage with concurrent users
### TMDb API
- looked up a free movie api and this is the most widely used since letterboxd's api is private (used it to get titles, release dates, overviews, crew (specifically director))
- user searches through the UI
- service layer builds the api request uri and makes the http get request
	- parses the json file it gets and returns it as a movie object back to the ui
- we build the endpoint url (magic link that can access the servers data) and we use the api key and my URLEncoder string (which would just be the movie i want)

- to actually make the request we use a HTTP connection 
	- the GET method sets the link to receive the json information (alongside the set properties)
	- .getInputStream is the method that reads in the data (the json string) that we return
`GET https://api.themoviedb.org/3/search/movie?api_key=xxx&query=inception`




# References