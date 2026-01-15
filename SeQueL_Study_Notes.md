# SeQueL — Interview Study Notes

## Project Overview
SeQueL is a console-based movie review and watchlist management system built with Java and PostgreSQL. It integrates with The Movie Database (TMDb) API to search for movies, allows users to write reviews with ratings, and maintains personal watchlists.

**Tech Stack:**
- **Java 25** with JDBC for database operations
- **PostgreSQL** for data persistence
- **TMDb API** for movie search and metadata
- **JUnit 5 + Mockito** for unit testing
- **Console UI** with ASCII art and menu-driven interface

**Architecture Pattern:** Layered architecture with UI → Service → Repository → Database

---

# PART 1: UI FLOW (Console Application)

## Application Lifecycle

### Main Entry Point

```10:26:P0VoK/SeQueL/src/main/java/org/example/Main.java
    public static void main(String[] args) {
        System.out.println("starting SeQueL...");

        try {
            initDB();

            UI ui = new UI();
            ui.start();

            shutdown();
        } catch (Exception e) {
            System.err.println("fatal error... " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }

    }
```

**Flow:**
1. **Database initialization** - Singleton connection pool + schema setup
2. **UI launch** - Console menu system starts
3. **Graceful shutdown** - Connection pool cleanup

**Key Interview Points:**
- **Singleton pattern** for database connection
- **Resource management** with try-catch and explicit shutdown
- **Schema initialization** on startup (idempotent SQL)

---

## Authentication Flow (Simple Username-Based)

```56:114:P0VoK/SeQueL/src/main/java/org/example/UI.java
    private void loginScreen() throws SQLException {
        System.out.println("1. login");
        System.out.println("2. register");
        System.out.println("3. quit");

        String input = scanner.nextLine().trim();

        switch (input) {
            case "1":
                loginReal();
                break;
            case "2":
                registerReal();
                break;
            case "3":
                exit();
                break;
            default:
                System.out.println("invalid input. try again.");

        }
    }

    private void registerReal() {
        clearScreen();

        System.out.print("enter your username: ");
        String username = scanner.nextLine();

        try {
            user newUser = userService.register(username);
            System.out.println("welcome " + username + "!");
            currentUser = newUser;
            pause();

        } catch (SQLException e) {
            System.out.println("registration error: " + e.getMessage());
            pause();
        }
    }

    private void loginReal() throws SQLException {
        clearScreen();

        System.out.print("enter your name: ");
        String username = scanner.nextLine().trim();

        Optional<user> uOpt = userService.login(username); // check this in userService

        if (uOpt.isPresent()) {
            currentUser = uOpt.get();
            System.out.println("login successful!");
            pause();
        }
        else {
            System.out.println("login failed! ");
            pause();
        }
    }
```

**How It Works:**
- **No password system** - Simple username lookup (could discuss security improvements)
- **Registration** validates username (3-50 chars, alphanumeric + underscore)
- **Session management** via `currentUser` object in UI class
- **Graceful error handling** with user-friendly messages

**Key Interview Points:**
- **Security limitation:** No authentication, anyone can login as any user
- **Validation in service layer:** Username format rules enforced before database
- **Optional pattern:** Clean handling of not-found cases
- **UX consideration:** Clear screen and pause for better console experience

---

## Main Menu Structure

```219:257:P0VoK/SeQueL/src/main/java/org/example/UI.java
    private void mainMenu() {
        clearScreen();
        System.out.println(ANSI_BLUE + "              menu   " + ANSI_RESET);
        System.out.println("1.  Search Movies (TMDb)");
        System.out.println("2.  View My Reviews");
        System.out.println("3.  View My Watchlist");
        System.out.println("4.  Recent Reviews (Social Feed)");
        System.out.println("5.  My Profile & Stats");
        System.out.println("6.  Logout");
        System.out.println("7.  Exit");

        String input = scanner.nextLine();

        switch (input) {
            case "1":
                searchMovies();
                break;
            case "2":
                viewReviews();
                break;
            case "3":
                viewWatchlist();
                break;
            case "4":
                recentReviews();
                break;
            case "5":
                profile();
                break;
            case "6":
                logout();
                break;
            case "7":
                exit();
                break;
            default:
                System.out.println("invalid input. try again.");
        }
    }
```

**Features:**
- Menu-driven navigation with numbered options
- ANSI color codes for visual enhancement
- Clear separation of personal data vs social features
- Session persistence until explicit logout

**Key Interview Points:**
- **Console UX patterns:** Clear screen, colors, pause for input
- **Feature organization:** Personal (reviews, watchlist, profile) vs Social (recent reviews)
- **State management:** `currentUser` determines available actions

---

## Core Feature: Movie Search & Details

### Search Flow

```259:309:P0VoK/SeQueL/src/main/java/org/example/UI.java
    private void searchMovies() {
        clearScreen();
        System.out.print("enter movie name: ");
        String movieName = scanner.nextLine();

        if (movieName.isEmpty()) {
            System.out.println("movie name is empty");
            return;
        }

        System.out.println("\n     '-.");
        System.out.println("        '-. _____ ");
        System.out.println(" .-._      |     '. ");
        System.out.println(":  ..      |      :  ");
        System.out.println("'-._+      |    .-'");
        System.out.println(" /  |     .'i--i");
        System.out.println("/   | .-'_/____ |___");
        System.out.println("    .-'  :          :");

        System.out.println("\nkennethGPT searching TMDb . . .\n");

        try {
            List<TMDb> results =  tmDbService.searchMovies(movieName);

            if (results.isEmpty()) {
                System.out.println("movie not found");
                pause();
                return;
            }

            System.out.println("search results");
            for (int i = 0; i < results.size(); i++) {
                TMDb result = results.get(i);
                System.out.printf("%d. %s (%s)\n", i + 1, result.getTitle(), result.getYear());
            }

            System.out.println("\n0. main menu");

            int selection = getIntInput(0, results.size());
            if (selection == 0) {
                return;
            }

            TMDb selected = results.get(selection - 1);
            showDetails(selected);

        } catch (Exception e) {
            System.out.println("search failed: " + e.getMessage());
            pause();
        }
    }
```

**Flow:**
1. User enters movie name
2. Call TMDb API search endpoint
3. Display numbered list of results
4. User selects movie to view details
5. Navigate to details screen

### Movie Details & Actions

```311:360:P0VoK/SeQueL/src/main/java/org/example/UI.java
    private void showDetails(TMDb tID) {
        clearScreen();

        try {
            movie m = tmDbService.getDetails(tID.getTmdbID());

            System.out.println("title: " + m.getName());
            System.out.println("release date: " + m.getReleaseDate());
            System.out.println("runtime: " + m.getRuntime() + " min");
            System.out.println("\noverview: ");
            System.out.println(m.getOverview());

            Optional<movie> cached = movieService.getMovieID(m.getMovieID());
            if (cached.isPresent()) {
                movie tempMovie = cached.get();
                System.out.println("movie is in your db!");

                // STOPPED HERE ADD SHOWING STATS
                stats s = reviewService.getMovieStats(tempMovie.getMovieID());
                System.out.printf("avg rating: %s (%d reviews)\n", s.getAvg(), s.getTotal());
            }

            System.out.println("1. log this movie");
            System.out.println("2. add to watchlist");
            System.out.println("3. view reviews");
            System.out.println("0. back");

            String input = scanner.nextLine();

            switch (input) {
                case "1":
                    logSpecific(m, tID.getGenreIDs());
                    break;
                case "2":
                    addFromSearch(m, tID.getGenreIDs());
                    break;
                case "3":
                    viewSpecificReviews(m, tID.getGenreIDs());
                    break;
                case "0":
                    return;
                default:
                    System.out.println("invalid input. try again.");
            }
            
        } catch (Exception e) {
            System.out.println("failed to load details: " + e.getMessage());
            pause();
        }
    }
```

**Key Features:**
- **TMDb integration:** Fetches full movie details (title, date, runtime, overview, director)
- **Database check:** Shows if movie already exists in local DB with stats
- **Aggregated stats:** Displays average rating and review count if movie exists
- **Three actions:** Log review, add to watchlist, view existing reviews

**Key Interview Points:**
- **Lazy caching:** Movies only saved to DB when user interacts (logs review or adds to watchlist)
- **Dual data sources:** TMDb for metadata, local DB for user-generated content
- **Stats calculation:** Real-time aggregation from reviews table

---

## Core Feature: Logging Reviews

```362:393:P0VoK/SeQueL/src/main/java/org/example/UI.java
    private void logSpecific(movie m, List<Integer> genreIDs) {
        try {
            movie cached = movieService.cache(m, genreIDs);

            if (reviewService.checkReviewed(currentUser.getUserID(), cached.getMovieID())) {
                System.out.println("you already reviewed this movie");
                pause();
                return;
            }

            clearScreen();
            System.out.print("enter your rating (0-5, half-stars allowed): ");
            double rating = getRatingInput();

            System.out.print("enter your review (press enter to skip): ");
            String review = scanner.nextLine();

            System.out.print("enter the date you watched the movie (YYYY-MM-DD, or ENTER to): ");
            String watchDate = scanner.nextLine();
            LocalDate date = watchDate.isEmpty() ? LocalDate.now() : LocalDate.parse(watchDate);

            review r = reviewService.create(currentUser.getUserID(), cached.getMovieID(), rating, review, date);

            System.out.println("movie logged successfully");
            System.out.println("rating: " + r.getFormattedRating());
            pause();

        } catch (Exception e) {
            System.out.println("failed to log movie: " + e.getMessage());
            pause();
        }
    }
```

**Flow:**
1. **Cache movie** - Saves movie to DB if not already present
2. **Duplicate check** - Prevents multiple reviews of same movie by same user
3. **Rating input** - Validates 0-5 scale with half-star increments
4. **Review text** - Optional, can skip
5. **Watch date** - Defaults to today if not provided

### Rating Validation (Critical Feature)

```193:217:P0VoK/SeQueL/src/main/java/org/example/UI.java
    private double getRatingInput() {
        while (true) {
            try {
                String input = scanner.nextLine().trim();
                double val = Double.parseDouble(input);
                
                // Check if rating is between 0 and 5
                if (val < 0 || val > 5) {
                    System.out.print("rating must be between 0 and 5. try again: ");
                    continue;
                }
                
                // Check if rating is a valid half-star increment
                double doubled = val * 2;
                if (Math.abs(doubled - Math.round(doubled)) > 0.001) {
                    System.out.print("rating must be in half-star increments (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5). try again: ");
                    continue;
                }
                
                return val;
            } catch (NumberFormatException e) {
                System.out.print("invalid. enter a number: ");
            }
        }
    }
```

**Key Interview Points:**
- **Input validation:** Multi-layer (UI validation + service validation + DB constraint)
- **UX consideration:** Immediate feedback with retry loop
- **Half-star precision:** `doubled * 2` trick to check for 0.5 increments
- **Database constraint:** Unique constraint on (userID, movieID) prevents duplicates

---

## Social Features

### Recent Reviews Feed

```525:549:P0VoK/SeQueL/src/main/java/org/example/UI.java
    private void recentReviews() {
        clearScreen();
        System.out.println("recent reviews");

        try {
            List<review> reviews = reviewService.getRecent(10);

            if (reviews.isEmpty()) {
                System.out.println("no reviews yet.. no ones using my app...");
                pause();
                return;
            }

            for (review r : reviews) {
                displayReview(r);
                System.out.println("- - - - - - - - - - - - -");
            }

            pause();
            
        } catch (Exception e) {
            System.out.println("failed to view recent reviews: " + e.getMessage());
            pause();
        }
    }
```

**Features:**
- Shows last 10 reviews from all users
- Ordered by watch date (most recent first)
- Acts as social feed to discover what others are watching
- Displays username, movie name, rating, review text

**Key Interview Points:**
- **SQL optimization:** Uses `ORDER BY watch_date DESC LIMIT 10` for performance
- **Join queries:** Fetches username and movie title in single query
- **Social aspect:** Transforms personal app into community platform

---

## Profile & Statistics

```551:568:P0VoK/SeQueL/src/main/java/org/example/UI.java
    private void profile() {
        clearScreen();
        System.out.println("your profile\n");

        try {
            user s = userService.getStats(currentUser.getUserID());

            System.out.println("username: " + ANSI_BLUE + s.getUsername() + ANSI_RESET);
            System.out.println("member since: " + s.getDate());
            System.out.println("total reviews: " + s.getReviewCount());
            System.out.println("total watchlist: " + watchlistService.getCount(currentUser.getUserID()));
            pause();
            
        } catch (Exception e) {
            System.out.println("failed to view profile: " + e.getMessage());
            pause();
        }
    }
```

**Displayed Stats:**
- Username (colored for emphasis)
- Account creation date
- Total reviews written
- Total movies in watchlist

**Key Interview Points:**
- **Aggregation queries:** Count operations on reviews and watchlist tables
- **User engagement metrics:** Stats show app usage and activity level

---

# PART 2: SERVICE LAYER

## 1. User Service (Authentication & Stats)

```20:68:P0VoK/SeQueL/src/main/java/org/example/service/userService.java
    public user register(String username) throws SQLException{
        validateName(username);

        if (userRepo.usernameExists(username)) {
            throw new IllegalArgumentException("username already exists");
        }

        user u = new user(username);
        u.setDate(LocalDateTime.now());

        return userRepo.create(u);
    }

    public Optional<user> login(String username) throws SQLException {
        Optional<user> test = userRepo.readName(username);

        if (test.isEmpty()) {
            return Optional.empty();
        }

        user u = test.get();
        return Optional.of(u); // may add password? bc like anybody can access this..
    }

    public user getStats(int userID) throws SQLException {
        Optional<user> test = userRepo.readID(userID);
        if (test.isEmpty()) {
            throw new IllegalArgumentException("username not found");
        }

        user u = test.get();
        int count = reviewRepo.reviewCount(userID);
        u.setReviewCount(count);

        return u;
    }
    
    private void validateName(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("username cannot be empty");
        }
        if (username.length() < 3 || username.length() > 50) {
            throw new IllegalArgumentException("username must be in the bounds" + "\n(more than 3 characters, less than 50 characters)");
        }
        if (!username.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("username can only contain letters numbers and underscores");
        }
    }
```

**Responsibilities:**
1. **Registration** - Validates username format and uniqueness
2. **Login** - Simple username lookup (no password verification)
3. **Stats aggregation** - Combines user data with review count

**Validation Rules:**
- 3-50 characters
- Alphanumeric + underscore only
- Must be unique (database constraint + service check)

**Key Interview Points:**
- **Defense in depth:** Validates in service layer before database
- **Regex validation:** Pattern matching for allowed characters
- **Fail fast:** Throws exceptions immediately with clear messages
- **Repository coordination:** Uses both userRepo and reviewRepo for stats

---

## 2. Review Service (Core Business Logic)

```26:56:P0VoK/SeQueL/src/main/java/org/example/service/reviewService.java
    public review create(int userID, int movieID, double rating, String review, LocalDate watchDate) {
        try {
            validateRating(rating);

            // check for user
            Optional<user> uOpt = userRepo.readID(userID);
            if (uOpt.isEmpty()) {
                throw new IllegalArgumentException("user not real");
            }

            // check for movie
            Optional<movie> moOpt = movieRepo.readID(movieID);
            if (moOpt.isEmpty()) {
                throw new IllegalArgumentException("movie not real");
            }

            // check if already reviewed
            Optional<review> rOpt = reviewRepo.findUserMovie(userID, movieID); // Y
            if (rOpt.isPresent()) {
                throw new IllegalArgumentException("review already exists");
            }

            review r = new review(userID, movieID, rating, review, watchDate);
            r.setDate(LocalDate.from(LocalDateTime.now())); // MAKE THE DATE STUFF FOR THIS CONSISTENT

            return reviewRepo.create(r);

        } catch (SQLException e) {
            throw new RuntimeException("failed to create review: " + e.getMessage(), e);
        }
    }
```

**Validation Layers:**
1. **Rating validation** - 0-5 scale, half-star increments
2. **User existence** - Validates foreign key before insert
3. **Movie existence** - Validates foreign key before insert
4. **Duplicate prevention** - Checks unique constraint (userID, movieID)

### Rating Validation Logic

```137:148:P0VoK/SeQueL/src/main/java/org/example/service/reviewService.java
    private void validateRating(Double rating) {
        if (rating == null) {
            throw new IllegalArgumentException("rating cannot be null");
        }
        if (rating < 0 || rating > 5) {
            throw new IllegalArgumentException("rating must be between 0.0 and 5.0");
        }
        double doubled = rating * 2;
        if (Math.abs(doubled - Math.round(doubled)) > 0.001) {
            throw new IllegalArgumentException("rating must be in half-star increments (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)");
        }
    }
```

**Mathematical Approach:**
- Multiply rating by 2
- Round to nearest integer
- If difference > 0.001, not a half-star increment
- Example: 3.7 × 2 = 7.4, round(7.4) = 7, difference = 0.4 → invalid

### Movie Statistics Aggregation

```120:135:P0VoK/SeQueL/src/main/java/org/example/service/reviewService.java
    public stats getMovieStats(int movieID) {
        try {
            Optional<movie> moOpt = movieRepo.readID(movieID);
            if (moOpt.isEmpty()) {
                throw new IllegalArgumentException("movie not real");
            }

            Double avg = reviewRepo.avgRating(movieID);
            List<review> r = reviewRepo.findMovie(movieID);

            return new stats(moOpt.get(), avg != null ? avg : 0.0, r.size());

        } catch (SQLException e) {
            throw new RuntimeException("failed to get movie stats: " + e.getMessage(), e);
        }
    }
```

**Stats Class:**
```150:174:P0VoK/SeQueL/src/main/java/org/example/service/reviewService.java
    public static class stats {
        private movie m;
        private double avg;
        private int total;

        public stats(movie m, double avg, int total) {
            this.m = m;
            this.avg = avg;
            this.total = total;
        }

        public movie getMovie() {
            return m;
        }
        public double getAvg() {
            return avg;
        }
        public int getTotal() {
            return total;
        }

        public String getFormattedAvg() {
            return String.format("%.1f/5", avg);
        }
    }
```

**Key Interview Points:**
- **Referential integrity:** Validates all foreign keys before insert
- **Business rule enforcement:** One review per user per movie
- **SQL aggregation:** Uses `AVG()` function for rating calculation
- **Nested class pattern:** Stats as inner class keeps related data together
- **Null handling:** Defaults to 0.0 if no reviews exist

---

## 3. TMDb Service (External API Integration)

```42:61:P0VoK/SeQueL/src/main/java/org/example/service/TMDbService.java
    public List<TMDb> searchMovies(String q) {
        try {
            String encodedQ = URLEncoder.encode(q, StandardCharsets.UTF_8);
            String endpoint = String.format("%s/search/movie?api_key=%s&query=%s", URL, apiKey, encodedQ);

            String jsonResponse = makeApiReq(endpoint);
            JsonObject response = gson.fromJson(jsonResponse, JsonObject.class);
            JsonArray results = response.getAsJsonArray("results");

            List<TMDb> searchList = new ArrayList<>();
            for (JsonElement result : results) {
                JsonObject mJson = result.getAsJsonObject();
                searchList.add(parseSearch(mJson));
            }

            return searchList;
        }  catch (Exception e) {
            throw new RuntimeException("TMDb search failed: " + e.getMessage(), e);
        }
    }
```

**Search Flow:**
1. URL-encode query (handles spaces and special characters)
2. Build API endpoint with query parameter
3. Make HTTP GET request
4. Parse JSON response with Gson
5. Map each result to TMDb object
6. Return list of search results

### Movie Details Fetching

```63:80:P0VoK/SeQueL/src/main/java/org/example/service/TMDbService.java
    public movie getDetails(int ID) {
        try {
            String endpoint = String.format("%s/movie/%d?api_key=%s", URL, ID, apiKey);

            String jsonResponse = makeApiReq(endpoint);
            JsonObject response = gson.fromJson(jsonResponse, JsonObject.class);

            // Fetch director from credits endpoint
            String director = getDirector(ID);
            if (director == null || director.isEmpty()) {
                director = "Unknown";
            }

            return parseDetails(response, director);
        } catch (Exception e) {
            throw new RuntimeException("failed to get details from TMDb: " + e.getMessage(), e);
        }
    }
```

**Two-Step Process:**
1. Fetch movie details (title, overview, runtime, release date)
2. Fetch credits to find director from crew list

### Director Extraction

```82:101:P0VoK/SeQueL/src/main/java/org/example/service/TMDbService.java
    private String getDirector(int movieID) {
        try {
            String endpoint = String.format("%s/movie/%d/credits?api_key=%s", URL, movieID, apiKey);
            String jsonResponse = makeApiReq(endpoint);
            JsonObject response = gson.fromJson(jsonResponse, JsonObject.class);
            
            JsonArray crew = response.getAsJsonArray("crew");
            for (JsonElement element : crew) {
                JsonObject person = element.getAsJsonObject();
                String job = person.has("job") ? person.get("job").getAsString() : "";
                if ("Director".equals(job)) {
                    return person.get("name").getAsString();
                }
            }
            return null;
        } catch (Exception e) {
            // If credits fetch fails, return null and we'll use "Unknown"
            return null;
        }
    }
```

**Key Interview Points:**
- **Multiple API calls:** Search returns list, details require separate call per movie
- **Credits parsing:** Iterates through crew array to find director role
- **Error resilience:** Falls back to "Unknown" if credits fetch fails
- **URL encoding:** Handles special characters in search queries
- **JSON parsing:** Uses Gson for type-safe JSON handling

---

## 4. Database Connection Pool (Critical Infrastructure)

```7:34:P0VoK/SeQueL/src/main/java/org/example/repos/DatabaseConnection.java
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private String url = "jdbc:postgresql://localhost:5432/sequel";
    private String username = "postgres";
    private String pass = "testPass123";

    private List<Connection> connPool;
    private List<Connection> usedConns = new ArrayList<>();

    public DatabaseConnection() {
        connPool = new ArrayList<>(5);

        try {
            for (int i = 0; i < 5; i++) connPool.add(DriverManager.getConnection(url, username, pass));
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                instance = new DatabaseConnection();
            }
        }

        return instance;
    }
```

**Connection Pool Design:**
- **Initial pool size:** 5 connections created on startup
- **Singleton pattern:** One pool instance for entire application
- **Thread-safe initialization:** Double-checked locking with synchronized block
- **Two lists:** Available connections (connPool) + in-use connections (usedConns)

### Connection Acquisition

```36:48:P0VoK/SeQueL/src/main/java/org/example/repos/DatabaseConnection.java
    public synchronized Connection getConn() throws SQLException {
        if (connPool.isEmpty() && usedConns.size() < 10) {
            connPool.add(DriverManager.getConnection(url, username, pass));
        }

        Connection tempC = connPool.remove(connPool.size() - 1);

        if (!tempC.isValid(1)) {
            tempC = DriverManager.getConnection(url, username, pass);
        }
        usedConns.add(tempC);
        return tempC;
    }
```

**How It Works:**
1. **Check availability** - If pool empty and under limit (10), create new connection
2. **Remove from pool** - Take last connection from available list
3. **Validate connection** - Check if still valid with 1-second timeout
4. **Track usage** - Move to usedConns list
5. **Return connection** - Caller can now use it

### Connection Release

```50:55:P0VoK/SeQueL/src/main/java/org/example/repos/DatabaseConnection.java
    public synchronized void releaseConn(Connection c) {
        if (c != null) {
            usedConns.remove(c);
            connPool.add(c);
        }
    }
```

**Key Interview Points:**
- **Why connection pooling?** Creating new connections is expensive (TCP handshake, authentication)
- **Singleton pattern:** Ensures only one pool exists across application
- **Thread safety:** `synchronized` prevents race conditions in multi-threaded scenarios
- **Dynamic sizing:** Grows from 5 to 10 connections on demand
- **Connection validation:** Checks if connection is still alive before returning
- **Resource cleanup:** `finally` blocks in repos ensure connections always released

---

## 5. Repository Pattern (Data Access Layer)

### Review Repository Example

```34:58:P0VoK/SeQueL/src/main/java/org/example/repos/reviewRepo.java
    // create
    public review create(review re) throws SQLException {
        String sql = "INSERt INTO reviews (userID, movieID, rating, review, watch_date)" +
                "VALUES (?, ?, ?, ?, ?) RETURNING reviewID";

        Connection c = null;
        try {
            c = dbConn.getConn();
            PreparedStatement stmt = c.prepareStatement(sql);

            stmt.setInt(1, re.getUserID());
            stmt.setInt(2, re.getMovieID());
            stmt.setDouble(3, re.getRating());
            stmt.setString(4, re.getReviewTxt());
            stmt.setDate(5, Date.valueOf(re.getDate())); // i dont know may have to change

            ResultSet r = stmt.executeQuery();
            if (r.next()) {
                re.setReviewID(r.getInt("reviewID"));
            }

            return re;
        } finally {
            dbConn.releaseConn(c);
        }
    }
```

**Pattern:**
1. **Acquire connection** from pool
2. **Prepare statement** with parameterized SQL (prevents SQL injection)
3. **Set parameters** using type-safe setters
4. **Execute query** and process results
5. **Release connection** in finally block (guaranteed execution)

### Complex Query with Joins

```89:100:P0VoK/SeQueL/src/main/java/org/example/repos/reviewRepo.java
    public List<review> findUser(int userID) throws SQLException {
        String sql = """
                SELECT r.*, u.username, m.title as movie_title
                FROM reviews r
                INNER JOIN users u ON r.userID = u.userID
                INNER JOIN movies m ON r.movieID = m.movieID
                WHERE r.userID = ?
                ORDER BY r.watch_date DESC;
        """;

        return execQ(sql, userID);
    }
```

**SQL Features:**
- **Text blocks (""")** - Java 15+ feature for multi-line strings
- **Inner joins** - Fetches related data (username, movie title) in single query
- **Ordering** - Most recent reviews first
- **Parameterized query** - Prevents SQL injection

### Aggregation Query

```184:201:P0VoK/SeQueL/src/main/java/org/example/repos/reviewRepo.java
    public Double avgRating (int movieID) throws SQLException {
        String sql = "SELECT AVG(rating) as avg_rating FROM reviews WHERE movieID = ?;";

        Connection c = null;
        try {
            c = dbConn.getConn();
            PreparedStatement stmt = c.prepareStatement(sql);
            stmt.setInt(1, movieID);

            ResultSet r = stmt.executeQuery();
            if (r.next()) {
                return r.getDouble("avg_rating");
            }
            return null;
        }   finally {
            dbConn.releaseConn(c);
        }
    }
```

**Key Interview Points:**
- **Prepared statements:** Prevents SQL injection attacks
- **Connection pooling:** Reuses connections for performance
- **Resource cleanup:** Finally block ensures connections returned even on exception
- **Type safety:** Java types match database column types
- **N+1 query prevention:** Uses joins to fetch related data efficiently
- **Database-side aggregation:** `AVG()` calculated in PostgreSQL, not in Java

---

## Database Schema Design

### Core Tables

```6:24:P0VoK/testDB/SeQueL.sql
CREATE TABLE IF NOT EXISTS public.users (
                    userID SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
                    CONSTRAINT name_length CHECK (LENGTH(username) >= 3)
                )

CREATE TABLE IF NOT EXISTS movies (
                    movieID SERIAL PRIMARY KEY,
                    title VARCHAR(50) UNIQUE NOT NULL,
                    director VARCHAR(50) NOT NULL,
                    release_date DATE,
                    overview TEXT,
                    runtime INTEGER,
                    
                    CONSTRAINT tmdb_id CHECK (movieID > 0),
                    CONSTRAINT runtime_pos CHECK (runtime IS NOT NULL OR runtime > 0)
                    )
```

### Reviews (Junction Table for Many-to-Many)

```32:45:P0VoK/testDB/SeQueL.sql
CREATE TABLE IF NOT EXISTS reviews (
                    reviewID INTEGER PRIMARY KEY,
                    userID INTEGER NOT NULL,
                    movieID INTEGER NOT NULL,
                    rating DECIMAL(3,1) NOT NULL,
                    review TEXT,
                    watch_date DATE,
                    
                    FOREIGN KEY (userID) REFERENCES users(userID),
                    FOREIGN KEY (movieID) REFERENCES movies(movieID),
                    
                    CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5),
                    CONSTRAINT unique_relation UNIQUE (userID, movieID)
                )
```

**Key Design Decisions:**
- **SERIAL primary keys** - Auto-incrementing IDs
- **Foreign keys** - Enforce referential integrity
- **Unique constraint** - One review per user per movie
- **Check constraints** - Validate rating range and username length at DB level
- **Indexes** - On foreign keys for join performance

**Key Interview Points:**
- **Many-to-many relationship:** Users ↔ Reviews ↔ Movies
- **Composite unique constraint:** (userID, movieID) prevents duplicate reviews
- **Defense in depth:** Constraints at DB level + validation in service layer
- **Indexes on foreign keys:** Speeds up join queries significantly
- **TEXT vs VARCHAR:** Review text uses TEXT for unlimited length

---

# Top Interview Questions & Answers

## Architecture & Design

### Q: "Explain the architecture of your application."
**A:** It's a three-layer architecture: UI layer (console menus), Service layer (business logic and validation), and Repository layer (data access). The UI delegates all business logic to services, services validate and coordinate repositories, and repositories handle raw JDBC operations. I also have an external integration with TMDb API. This separation follows single responsibility principle - each layer has one clear purpose.

---

### Q: "Why use a connection pool instead of creating connections on demand?"
**A:** Creating database connections is expensive - it requires TCP handshake, authentication, and session setup. Connection pooling reuses existing connections, dramatically improving performance. My pool starts with 5 connections and can grow to 10. I use a singleton pattern to ensure one pool for the application and synchronized methods to handle concurrent access safely.

---

### Q: "How do you prevent SQL injection attacks?"
**A:** I use prepared statements with parameterized queries throughout all repositories. Instead of concatenating user input into SQL strings, I use placeholders (?) and set parameters with type-safe methods like `stmt.setInt()` and `stmt.setString()`. The JDBC driver properly escapes all input, making injection impossible.

---

### Q: "Walk me through how a movie review gets saved."
**A:** 
1. User enters rating and review text in UI
2. UI validates rating format (0-5, half-stars) with immediate feedback
3. UI calls `reviewService.create()` with userID, movieID, rating, text, date
4. Service validates rating again (defense in depth)
5. Service checks user exists, movie exists, and no duplicate review
6. Service passes data to `reviewRepo.create()`
7. Repository acquires connection from pool, prepares statement, executes INSERT
8. PostgreSQL enforces constraints (rating range, unique constraint)
9. Review ID is returned using `RETURNING reviewID` clause
10. Connection released back to pool

---

## Service Layer

### Q: "Why validate in both UI and service layer?"
**A:** Defense in depth. UI validation provides immediate feedback for better UX - users don't wait for a network round-trip to see an error. Service validation is the security boundary - I can't trust UI input since someone could bypass the console and call services directly. Database constraints are the last line of defense against corrupt data.

---

### Q: "Explain your rating validation logic."
**A:** Ratings must be 0-5 in half-star increments (0, 0.5, 1, 1.5, etc.). I multiply the rating by 2, round to nearest integer, and check if the difference is negligible (< 0.001). For example, 3.5 × 2 = 7, which rounds to 7 with 0 difference - valid. But 3.7 × 2 = 7.4, which has 0.4 difference after rounding - invalid. This catches any decimal value that isn't a half-star increment.

---

### Q: "How do you calculate movie statistics?"
**A:** I use a SQL aggregation query: `SELECT AVG(rating) FROM reviews WHERE movieID = ?`. PostgreSQL calculates the average on the database side, which is much faster than fetching all reviews and averaging in Java. I also count total reviews by getting the list size. The service layer combines the movie entity, average rating, and count into a stats object that the UI displays.

---

## External Integration

### Q: "How does TMDb API integration work?"
**A:** I use `HttpURLConnection` to make HTTP GET requests to TMDb endpoints. For search, I URL-encode the query and call `/search/movie`. For details, I make two calls: one for movie metadata (title, overview, runtime) and another for credits to extract the director's name from the crew list. I parse JSON responses with Gson and map them to my Java objects. If the API call fails, I throw a runtime exception with the error message.

---

### Q: "Why make two API calls for movie details?"
**A:** TMDb's design separates movie metadata from credits. The main movie endpoint doesn't include director information - that's only available in the credits endpoint. I need the director for my database schema, so I make both calls. I could cache this to avoid repeated calls, but since I only fetch details when a user selects a movie, the overhead is acceptable.

---

## Data Access & Performance

### Q: "How do you handle connection cleanup?"
**A:** Every repository method follows this pattern: acquire connection from pool in try block, use it for database operations, then release it in finally block. The finally block guarantees execution even if an exception occurs, preventing connection leaks. If I forget to release a connection, the pool would eventually exhaust and the application would hang.

---

### Q: "Explain your use of joins in queries."
**A:** When fetching reviews, I need to display the username and movie title, not just IDs. Instead of making separate queries for each review (N+1 problem), I use INNER JOINs to fetch everything in one query: `SELECT r.*, u.username, m.title FROM reviews r INNER JOIN users u ON r.userID = u.userID INNER JOIN movies m ON r.movieID = m.movieID`. This is much more efficient, especially with indexes on the foreign keys.

---

### Q: "What indexes did you create and why?"
**A:** I created indexes on all foreign key columns: `userID` and `movieID` in reviews, `userID` and `movieID` in watchlist. These dramatically speed up join queries. I also indexed `username` in users and `title` in movies for quick lookups. PostgreSQL automatically creates indexes on primary keys and unique constraints.

---

## Console UI & UX

### Q: "Why use a console application instead of a GUI?"
**A:** This project focuses on backend architecture - database design, service layer patterns, API integration, and connection pooling. A console UI keeps the frontend simple so I can focus on demonstrating these backend skills. It also makes the codebase more portable and easier to test without UI framework dependencies.

---

### Q: "How do you improve UX in a console application?"
**A:** I use several techniques: clear screen between menus for clean state, ANSI color codes to highlight important text (usernames in blue), ASCII art for visual interest, pause prompts so users can read messages before continuing, and input validation loops that provide immediate feedback and retry prompts instead of crashing.

---

## Testing & Quality

### Q: "How would you test this application?"
**A:** Unit tests with JUnit 5 and Mockito. I'd mock repositories to test service layer validation logic independently. For repositories, I'd use an in-memory H2 database or Testcontainers with PostgreSQL to test actual SQL. For integration tests, I'd test the full flow from UI input through services to database. I'd also test edge cases: empty inputs, SQL injection attempts, duplicate reviews, invalid ratings, and API failures.

---

### Q: "What improvements would you make?"
**A:**
1. **Security:** Add password authentication (currently anyone can login as anyone)
2. **Connection pooling:** Use a production library like HikariCP instead of custom implementation
3. **Caching:** Cache movie details from TMDb to reduce API calls
4. **Pagination:** Limit query results for large datasets
5. **Transaction management:** Wrap multi-step operations in database transactions
6. **Configuration:** Externalize database credentials and API keys
7. **Logging:** Add proper logging with SLF4J/Logback instead of System.out
8. **Error handling:** More granular exception types instead of generic RuntimeException

---

## Final Interview Tips

**When discussing SeQueL:**
1. **Emphasize architecture:** Three clear layers with distinct responsibilities
2. **Highlight database skills:** Connection pooling, prepared statements, joins, aggregations, indexes
3. **Show validation strategy:** Multi-layer validation (UI, service, database)
4. **Discuss performance:** Why pooling matters, why joins matter, why indexes matter
5. **Be honest about limitations:** No authentication, simple UI, hardcoded API key
6. **Suggest improvements:** Shows growth mindset and awareness of best practices

**Comparison to FeedbackFM:**
- SeQueL: Console app, JDBC, manual connection pooling, PostgreSQL
- FeedbackFM: Web app, JPA/Hibernate, Spring-managed connections, REST APIs
- Both: Layered architecture, service pattern, external API integration, validation

Good luck with your interview!
