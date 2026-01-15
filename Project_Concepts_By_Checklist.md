# Project Concepts by Checklist

This document maps each topic from `interview_checklist.md` to how it appears in the three current projects in this folder: `feedback.fm`, `DAWker`, and `SeQueL`. Each topic includes concrete, project‑specific examples and references to real code.

---

## Front End

### React (Hooks + routing + async API usage)
**`feedback.fm`** uses React Router for page routing and hook‑driven UI flow:

```1:63:C:\Users\14692\Desktop\Projects\P1-feedback.fm\frontend\src\App.tsx
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  return (
    <div className="App">
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/top-artists" element={<TopArtists />} />
        <Route path="/top-songs" element={<TopSongs />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/history" element={<ListeningHistory />} />
        <Route path="/currently-playing" element={<CurrentlyPlaying />} />
      </Routes>
    </div>
  );
}
```

**`DAWker`** routes a landing page, auth, and nested DAW/community pages through a shared layout:

```38:59:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\frontend\DragnDrop\src\App.jsx
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Loggin />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route element={<Layout />} >
            <Route path="/search" element={<Searchts />} />
            <Route path="/native-amp/:dawId?" element={<NativeAmpDemo />} />
            <Route path="/userpage" element={<UserPage />} />
            <Route path="/forums" element={<Forums/>} />
            <Route path="/forums/:postId" element={<ForumPage/>} />
            <Route path="/settings" element={<SettingsPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
```

**`SeQueL`** is a Java console application and does not use React.

---

### HTML5 (semantic structure, root mounting)
**`feedback.fm`** uses a standard HTML shell with a root mount for React:

```1:12:C:\Users\14692\Desktop\Projects\P1-feedback.fm\frontend\index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Feedback.fm</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**`DAWker`** also runs a Vite/React frontend with a similar `index.html` mount (not shown here).  
**`SeQueL`** does not use HTML.

---

### JavaScript (UI event logic)
**`DAWker`** uses JS/TSX for component behavior (routing, UI interactions, and state updates).  
The frontend is React‑based rather than direct DOM manipulation, so raw `document.getElementById` style code is not used.

---

### CSS (styling + layout)
**`DAWker`** uses Tailwind utilities alongside base CSS rules:

```1:71:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\frontend\DragnDrop\src\index.css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
}
@tailwind base;
@tailwind components;
@tailwind utilities;
button {
  border-radius: 8px;
  padding: 0.6em 1.2em;
  background-color: #1a1a1a;
}
button:hover {
  border-color: #22c55e;
}
```

**`feedback.fm`** relies on inline styles and Tailwind classes in the component tree (not shown here).  
**`SeQueL`** is CLI‑based and does not use CSS.

---

### TypeScript (component wiring + typed DTOs)
**`feedback.fm`** uses TSX for routing and typed components:

```1:63:C:\Users\14692\Desktop\Projects\P1-feedback.fm\frontend\src\App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// ...
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
```

**`DAWker`** uses TypeScript for typed API utilities and DTOs:

```4:104:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\frontend\DragnDrop\src\utils\dawAPI.ts
import { DawDTO, ConfigDTO } from '../dtos/types';
const API_BASE_URL = 'http://localhost:8080/api';
export const dawAPI = {
  getDawById: async (dawId: string): Promise<DawDTO> => {
    const response = await fetch(`${API_BASE_URL}/search/daw?dawId=${dawId}`);
    return await response.json();
  },
  saveDaw: async (daw: DawDTO): Promise<DawDTO> => {
    const response = await fetch(`${API_BASE_URL}/save/Daw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(daw),
    });
    return await response.json();
  },
}
```

**`SeQueL`** is pure Java and does not use TypeScript.

---

## Back End

### Java (service layer + DTO mapping)
**`feedback.fm`** maps entities to DTOs using stream pipelines:

```15:69:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\main\java\com\feedback\fm\feedbackfm\service\SongServiceImpl.java
@Service
@Transactional(readOnly = true)
public class SongServiceImpl implements SongService {
    public List<SongDTO> getAllSongs() {
        return repository.findAll().stream()
                .map(this::songToDto)
                .toList();
    }
    public List<SongDTO> searchByName(String namePart) {
        return repository.findByNameContainingIgnoreCase(namePart).stream()
                .map(this::songToDto)
                .toList();
    }
}
```

**`DAWker`** maps a hierarchical DAW graph (DAW → config → component → settings):

```86:120:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\service\DawService.java
    private dawDTO mapToDawDto(DawEntity daw) {
        List<configDTO> configs = daw.getListOfConfigs().stream()
                .map(config -> new configDTO(
                        config.getId(),
                        config.getName(),
                        daw.getId(),
                        config.getComponents().stream()
                                .map(this::mapToComponentDto)
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());
        return new dawDTO(daw.getId(), daw.getUser().getId(), daw.getName(), daw.getDescription(), daw.getCreatedAt(),
                daw.getExportCount(), configs);
    }
```

**`SeQueL`** uses a service/repo split but does not use DTO mapping; it works directly with models and SQL results.

---

### JUnit (tests + assertions)
**`feedback.fm`** tests service behavior with JUnit:

```9:59:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\test\java\com\feedback\fm\feedbackfm\service\SongServiceTest.java
@ExtendWith(MockitoExtension.class)
public class SongServiceTest {
    @BeforeEach
    public void setup() {
        // test data setup
    }
    @Test
    public void testGetAllSongs() {
        when(repository.findAll()).thenReturn(List.of(sampleSong));
        List<SongDTO> result = service.getAllSongs();
        assertEquals(1, result.size());
    }
}
```

**`DAWker`** uses JUnit for service tests:

```10:77:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\test\java\com\project\dawker\service\UseServiceTest.java
@ExtendWith(MockitoExtension.class)
class UseServiceTest {
    @BeforeEach
    void setUp() {
        // build test entities
    }
    @Test
    void getAllUsers_returnsMappedDTOs() {
        when(userRepository.findAll()).thenReturn(List.of(user));
        List<userDTO> result = userService.getAllUsers();
        assertEquals(1, result.size());
    }
}
```

**`SeQueL`** has JUnit tests in `src/test/java/org/example/tests/*`.

---

### Mockito (mocking + verification)
**`feedback.fm`** uses Mockito to isolate repository dependencies:

```11:33:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\test\java\com\feedback\fm\feedbackfm\service\SongServiceTest.java
@ExtendWith(MockitoExtension.class)
public class SongServiceTest {
    @Mock
    private SongRepository repository;
    @InjectMocks
    private SongServiceImpl service;
}
```

**`DAWker`** uses Mockito to mock repositories and loggers:

```12:35:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\test\java\com\project\dawker\service\UseServiceTest.java
@ExtendWith(MockitoExtension.class)
class UseServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private KafkaLogProducer logger;
    @InjectMocks
    private useService userService;
}
```

**`SeQueL`** uses Mockito in multiple tests under `src/test/java/org/example/tests`.

---

### Stream API (map/filter/toList)
**`feedback.fm`** uses Stream API to map repositories to DTOs:

```26:58:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\main\java\com\feedback\fm\feedbackfm\service\SongServiceImpl.java
public List<SongDTO> getAllSongs() {
    return repository.findAll().stream()
            .map(this::songToDto)
            .toList();
}
public List<SongDTO> searchByName(String namePart) {
    return repository.findByNameContainingIgnoreCase(namePart).stream()
            .map(this::songToDto)
            .toList();
}
```

**`DAWker`** uses streams for nested DTO mapping (configs → components):

```86:95:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\service\DawService.java
List<configDTO> configs = daw.getListOfConfigs().stream()
    .map(config -> new configDTO(
        config.getId(),
        config.getName(),
        daw.getId(),
        config.getComponents().stream()
            .map(this::mapToComponentDto)
            .collect(Collectors.toList())))
    .collect(Collectors.toList());
```

**`SeQueL`** does not use the Stream API (it relies on JDBC + manual loops).

---

### RESTful API development (controllers + HTTP verbs)
**`feedback.fm`** defines REST endpoints for Spotify auth and data access:

```18:46:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\main\java\com\feedback\fm\feedbackfm\controller\SpotifyAuthController.java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class SpotifyAuthController {
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> getAuthUrl() {
        String authUrl = authService.getAuthorizationUrl();
        Map<String, String> response = new HashMap<>();
        response.put("authUrl", authUrl);
        return ResponseEntity.ok(response);
    }
}
```

**`DAWker`** exposes CRUD and community endpoints under `/api`:

```75:205:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\controller\dawController.java
@RestController
@RequestMapping("/api")
public class dawController {
    @GetMapping("/search/daw")
    public dawDTO getDawById(@RequestParam String dawId) {
        return dawService.getDawById(dawId);
    }
    @PostMapping("/save/Daw")
    public ResponseEntity<?> saveDaw(@RequestBody dawDTO payload) {
        dawService.saveDaw(payload);
        return ResponseEntity.ok(payload);
    }
}
```

**`SeQueL`** is a console application and does not expose REST endpoints.

---

## Data Persistence

### SQL (queries + joins + ordering)
**`SeQueL`** uses SQL queries with joins and ordering for watchlists:

```37:45:C:\Users\14692\Desktop\Projects\P0VoK\SeQueL\src\main\java\org\example\repos\watchlistRepo.java
String sql = """
        SELECT w.*, m.title,
        EXTRACT(YEAR FROM m.release_date) as release_year
        FROM watchlist w
        JOIN movies m ON w.movieID = m.movieID
        WHERE w.userID = ?
        ORDER BY w.watchDate DESC
        """;
```

**`feedback.fm`** and **`DAWker`** rely on JPA/Hibernate instead of raw SQL.

---

### MongoDB (document database)
Not used in these three projects.

---

### Hibernate / JPA entities
**`feedback.fm`** models data with JPA annotations:

```13:43:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\main\java\com\feedback\fm\feedbackfm\model\Listener.java
@Entity
@Table(name = "listener")
public class Listener {
    @Id
    @Column(name = "listener_id", length = 64)
    private String listenerId;
    @OneToMany(mappedBy = "listener", cascade = CascadeType.ALL)
    private Set<History> history = new HashSet<>();
}
```

**`DAWker`** uses JPA entities with relationships:

```36:58:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\entity\daw_specific\DawEntity.java
@Entity
public class DawEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @OneToMany(mappedBy = "daw", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConfigEntity> listOfConfigs = new ArrayList<>();
}
```

**`SeQueL`** uses plain SQL and does not use JPA/Hibernate.

---

### JSON & data serialization
**`SeQueL`** parses TMDb API responses with Gson:

```12:57:C:\Users\14692\Desktop\Projects\P0VoK\SeQueL\src\main\java\org\example\service\TMDbService.java
public List<TMDb> searchMovies(String q) {
    String jsonResponse = makeApiReq(endpoint);
    JsonObject response = gson.fromJson(jsonResponse, JsonObject.class);
    JsonArray results = response.getAsJsonArray("results");
    List<TMDb> searchList = new ArrayList<>();
    for (JsonElement result : results) {
        JsonObject mJson = result.getAsJsonObject();
        searchList.add(parseSearch(mJson));
    }
    return searchList;
}
```

**`feedback.fm`** and **`DAWker`** serialize JSON over REST (DTOs sent between frontend and backend).

---

### Spring Data JPA (repositories)
**`feedback.fm`** repositories extend `JpaRepository`:

```1:8:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\main\java\com\feedback\fm\feedbackfm\repository\ListenerRepository.java
public interface ListenerRepository extends JpaRepository<Listener, String> {
    List<Listener> findByDisplayName(String displayName);
}
```

**`DAWker`** also uses Spring Data JPA:

```13:33:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\repository\DawRepository.java
public interface DawRepository extends JpaRepository<DawEntity, String> {
    Optional<List<DawEntity>> findByUserId(Long userId);
}
```

**`SeQueL`** uses JDBC instead of JPA.

---

### Database design & normalization
**`SeQueL`** defines normalized tables and foreign keys via SQL initialization:

```23:74:C:\Users\14692\Desktop\Projects\P0VoK\SeQueL\src\main\java\org\example\repos\SQLInit.java
CREATE TABLE IF NOT EXISTS reviews (
    reviewID SERIAL PRIMARY KEY,
    userID INTEGER NOT NULL,
    movieID INTEGER NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    review TEXT,
    watch_date DATE,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (movieID) REFERENCES movies(movieID),
    CONSTRAINT unique_relation UNIQUE (userID, movieID)
)
```

**`DAWker`** models normalized relationships using entities (User → DAW → Config → Component).  
**`feedback.fm`** models user history and playlist relationships via JPA.

---

## Package Management / DevOps

### Maven (dependencies + scopes)
**`SeQueL`** defines dependencies for PostgreSQL, Gson, JUnit, and Mockito:

```16:50:C:\Users\14692\Desktop\Projects\P0VoK\SeQueL\pom.xml
<dependencies>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.6.0</version>
    </dependency>
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>5.10.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

**`feedback.fm`** and **`DAWker`** also use Maven (Spring Boot `pom.xml` in each backend).

---

### Spring Boot (application bootstrap)
**`feedback.fm`** bootstraps with `@SpringBootApplication`:

```9:13:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\main\java\com\feedback\fm\feedbackfm\FeedbackFmApplication.java
@SpringBootApplication
public class FeedbackFmApplication {
    public static void main(String[] args) {
        SpringApplication.run(FeedbackFmApplication.class, args);
    }
}
```

**`DAWker`** uses the same Spring Boot bootstrap pattern:

```7:12:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\DawkerApplication.java
@SpringBootApplication()
public class DawkerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DawkerApplication.class, args);
    }
}
```

**`SeQueL`** is not a Spring Boot project.

---

### Docker (compose services + ports)
**`feedback.fm`** uses Docker Compose for PostgreSQL + pgAdmin:

```1:27:C:\Users\14692\Desktop\Projects\P1-feedback.fm\database\docker-compose.yml
services:
  db:
    image: postgres:16
    container_name: spotify_db
    environment:
      POSTGRES_DB: spotifydb
      POSTGRES_USER: spotify_user
      POSTGRES_PASSWORD: spotify_pass
    ports:
      - "5432:5432"
  pgadmin:
    image: dpage/pgadmin4
    ports:
      - "5050:80"
```

**`DAWker`** also uses Docker Compose for multi‑service orchestration (`docker-compose.yml` at project root).  
**`SeQueL`** does not include Docker config.

---

### Jenkins (pipelines + build steps)
**`DAWker`** includes a Jenkins pipeline that builds and runs services:

```1:21:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\Jenkinsfile
pipeline {
    agent any
    environment { DOCKER_COMPOSE_FILE = 'docker-compose.yml' }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Build Docker Images') {
            steps {
                script {
                    isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE build')
                             : bat('docker-compose -f %DOCKER_COMPOSE_FILE% build')
                }
            }
        }
    }
}
```

**`feedback.fm`** and **`SeQueL`** do not include Jenkins pipelines.

---

### Kubernetes
Not used in these three projects.

---

## Theoretical Knowledge

### OOP Principles (abstraction, inheritance, encapsulation)
All three projects are built in Java and inherently apply OOP through class design and encapsulation.  
There is no explicit OOP “demo” class in these codebases; OOP is implicit through models, services, and repositories.

---

### Sorting & searching algorithms
**`SeQueL`** uses SQL `ORDER BY` for sorting user watchlists:

```37:45:C:\Users\14692\Desktop\Projects\P0VoK\SeQueL\src\main\java\org\example\repos\watchlistRepo.java
ORDER BY w.watchDate DESC
```

**`DAWker`** and **`feedback.fm`** rely on repository queries rather than custom sorting algorithms.

---

### Relational database concepts (joins + foreign keys)
**`SeQueL`** explicitly uses joins and foreign keys in SQL:

```37:45:C:\Users\14692\Desktop\Projects\P0VoK\SeQueL\src\main\java\org\example\repos\watchlistRepo.java
FROM watchlist w
JOIN movies m ON w.movieID = m.movieID
WHERE w.userID = ?
```

**`feedback.fm`** and **`DAWker`** use JPA relationships (`@OneToMany`, `@ManyToOne`) to model relational links.

---

### Wireframing / UI design
No explicit wireframing files were found in these three projects.

---

## Topics not used in any of the three projects

- MongoDB  
- Kubernetes  
- Direct DOM manipulation with vanilla JavaScript  
- Formal wireframing artifacts (no wireframe files in these projects)

---

## DAWker Stream API (deep dive)

**Where it’s used:**  
The Stream API in DAWker is primarily used in `DawService` to map nested entities (DAW → configs → components → settings) into DTOs returned to the frontend.

**File:** `p2-KDBO-DAWker/backend/dawker/dawker/src/main/java/com/project/dawker/service/DawService.java`

```86:118:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\service\DawService.java
    private dawDTO mapToDawDto(DawEntity daw) {
        List<configDTO> configs = daw.getListOfConfigs().stream()
                .map(config -> new configDTO(
                        config.getId(),
                        config.getName(),
                        daw.getId(),
                        config.getComponents().stream()
                                .map(this::mapToComponentDto)
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());

        return new dawDTO(daw.getId(), daw.getUser().getId(), daw.getName(), daw.getDescription(), daw.getCreatedAt(),
                daw.getExportCount(), configs);
    }
```

**Line‑by‑line explanation and interactions:**
- `daw.getListOfConfigs().stream()`  
  Converts the DAW’s list of `ConfigEntity` objects into a stream so each config can be transformed.  
  **Interacts with:** `DawEntity` and its `listOfConfigs` relationship.
- `.map(config -> new configDTO(...))`  
  Creates a `configDTO` from each config entity. This is the DTO shape returned to the frontend.  
  **Interacts with:** `configDTO` (DTO class) and config entity properties.
- `config.getComponents().stream()`  
  Streams each component in the config’s signal chain.  
  **Interacts with:** `ConfigEntity` and its `components` relation.
- `.map(this::mapToComponentDto)`  
  Uses a helper mapper to convert each `ComponentEntity` into `componentDTO`, including settings.  
  **Interacts with:** `mapToComponentDto` and `SettingsEntity`.
- `.collect(Collectors.toList())` (inner)  
  Materializes the component stream into a list for the config DTO.
- `.collect(Collectors.toList())` (outer)  
  Materializes the config stream into a list for the DAW DTO.

**How Stream API works in this program:**  
Streams allow DAWker to transform nested entity graphs into DTOs without explicit loops. The key value is readability and consistent mapping: each level (DAW → config → component → settings) is converted in a predictable pipeline and returned to the frontend in a JSON‑friendly format. This is critical because the frontend uses these DTOs directly for UI state and audio preset reconstruction.

---

## RESTful API Development (DAWker + feedback.fm)

**What a RESTful API is:**  
A REST API exposes resources (like `users`, `daws`, `ratings`, `listeners`, `songs`) through HTTP endpoints using standard verbs (`GET`, `POST`, `PUT`, `DELETE`). It’s stateless: each request contains what the server needs to process it, and responses are typically JSON.

### DAWker REST usage
DAWker organizes endpoints in `dawController` under `/api`. The frontend calls these via `fetch` in `dawAPI.ts` and `userAPI.ts`.

**Controller layer:**  
`p2-KDBO-DAWker/backend/dawker/dawker/src/main/java/com/project/dawker/controller/dawController.java`

```75:205:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\controller\dawController.java
@RestController
@RequestMapping("/api")
public class dawController {
    @GetMapping("/search/daw")
    public dawDTO getDawById(@RequestParam String dawId) {
        return dawService.getDawById(dawId);
    }

    @PostMapping("/save/Daw")
    public ResponseEntity<?> saveDaw(@RequestBody dawDTO payload) {
        dawService.saveDaw(payload);
        return ResponseEntity.ok(payload);
    }
}
```

**Client layer:**  
`p2-KDBO-DAWker/frontend/DragnDrop/src/utils/dawAPI.ts`

```13:90:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\frontend\DragnDrop\src\utils\dawAPI.ts
getDawById: async (dawId: string): Promise<DawDTO> => {
  const response = await fetch(`${API_BASE_URL}/search/daw?dawId=${dawId}`);
  return await response.json();
},
saveDaw: async (daw: DawDTO): Promise<DawDTO> => {
  const response = await fetch(`${API_BASE_URL}/save/Daw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(daw),
  });
  return await response.json();
},
```

**Why this is RESTful:**  
The DAW state is a resource. `GET /search/daw` retrieves it, `POST /save/Daw` creates or updates it. The server is stateless; each request contains the DAW ID or payload needed to process the request.

### feedback.fm REST usage
feedback.fm uses multiple REST controllers and integrates Spotify’s OAuth flow and data endpoints.

**Controller layer:**  
`P1-feedback.fm/backend/src/main/java/com/feedback/fm/feedbackfm/controller/SpotifyAuthController.java`

```18:46:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\main\java\com\feedback\fm\feedbackfm\controller\SpotifyAuthController.java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class SpotifyAuthController {
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> getAuthUrl() {
        String authUrl = authService.getAuthorizationUrl();
        Map<String, String> response = new HashMap<>();
        response.put("authUrl", authUrl);
        return ResponseEntity.ok(response);
    }
}
```

**Why this is RESTful:**  
The controller exposes resources (`/api/auth`, `/api/users`, `/api/songs`) using standard HTTP verbs. The frontend calls these endpoints using Axios and receives JSON responses it renders in the UI. The server does not keep UI state between calls; it just processes each request and returns data.

---

## Hibernate + JPA Entities (full explanation)

**What Hibernate is:**  
Hibernate is an ORM (Object‑Relational Mapper) that lets Java classes map directly to database tables. Instead of writing raw SQL, you annotate Java classes with JPA annotations (`@Entity`, `@Id`, `@OneToMany`) and Hibernate translates object operations into SQL queries.

**What JPA Entities are:**  
JPA entities are the annotated Java classes that represent rows in your database. Hibernate uses these to build the schema, manage relationships, and perform CRUD.

### feedback.fm usage
feedback.fm models Spotify listeners and their history as JPA entities.

```13:43:C:\Users\14692\Desktop\Projects\P1-feedback.fm\backend\src\main\java\com\feedback\fm\feedbackfm\model\Listener.java
@Entity
@Table(name = "listener")
public class Listener {
    @Id
    @Column(name = "listener_id", length = 64)
    private String listenerId;
    @OneToMany(mappedBy = "listener", cascade = CascadeType.ALL)
    private Set<History> history = new HashSet<>();
}
```

**How it’s used:**  
When `SpotifyAuthController` upserts a listener, Hibernate persists the `Listener` entity and keeps relationships to `History` records. Controllers call services, services call repositories, and Hibernate handles the SQL.

### DAWker usage
DAWker models DAW projects and their nested configs/components.

```36:58:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\entity\daw_specific\DawEntity.java
@Entity
public class DawEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @OneToMany(mappedBy = "daw", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConfigEntity> listOfConfigs = new ArrayList<>();
}
```

**How it’s used:**  
Saving a DAW DTO triggers `DawService.saveDaw`, which maps DTOs to entities and calls `dawRepository.save`. Hibernate cascades the save across configs and components, preserving the full signal chain structure.

### SeQueL usage
SeQueL does **not** use Hibernate. It uses JDBC directly via `DatabaseConnection` and `SQLInit`, so SQL is written manually.

---

## Gson vs JSON over REST (SeQueL vs feedback.fm/DAWker)

### SeQueL: Gson for external API parsing
SeQueL uses Gson to parse the TMDb API response into Java objects.

```12:57:C:\Users\14692\Desktop\Projects\P0VoK\SeQueL\src\main\java\org\example\service\TMDbService.java
public List<TMDb> searchMovies(String q) {
    String jsonResponse = makeApiReq(endpoint);
    JsonObject response = gson.fromJson(jsonResponse, JsonObject.class);
    JsonArray results = response.getAsJsonArray("results");
    List<TMDb> searchList = new ArrayList<>();
    for (JsonElement result : results) {
        JsonObject mJson = result.getAsJsonObject();
        searchList.add(parseSearch(mJson));
    }
    return searchList;
}
```

**How it works:**  
SeQueL makes an HTTP request to TMDb, gets raw JSON, and manually parses it with Gson into Java objects. This is local JSON parsing, not a REST server.

### feedback.fm / DAWker: JSON over REST
These apps serialize DTOs into JSON responses and send them over HTTP. Spring Boot handles the serialization automatically (Jackson under the hood).

**Example flow (DAWker):**
1. `NativeAmpDemo` builds a `DawDTO` (JavaScript object).
2. `dawAPI.saveDaw` JSON‑serializes it with `JSON.stringify`.
3. The backend receives JSON in `@RequestBody dawDTO`.
4. Spring Boot serializes the returned DTO back to JSON in the HTTP response.

This is different from Gson usage:  
- **Gson (SeQueL):** manual JSON parsing of external API responses.  
- **REST (feedback.fm/DAWker):** automated JSON serialization/deserialization for client ↔ server communication.

---

## Docker Compose + Jenkins (what + why + how)

### Docker Compose
**What it is:**  
Docker Compose defines multiple services (DB, backend, frontend) in one file and lets you run them together consistently.

**feedback.fm usage:**  
`P1-feedback.fm/database/docker-compose.yml` spins up PostgreSQL and pgAdmin for local dev.

```1:27:C:\Users\14692\Desktop\Projects\P1-feedback.fm\database\docker-compose.yml
services:
  db:
    image: postgres:16
    container_name: spotify_db
    environment:
      POSTGRES_DB: spotifydb
      POSTGRES_USER: spotify_user
      POSTGRES_PASSWORD: spotify_pass
    ports:
      - "5432:5432"
  pgadmin:
    image: dpage/pgadmin4
    ports:
      - "5050:80"
```

**DAWker usage:**  
`p2-KDBO-DAWker/docker-compose.yml` orchestrates PostgreSQL, Kafka, backend, and frontend to run the full stack together.

### Jenkins
**What it is:**  
Jenkins automates CI/CD pipelines: it pulls the repo, builds images, and starts services in a repeatable way.

**DAWker usage:**  
`p2-KDBO-DAWker/Jenkinsfile` builds and starts containers in stages.

```1:21:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\Jenkinsfile
pipeline {
    agent any
    environment { DOCKER_COMPOSE_FILE = 'docker-compose.yml' }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Build Docker Images') {
            steps {
                script {
                    isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE build')
                             : bat('docker-compose -f %DOCKER_COMPOSE_FILE% build')
                }
            }
        }
    }
}
```


---

## Jenkins (deeper dive: why it matters + how DAWker uses it)

### What Jenkins is and why it's important

Jenkins is a **CI/CD automation server** that orchestrates the entire build-test-deploy pipeline. In production teams, developers push code to Git dozens of times per day. Without Jenkins:
- Each developer would manually build Docker images, start services in the correct order, wait for health checks, and verify everything works.
- Bugs from misconfiguration or missing dependencies would only surface in production.
- Onboarding new developers would require extensive setup documentation.

**Jenkins solves this** by codifying the entire deployment process into a repeatable, auditable script (`Jenkinsfile`). When you push to Git, Jenkins automatically:
1. Pulls the latest code
2. Builds all Docker images
3. Starts services in dependency order (DB → Kafka → backend → frontend)
4. Runs health checks to ensure each service is ready
5. Verifies the full stack is running
6. Tears down on failure or completion

This ensures **consistency**: every deployment is identical, whether it's on a developer's laptop, a staging server, or production.

### How DAWker uses Jenkins: stage-by-stage breakdown

DAWker's `Jenkinsfile` orchestrates a **6-service stack** (PostgreSQL, Zookeeper, Kafka, backend, frontend, log-consumer). Each stage depends on the previous one completing successfully.

```1:99:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\Jenkinsfile
pipeline {
    agent any
    environment { DOCKER_COMPOSE_FILE = 'docker-compose.yml' }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Build Docker Images') {
            steps {
                script {
                    isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE build')
                             : bat('docker-compose -f %DOCKER_COMPOSE_FILE% build')
                }
            }
        }
        stage('Start Database') {
            steps {
                script {
                    isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE up -d db')
                             : bat('docker-compose -f %DOCKER_COMPOSE_FILE% up -d db')
                    // Wait until PostgreSQL is healthy
                    isUnix() ? sh('''
                        echo "Waiting for PostgreSQL to be healthy..."
                        until [ "$(docker inspect -f {{.State.Health.Status}} dawker-db)" == "healthy" ]; do
                            sleep 5
                        done
                    ''') : bat('powershell -Command "..."')
                }
            }
        }
        stage('Start Kafka & Zookeeper') {
            steps {
                script {
                    isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE up -d zookeeper kafka')
                             : bat('docker-compose -f %DOCKER_COMPOSE_FILE% up -d zookeeper kafka')
                    // Wait for Kafka to be healthy
                    isUnix() ? sh('''
                        echo "Waiting for Kafka to be healthy..."
                        until [ "$(docker inspect -f {{.State.Health.Status}} kafka)" == "healthy" ]; do
                            sleep 5
                        done
                    ''') : bat('powershell -Command "..."')
                }
            }
        }
        stage('Start Backend') {
            steps {
                script {
                    isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE up -d backend')
                             : bat('docker-compose -f %DOCKER_COMPOSE_FILE% up -d backend')
                    // Wait until Spring Boot backend is healthy
                    isUnix() ? sh('''
                        echo "Waiting for backend to be healthy..."
                        until [ "$(docker inspect -f {{.State.Health.Status}} dawker-backend)" == "healthy" ]; do
                            sleep 10
                        done
                    ''') : bat('powershell -Command "..."')
                }
            }
        }
        stage('Start Frontend') {
            steps {
                script {
                    isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE up -d frontend')
                             : bat('docker-compose -f %DOCKER_COMPOSE_FILE% up -d frontend')
                }
            }
        }
        stage('Start Log Consumer') {
            steps {
                script {
                    isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE up -d log-consumer')
                             : bat('docker-compose -f %DOCKER_COMPOSE_FILE% up -d log-consumer')
                }
            }
        }
        stage('Verify Services') {
            steps {
                script {
                    isUnix() ? sh('docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"')
                             : bat('docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"')
                }
            }
        }
    }
    post {
        always {
            echo 'Stopping all containers...'
            isUnix() ? sh('docker-compose -f $DOCKER_COMPOSE_FILE down')
                     : bat('docker-compose -f %DOCKER_COMPOSE_FILE% down')
        }
    }
}
```

#### Stage 1: Checkout
Pulls the latest code from the Git repository. This ensures Jenkins is always building the most recent commit.

#### Stage 2: Build Docker Images
Builds Docker images for the backend, frontend, and log-consumer using the `Dockerfile` in each service directory. This stage packages all dependencies into isolated containers.

**Why this matters:** If a developer forgets to update `package.json` or `pom.xml`, the build will fail here, **before** deploying broken code.

#### Stage 3: Start Database
Starts PostgreSQL and waits for it to pass health checks. The health check polls `pg_isready` every 5 seconds until the database is accepting connections.

```14:18:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\docker-compose.yml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U user -d dawker_db"]
  interval: 5s
  timeout: 5s
  retries: 5
```

**Why this matters:** If the backend starts before PostgreSQL is ready, Hibernate will fail to connect and the entire stack will crash. The health check prevents race conditions.

#### Stage 4: Start Kafka & Zookeeper
Starts Zookeeper (Kafka's coordination service) and Kafka, then waits for Kafka to pass health checks. The health check verifies Kafka can list topics.

```85:89:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\docker-compose.yml
healthcheck:
  test: ["CMD", "kafka-topics", "--bootstrap-server", "kafka:29092", "--list"]
  interval: 10s
  timeout: 5s
  retries: 5
```

**Why this matters:** Kafka requires Zookeeper to be fully initialized before it can accept connections. If the backend starts before Kafka is ready, log messages will fail to send and error handling will break.

#### Stage 5: Start Backend
Starts the Spring Boot backend and waits for it to pass health checks. The health check hits the `/actuator/health` endpoint provided by Spring Boot Actuator.

```38:43:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\docker-compose.yml
healthcheck:
  test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1"]
  interval: 15s
  timeout: 10s
  retries: 5
  start_period: 40s  # Gives Spring Boot time to boot up
```

**Why this matters:** Spring Boot takes 20-40 seconds to initialize (loading beans, connecting to DB, setting up Kafka producers). The `start_period: 40s` gives it time to boot before Jenkins checks health. Without this, Jenkins would mark the backend as "failed" during normal startup.

#### Stage 6: Start Frontend
Starts the React frontend (served via Vite dev server or Nginx). No health check is needed because the frontend is stateless and starts instantly.

#### Stage 7: Start Log Consumer
Starts the log-consumer service, which subscribes to Kafka topics and writes logs to disk.

#### Stage 8: Verify Services
Runs `docker ps` to list all running containers with their status and exposed ports. This provides a final verification that the entire stack is up.

#### Post: Cleanup
**Always** runs (even if a stage fails). Stops and removes all containers using `docker-compose down`. This ensures a clean state for the next build.

**Why this matters:** Without cleanup, failed containers would linger and cause port conflicts on the next build.

### Why Jenkins is critical for DAWker

1. **Dependency orchestration:** DAWker has 6 services with strict startup order (DB → Kafka → backend → frontend/log-consumer). Manual startup is error-prone and slow. Jenkins automates this and enforces health checks at each step.

2. **Cross-platform support:** The `isUnix()` branching ensures the same `Jenkinsfile` works on Linux, macOS, and Windows. Developers don't need to maintain separate scripts.

3. **Fast feedback:** If a build breaks, Jenkins fails immediately and shows which stage failed. This shortens the debug loop from "deploy to staging and hope it works" to "fix it locally before pushing."

4. **Team consistency:** Every developer and CI/CD environment runs the exact same deployment process. No more "works on my machine" bugs.

---

## Kafka (what it is + how DAWker uses it)

### What Kafka is

**Apache Kafka** is a **distributed event streaming platform** designed for high-throughput, fault-tolerant message passing between services. It acts as a "message bus" where:
- **Producers** send messages to **topics** (like "api-calls", "errors", "service-calls").
- **Consumers** subscribe to topics and process messages asynchronously.

Unlike direct service-to-service calls (like REST), Kafka **decouples** producers and consumers:
- The backend doesn't need to know if the log-consumer is running. It just sends log messages to Kafka.
- If the log-consumer crashes, Kafka holds the messages until it restarts.
- Multiple consumers can subscribe to the same topic without the producer knowing.

This makes Kafka ideal for:
- **Event logging** (what DAWker uses it for)
- **Real-time analytics** (e.g., tracking user behavior)
- **Microservice communication** (e.g., order service → inventory service)
- **Stream processing** (e.g., fraud detection on financial transactions)

### How DAWker uses Kafka: producer-consumer architecture

DAWker uses Kafka to **centralize logging** across all backend operations. Instead of scattering log statements throughout the code, every controller and service method sends structured log messages to Kafka. A separate **log-consumer** service subscribes to these messages and writes them to disk.

#### Architecture overview

```
┌──────────────┐                 ┌───────────────┐                 ┌───────────────┐
│   Backend    │  (producer)     │     Kafka     │   (consumer)    │ Log Consumer  │
│  Controller  ├────────────────>│    Topics     ├────────────────>│   Service     │
│   + Service  │   log messages  │  • api-calls  │  log messages   │  writes to    │
│              │                 │  • service-   │                 │  disk (logs/) │
│              │                 │    calls      │                 │               │
│              │                 │  • errors     │                 │               │
└──────────────┘                 └───────────────┘                 └───────────────┘
```

#### Kafka producer: `KafkaLogProducer`

The backend includes a `KafkaLogProducer` component that wraps Kafka's `KafkaTemplate` and provides structured logging methods (`trace`, `debug`, `info`, `warn`, `error`).

```1:59:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\kafka\KafkaLogProducer.java
@Component
public class KafkaLogProducer {
    private final KafkaTemplate<String, Map<String, String>> kafkaTemplate;

    public KafkaLogProducer(KafkaTemplate<String, Map<String, String>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void trace(String topic, String message, String service, String method) {
        send(topic, "TRACE", message, service, method, null);
    }
    public void debug(String topic, String message, String service, String method) {
        send(topic, "DEBUG", message, service, method, null);
    }
    public void info(String topic, String message, String service, String method) {
        send(topic, "INFO", message, service, method, null);
    }
    public void warn(String topic, String message, String service, String method) {
        send(topic, "WARN", message, service, method, null);
    }
    public void error(String topic, String message, String service, String method, Throwable ex) {
        send(topic, "ERROR", message, service, method, ex);
    }

    private void send(String topic, String level, String message, String service, String method, Throwable ex) {
        try {
            Map<String, String> logMap = new HashMap<>();
            logMap.put("service", service);
            logMap.put("method", method);
            logMap.put("level", level);
            logMap.put("message", message);
            if (ex != null) {
                logMap.put("exception", ExceptionUtils.getStackTrace(ex));
            }
            kafkaTemplate.send(topic, logMap);
        } catch (Exception e) {
            System.err.println("Failed to send log to Kafka: " + e.getMessage());
        }
    }
}
```

**How it works:**
1. Every log method (`info`, `debug`, etc.) calls `send` with a topic, log level, message, service name, and method name.
2. `send` builds a `Map<String, String>` containing structured log metadata.
3. `kafkaTemplate.send(topic, logMap)` serializes the map to JSON and sends it to Kafka.
4. If Kafka is unavailable, the `catch` block prints to stderr instead of crashing the application.

**Kafka configuration (backend):**

```30:33:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\resources\application.properties
spring.kafka.bootstrap-servers=${SPRING_KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
```

This tells Spring Boot:
- Connect to Kafka at `localhost:9092` (or use the `SPRING_KAFKA_BOOTSTRAP_SERVERS` env var from Docker Compose).
- Serialize log messages to JSON using Spring's `JsonSerializer`.

#### Using the producer in controllers and services

Every controller and service injects `KafkaLogProducer` and logs operations.

**Example: `dawController` logging API calls**

```75:94:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\controller\dawController.java
@GetMapping("/search/users")
public List<dawDTO> getDawsByUserId(@RequestParam Long userId) {
    System.out.println("Fetching DAWs for User ID: " + userId);
    logger.info("api-calls", "Getting daws by user id", "dawController", "getDawsByUserId");
    logger.debug("api-calls", "Fetching DAWs for User ID: " + userId, "dawController", "getDawsByUserId");
    return dawService.getDawsByUserId(userId);
}
```

**What happens:**
1. `logger.info("api-calls", ...)` sends an INFO-level log to the `api-calls` topic.
2. `logger.debug("api-calls", ...)` sends a DEBUG-level log with the user ID.
3. Kafka holds these messages until the log-consumer reads them.

**Example: `useService` logging service operations**

```123:127:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\dawker\dawker\src\main\java\com\project\dawker\Service\useService.java
public userDTO getUserById(Long id) {
    logger.info("service-calls", "", "useService", "getUserById");
    return this.userRepository.findById(id).map(this::mapToUserDTO)
            .orElseThrow(() -> new UserNotFoundException("User could not be found by that Id"));
}
```

**What happens:**
1. `logger.info("service-calls", ...)` sends an INFO-level log to the `service-calls` topic.
2. This logs **every** service method call, providing an audit trail of backend operations.

#### Kafka consumer: `LogConsumer`

The log-consumer is a **separate Spring Boot microservice** that subscribes to Kafka topics and writes logs to disk. It listens to three topics: `errors`, `api-calls`, and `service-calls`.

```37:50:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\log-consumer\consumer\src\main\java\com\revature\consumer\LogConsumer.java
@Component
public class LogConsumer {
    @KafkaListener(topics = "errors")
    public void consumeError(Map<String, String> logMap) {
        consume(logMap);
    }
    @KafkaListener(topics = "api-calls")
    public void consumeAPICall(Map<String, String> logMap) {
        consume(logMap);
    }
    @KafkaListener(topics = "service-calls")
    public void consumeServiceCall(Map<String, String> logMap) {
        consume(logMap);
    }
}
```

**How it works:**
1. `@KafkaListener(topics = "api-calls")` tells Spring Kafka to subscribe to the `api-calls` topic.
2. Whenever a message arrives, Kafka deserializes it into a `Map<String, String>` and calls `consumeAPICall`.
3. `consume(logMap)` extracts the log level, message, service, method, and optional exception.
4. It formats the log and writes it to disk using Java NIO.

**Log formatting and writing:**

```52:90:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\log-consumer\consumer\src\main\java\com\revature\consumer\LogConsumer.java
private void consume(Map<String, String> logMap) {
    String service = logMap.getOrDefault("service", "unknown-service");
    String level = logMap.getOrDefault("level", "INFO");
    String message = logMap.getOrDefault("message", "");
    String method = logMap.getOrDefault("method", "unknown-method");
    String exception = logMap.get("exception");

    String timestamp = LocalDateTime.now().format(formatter);
    String formattedLevel = String.format("%-5s", level);
    StringBuilder logBuilder = new StringBuilder();
    logBuilder.append("[").append(service).append(".").append(method).append("] ");
    logBuilder.append(message);
    if (exception != null) logBuilder.append(" (").append(exception).append(")");

    String logLine = String.format("{%s} %s - %s%n", timestamp, formattedLevel, logBuilder);
    write(level, logLine);
}

private synchronized void write(String logLevel, String message) {
    int logIndex = logLevels.indexOf(logLevel);  // TRACE=0, DEBUG=1, INFO=2, WARN=3, ERROR=4
    if (logIndex == -1) logIndex = logLevels.indexOf("INFO");

    try {
        for (int i = 0; i <= logIndex; i++) {
            Path logFile = LOG_DIR.resolve(logLevels.get(i) + ".log");
            Files.writeString(logFile, message, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        }
    } catch (IOException e) {
        System.out.printf("Error while trying to write %s to %s.log.%n", message, logLevels.get(i));
        e.printStackTrace();
    }
}
```

**How it works:**
1. `consume` extracts log metadata and formats it as:  
   `{2026-01-14 15:32:10.123} INFO  - [dawController.getDawById] Fetching DAW with ID: 123`
2. `write` uses a **log level hierarchy**: an ERROR-level log is written to `TRACE.log`, `DEBUG.log`, `INFO.log`, `WARN.log`, **and** `ERROR.log`.
3. This allows filtering: developers can read `ERROR.log` for critical issues or `TRACE.log` for full debugging.

**Kafka configuration (log-consumer):**

```4:13:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\backend\log-consumer\consumer\src\main\resources\application.properties
spring.kafka.bootstrap-servers=${SPRING_KAFKA_BOOTSTRAP_SERVERS:kafka:29092}
spring.kafka.consumer.auto-offset-reset=earliest
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer
spring.kafka.consumer.group-id=log-consumer-group
spring.kafka.consumer.properties.spring.json.value.default.type=java.util.Map
spring.kafka.consumer.properties.spring.json.trusted.packages=java.util
```

- `auto-offset-reset=earliest`: If the log-consumer crashes, it will replay all unprocessed messages from the beginning.
- `group-id=log-consumer-group`: Multiple log-consumer instances can share the workload (useful for scaling).
- `JsonDeserializer`: Kafka deserializes JSON messages into `Map<String, String>`.

### Why Kafka is critical for DAWker

1. **Decoupling:** The backend doesn't care if the log-consumer is running. It sends logs to Kafka and continues processing requests. If the log-consumer crashes, Kafka holds the logs until it restarts.

2. **Fault tolerance:** Kafka persists messages to disk. If the log-consumer is down for 10 minutes, it will catch up when it restarts by replaying the backlog.

3. **Scalability:** Kafka can handle millions of messages per second. As DAWker grows, additional log-consumers can be added to process logs in parallel.

4. **Structured logging:** Every log includes metadata (service, method, level, timestamp). This makes it easy to filter, search, and analyze logs programmatically.

5. **No performance impact:** Sending logs to Kafka is asynchronous and non-blocking. The backend doesn't wait for logs to be written to disk.

### Real-world use cases in DAWker

**Use case 1: Debugging user login failures**
A user reports they can't log in. You check `api-calls.log`:
```
{2026-01-14 10:15:23.456} INFO  - [dawController.login] 
{2026-01-14 10:15:23.457} WARN  - [dawController.login] user is null
```
The WARN log reveals the login returned null (invalid credentials), pointing you to `useService.loginUser` for further investigation.

**Use case 2: Tracking DAW save operations**
You want to verify a DAW was saved correctly. You check `service-calls.log`:
```
{2026-01-14 10:20:15.123} INFO  - [DawService.saveDaw] 
{2026-01-14 10:20:15.456} TRACE - [dawController.saveDaw] The payload that got to the backend
{2026-01-14 10:20:15.457} TRACE - [dawController.saveDaw] {"dawId":"123","name":"My Amp"}
```
The TRACE logs show the exact JSON payload received by the backend, confirming the frontend sent the correct data.

**Use case 3: Monitoring API health**
You want to know which endpoints are being called most frequently. You parse `api-calls.log` and count occurrences of each method:
```
getDawById: 4523 calls
getAllDaws: 1234 calls
saveDaw: 567 calls
```
This reveals that `getDawById` is the hottest endpoint and may need caching or optimization.

### How Kafka fits into the Docker Compose + Jenkins pipeline

**Docker Compose orchestration:**

```64:103:C:\Users\14692\Desktop\Projects\p2-KDBO-DAWker\docker-compose.yml
zookeeper:
  image: confluentinc/cp-zookeeper:7.5.0
  environment:
    ZOOKEEPER_CLIENT_PORT: 2181

kafka:
  image: confluentinc/cp-kafka:7.5.0
  depends_on:
    - zookeeper
  environment:
    KAFKA_BROKER_ID: 1
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
  healthcheck:
    test: ["CMD", "kafka-topics", "--bootstrap-server", "kafka:29092", "--list"]

log-consumer:
  build:
    context: ./backend/log-consumer/consumer
    dockerfile: Dockerfile
  environment:
    SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
  depends_on:
    kafka:
      condition: service_healthy
  volumes:
    - ./backend/logs:/app/logs
```

**Startup order enforced by Jenkins:**
1. Zookeeper starts first (Kafka requires it for coordination).
2. Kafka starts and waits for Zookeeper to be ready.
3. Backend starts and connects to Kafka (sends logs to topics).
4. Log-consumer starts and subscribes to topics (reads logs from Kafka and writes to disk).

**Volume mounting:** The log-consumer writes logs to `/app/logs` inside the container. Docker Compose mounts `./backend/logs` on the host to `/app/logs` in the container, so logs persist even if the container is destroyed.

### Summary: Kafka's role in DAWker

Kafka enables **centralized, asynchronous, fault-tolerant logging** across the entire backend. Every API call, service method, and error is logged to Kafka topics. A separate log-consumer service subscribes to these topics and writes structured logs to disk, providing a complete audit trail for debugging and monitoring. This decouples logging from business logic, ensures no logs are lost even if the log-consumer crashes, and provides a foundation for future analytics and monitoring dashboards.
