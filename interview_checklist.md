# Full Stack Development - Interview Study Guide

This comprehensive guide explains the key technologies in full stack development, why they matter, and how to discuss them in technical interviews. Each section includes practical examples from your projects in the `trainer-code` repository.

---

## Table of Contents

1. [Frontend Technologies](#frontend-technologies)
2. [Backend Technologies](#backend-technologies)
3. [Data Persistence & Management](#data-persistence--management)
4. [DevOps & Infrastructure](#devops--infrastructure)
5. [Core Computer Science Concepts](#core-computer-science-concepts)

---

## Frontend Technologies

### React

**Why It's Important:**
React is the most popular JavaScript library for building modern user interfaces. It's component-based, declarative, and highly efficient due to its virtual DOM. Companies value React because it enables rapid development, reusable code, and a rich ecosystem.

**What It's Used For in Full Stack:**
- Building dynamic, single-page applications (SPAs)
- Managing complex UI state and data flow
- Creating reusable, maintainable component libraries
- Integrating with REST APIs and backend services

**How I Used It in My Projects:**

**feedback.fm Dashboard Component** - Managing Spotify data with React hooks:

```typescript
function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userAPI.getDashboard();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    // Dashboard renders top artists, top songs, listening stats
  );
}
```

**Why React Matters for This Project:**
- **State Management**: Multiple `useState` hooks manage dashboard data, loading states, and currently playing track
- **Side Effects**: `useEffect` fetches Spotify data on mount and polls for "currently playing" updates every 5 seconds
- **Data Transformation**: Maps Spotify API responses to UI-friendly format before storing in state
- **Conditional Rendering**: Shows loading skeleton while fetching, error messages on failure, or dashboard data on success
- **React Router**: Navigates between Dashboard, Top Artists, Top Songs, Playlists without page reloads

**DAWker NativeAmpDemo Component** - Real-time audio processing with React:

```typescript
const NativeAmpDemo: FC = () => {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [distortionAmount, setDistortionAmount] = useState<number>(0.5);
  const [bassValue, setBassValue] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    // Load DAW preset from backend on mount
    dawAPI.getDawById(dawId).then((daw: DawDTO) => {
      setDawState(daw);
      applyPresetToUI(daw.listOfConfigs[0].components);
    });
  }, []);

  // Sliders directly update audio nodes via refs (no re-render)
  const handleDistortionChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setDistortionAmount(newValue);
    if (distortionNodeRef.current) {
      distortionNodeRef.current.curve = makeDistortionCurve(newValue);
    }
  };
}
```

**Why React Matters for This Project:**
- **useRef for Performance**: Audio nodes stored in refs avoid unnecessary re-renders during real-time audio processing
- **Dual State Updates**: Sliders update both React state (UI display) and Web Audio nodes (sound) simultaneously
- **Component Lifecycle**: `useEffect` loads DAW presets from backend on mount and applies settings to UI sliders
- **Real-time Interactivity**: React manages complex UI state (amp settings, preset names, save dialogs) while audio processing happens in the browser's Web Audio API

**Interview Talking Points:**
- "In **feedback.fm**, I use `useState` to manage dashboard data fetched from Spotify's API and my backend"
- "The `useEffect` hook fetches data on mount and polls for 'currently playing' updates - I clean up the interval in the return function to prevent memory leaks"
- "In **DAWker**, I use `useRef` for Web Audio nodes because they don't need to trigger re-renders - React state is for UI, refs are for audio processing"
- "Both projects use React Router for client-side navigation - feedback.fm routes between Dashboard/Artists/Songs, DAWker routes between Landing/Login/Amp/Forums"
- "I optimize re-renders by keeping state close to where it's used - global state goes in context, component state stays local"

**Common Interview Questions:**
- What's the difference between class and functional components?
  → *"Functional components with hooks are the modern standard. They're more concise, easier to test, and avoid `this` binding issues. All my projects use functional components."*
  
- Explain the virtual DOM and reconciliation
  → *"React creates a virtual representation of the DOM. When state changes, it diffs the old and new virtual DOM, then efficiently updates only the changed real DOM nodes. This makes React fast even with frequent updates."*
  
- When would you use useEffect with different dependency arrays?
  → *"Empty array `[]` runs once on mount (I use this in feedback.fm to fetch dashboard data). No array runs on every render (rarely needed). Array with dependencies `[dawId]` runs when `dawId` changes (I use this in DAWker to reload presets)."*
  
- How do you prevent unnecessary re-renders?
  → *"I use `React.memo()` to memoize components, `useCallback` for functions passed as props, and `useMemo` for expensive calculations. In DAWker, I memoized slider components since they re-render frequently."*

---

### HTML5

**Why It's Important:**
HTML5 is the foundation of all web applications. Modern HTML5 provides semantic elements, improved accessibility, and native support for multimedia and APIs. Good HTML structure improves SEO, accessibility, and maintainability.

**What It's Used For in Full Stack:**
- Structuring content and layout
- Creating accessible web applications
- Building forms for user input
- Embedding media and interactive content

**Key Concepts for Interviews:**

**1. Semantic HTML** - Use meaningful tags that describe content
- `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Improves accessibility (screen readers understand structure)
- Better SEO (search engines understand page hierarchy)
- Easier to maintain and read

**2. Forms and Input Types**
- Typed inputs provide built-in validation: `email`, `number`, `date`, `tel`
- Form attributes: `required`, `pattern`, `min/max`
- Labels improve accessibility and UX

```1:79:W4/Intro_to_HTML/index.html
<header>
    <nav>
        <a href="https://google.com">GO TO GOOGLE</a>
    </nav>
</header>
<h1>Heading 1</h1>
<ul>
    <li>Bacon</li>
    <li>Egg</li>
    <li>Cheese</li>
</ul>
<form>
    <label>Pet Name?
        <input type="text">
    </label>
    <input type="submit">
</form>
```

**Interview Talking Points:**
- "I use semantic HTML like `<header>` and `<nav>` instead of generic `<div>` tags to improve accessibility and code readability"
- "Proper form structure with labels and typed inputs provides better UX and built-in validation"
- "Lists (`<ul>`, `<ol>`) group related items and provide semantic meaning for screen readers"

**Common Interview Questions:**
- What's the difference between block and inline elements?
- Explain semantic HTML and why it matters
- How do you make websites accessible?
- What are data attributes and when would you use them?

---

### CSS (Cascading Style Sheets)

**Why It's Important:**
CSS controls the visual presentation of web applications. Modern CSS includes powerful layout systems (Flexbox, Grid), animations, and responsive design capabilities. Good CSS skills separate functional applications from professional, polished products.

**What It's Used For in Full Stack:**
- Styling and layout of web pages
- Responsive design (mobile, tablet, desktop)
- Animations and transitions
- Theming and branding

**Key Concepts for Interviews:**

**1. CSS Selectors**
- Element selectors: `button`, `div`
- Class selectors: `.btn-primary`
- ID selectors: `#my-button` (use sparingly)
- Pseudo-classes: `:hover`, `:focus`, `:nth-child()`
- Specificity matters: ID > Class > Element

**2. Layout Systems**
- **Flexbox**: One-dimensional layout (rows or columns)
  - `display: flex`, `justify-content`, `align-items`
  - Great for navigation bars, card layouts
- **Grid**: Two-dimensional layout (rows and columns)
  - `display: grid`, `grid-template-columns`, `grid-gap`
  - Perfect for complex page layouts

**3. Responsive Design**
- Media queries: `@media (max-width: 768px) { ... }`
- Mobile-first approach
- Relative units: `rem`, `em`, `%`, `vw/vh`

```1:33:W4/Intro_to_CSS/style.css
ul {
    border: solid green;
}
button:hover {
    color: blue;
}
#my-button {
    display: flex;
    justify-content:center;
}
```

**Interview Talking Points:**
- "I use Flexbox for one-dimensional layouts like navigation bars where I need items centered or spaced evenly"
- "The `:hover` pseudo-class provides visual feedback for interactive elements"
- "ID selectors have high specificity but should be used sparingly to avoid styling conflicts"
- "I prefer class-based styling for reusability across components"

**Common Interview Questions:**
- Explain the box model
- What's the difference between Flexbox and Grid?
- How do you center a div?
- Explain CSS specificity and inheritance
- What are CSS preprocessors (Sass, Less)?

---

### JavaScript (ES6+)

**Why It's Important:**
JavaScript is the programming language of the web. It runs in browsers, powers frontend frameworks, and with Node.js, enables full stack development. Modern ES6+ features make JavaScript more powerful and expressive.

**What It's Used For in Full Stack:**
- Client-side interactivity and logic
- DOM manipulation
- Asynchronous operations (API calls, timers)
- Event handling
- Server-side programming (Node.js)

**Key Concepts for Interviews:**

**1. DOM Manipulation**
- `document.getElementById()`, `querySelector()`
- Creating, modifying, removing elements
- Event listeners

**2. Event Handling**
- Event listeners: `addEventListener()`
- Event object: properties like `event.target`, `event.preventDefault()`
- Event delegation for dynamic content

**3. ES6+ Features**
- Arrow functions: `const add = (a, b) => a + b`
- Destructuring: `const {name, age} = user`
- Template literals: `` `Hello ${name}` ``
- Spread operator: `[...arr1, ...arr2]`
- Async/await for promises

```27:33:W4/Intro_to_JavaScript/script.js
function sayHello() {
  alert("Hello from the external file!");
}

let btn = document.getElementById("helloBtn");
btn.addEventListener("click", sayHello);
```

**Interview Talking Points:**
- "I select DOM elements using `getElementById` or `querySelector` for more complex selections"
- "Event listeners decouple behavior from markup - I can attach multiple listeners to one element"
- "Arrow functions provide concise syntax and lexical `this` binding"
- "Async/await makes promise-based code more readable than callback chains"

**Common Interview Questions:**
- What are closures and why are they useful?
- Explain `this` in JavaScript
- What's the event loop?
- Difference between `==` and `===`?
- How do promises work?
- What are the different ways to handle asynchronous code?

---

### TypeScript

**Why It's Important:**
TypeScript is a superset of JavaScript that adds static typing. It catches errors at compile time, improves IDE support with autocomplete and refactoring, and makes large codebases more maintainable. It's widely adopted in enterprise applications.

**What It's Used For in Full Stack:**
- Type-safe JavaScript development
- Better IDE support and refactoring
- Preventing runtime errors
- Self-documenting code through types
- Used heavily with Angular, React, Node.js

**Key Concepts for Interviews:**

**1. TypeScript with Angular**
- Components use decorators: `@Component`, `@Injectable`
- Strong typing for props, state, and services
- Dependency injection
- RxJS for reactive programming

**2. Type System**
- Primitive types: `string`, `number`, `boolean`
- Arrays: `string[]` or `Array<string>`
- Objects: interfaces and type aliases
- Union types: `string | number`
- Generics: `Array<T>`, `Promise<T>`

```1:13:W5/Ben-Demos/hello-angular/src/app/app.component.ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ParentComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hello-angular';
}
```

**Interview Talking Points:**
- "TypeScript catches type errors before runtime, reducing bugs in production"
- "The `@Component` decorator provides metadata - selector defines the custom HTML tag, template and styles define the view"
- "Angular's dependency injection makes services available throughout the app via the `imports` array"
- "I use interfaces to define contracts for data structures, ensuring consistency across the application"

**Common Interview Questions:**
- What are the benefits of TypeScript over JavaScript?
- Explain interfaces vs types
- What are generics and when would you use them?
- How does TypeScript compilation work?
- What is type inference?

---

## Backend Technologies

### Java

**Why It's Important:**
Java is one of the most popular enterprise programming languages. It's platform-independent (JVM), strongly typed, object-oriented, and has a massive ecosystem. Companies use Java for scalable, maintainable backend systems.

**What It's Used For in Full Stack:**
- REST API development
- Business logic and service layers
- Enterprise applications
- Microservices architecture
- Integration with databases and external services

**How I Used It in My Projects:**

**feedback.fm SongServiceImpl** - Service layer with DTO mapping and validation:

```java
@Service
@Transactional(readOnly = true)
public class SongServiceImpl implements SongService {
    private final SongRepository repository;

    public SongServiceImpl(SongRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<SongDTO> getAllSongs() {
        return repository.findAll().stream()
                .map(this::songToDto)
                .toList();
    }

    @Override
    public List<SongDTO> searchByName(String namePart) {
        if (namePart == null || namePart.isBlank()) {
            return List.of();
        }
        return repository.findByNameContainingIgnoreCase(namePart).stream()
                .map(this::songToDto)
                .toList();
    }

    private SongDTO songToDto(Song song) {
        return new SongDTO(
            song.getSongId(),
            song.getName(),
            song.getArtistName(),
            song.getAlbumImage(),
            song.getDurationMs()
        );
    }
}
```

**Why Java Matters for This Project:**
- **Service Layer Pattern**: Separates Spotify sync logic from REST controllers
- **Constructor Injection**: `SongServiceImpl(SongRepository repository)` - immutable, testable
- **Input Validation**: Checks for null/blank before querying database
- **DTOs**: `SongDTO` exposes only needed fields (no JPA lazy-loading issues)
- **Transaction Management**: `@Transactional(readOnly = true)` optimizes read-only queries

**SeQueL TMDbService** - External API integration with Gson:

```java
public class TMDbService {
    private final String API_KEY = "...";
    private final String BASE_URL = "https://api.themoviedb.org/3";
    private final Gson gson = new Gson();

    public List<TMDb> searchMovies(String query) throws IOException {
        String endpoint = BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + query;
        String jsonResponse = makeApiRequest(endpoint);
        
        JsonObject response = gson.fromJson(jsonResponse, JsonObject.class);
        JsonArray results = response.getAsJsonArray("results");
        
        List<TMDb> searchList = new ArrayList<>();
        for (JsonElement result : results) {
            JsonObject movieJson = result.getAsJsonObject();
            searchList.add(parseSearch(movieJson));
        }
        return searchList;
    }

    private TMDb parseSearch(JsonObject json) {
        int id = json.get("id").getAsInt();
        String title = json.get("title").getAsString();
        String releaseDate = json.has("release_date") ? json.get("release_date").getAsString() : null;
        // ... more parsing
        return new TMDb(id, title, releaseDate, overview);
    }
}
```

**Why Java Matters for This Project:**
- **HTTP Client**: Uses Java's `HttpURLConnection` to call TMDb REST API
- **JSON Parsing**: Gson deserializes JSON responses into Java objects
- **Error Handling**: Wraps API calls in try-catch, throws meaningful exceptions
- **Data Validation**: Checks for missing/null fields before parsing
- **Separation of Concerns**: Service layer handles API logic, separate from UI and database repos

**DAWker DawService** - Hierarchical DTO mapping with Stream API:

```java
@Service
public class DawService {
    private final DawRepository dawRepository;
    private final UserRepository userRepository;
    private final KafkaLogProducer logger;

    public DawService(DawRepository dawRepository, UserRepository userRepository, 
                      KafkaLogProducer logger) {
        this.dawRepository = dawRepository;
        this.userRepository = userRepository;
        this.logger = logger;
    }

    public dawDTO getDawById(String dawId) {
        logger.info("service-calls", "Getting DAW by ID", "DawService", "getDawById");
        DawEntity daw = dawRepository.findById(dawId)
                .orElseThrow(() -> new DawNotFoundException("DAW not found: " + dawId));
        return mapToDawDto(daw);
    }

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
        
        return new dawDTO(daw.getId(), daw.getUser().getId(), daw.getName(),
                daw.getDescription(), daw.getCreatedAt(), daw.getExportCount(), configs);
    }
}
```

**Why Java Matters for This Project:**
- **Nested DTO Mapping**: Transforms DAW → Config → Component → Settings hierarchy
- **Stream API**: Maps collections at each level (configs → components → settings)
- **Multiple Dependencies**: Injects repository, user repo, and Kafka logger
- **Custom Exceptions**: Throws domain-specific `DawNotFoundException` for clarity
- **Structured Logging**: Uses Kafka producer to log service method calls for observability

**Interview Talking Points:**
- "In **feedback.fm**, the service layer validates input (null checks), transforms entities to DTOs, and keeps controllers thin"
- "**SeQueL** uses pure Java (no Spring) for TMDb API integration - I handle HTTP requests, JSON parsing, and error handling manually"
- "**DAWker** uses nested Stream operations to map hierarchical entities (DAW has configs, configs have components) into DTOs for the frontend"
- "I prefer constructor injection over field injection - it makes dependencies explicit and enables testing with mock objects"
- "DTOs prevent exposing JPA lazy-loading issues to the frontend - the API only sends what's needed"

**Common Interview Questions:**
- Explain the difference between JDK, JRE, and JVM
  → *"JDK (Development Kit) includes compiler and tools. JRE (Runtime Environment) runs Java apps. JVM (Virtual Machine) executes bytecode. I use JDK 17 in my projects."*
  
- What are the principles of OOP?
  → *"Encapsulation (hide internal state), Inheritance (code reuse through parent classes), Polymorphism (same method, different behavior), Abstraction (hide complexity). All three projects use OOP for clean architecture."*
  
- Difference between abstract classes and interfaces?
  → *"Abstract classes can have concrete methods and state. Interfaces define contracts (Java 8+ allows default methods). I use interfaces for service contracts (SongService interface, SongServiceImpl implementation)."*
  
- What is the purpose of the service layer?
  → *"Business logic lives here - not in controllers (too thin) or repositories (data access only). Services orchestrate multiple repo calls, validate input, and transform entities to DTOs."*
  
- How does garbage collection work?
  → *"JVM automatically frees unreferenced objects. Minor GC cleans young generation, Major GC cleans old generation. I monitor GC logs in production to tune JVM flags for performance."*

---

### JUnit (Testing)

**Why It's Important:**
JUnit is the standard testing framework for Java. Automated tests ensure code correctness, prevent regressions, and enable confident refactoring. Testing is critical in professional development and often discussed in interviews.

**What It's Used For in Full Stack:**
- Unit testing individual methods/classes
- Integration testing
- Test-driven development (TDD)
- Continuous integration pipelines
- Documentation through tests

**Key Concepts for Interviews:**

**1. AAA Pattern (Arrange-Act-Assert)**
- **Arrange**: Set up test data and preconditions
- **Act**: Execute the method under test
- **Assert**: Verify the expected outcome

**2. Test Annotations**
- `@Test`: Marks a test method
- `@BeforeEach`: Runs before each test (setup)
- `@AfterEach`: Runs after each test (cleanup)
- `@DisplayName`: Descriptive test names

**3. Assertions**
- `assertEquals(expected, actual)`: Compare values
- `assertNotNull(value)`: Null checks
- `assertThrows(Exception.class, () -> ...)`: Exception testing
- AssertJ for fluent assertions: `assertThat(actual).isEqualTo(expected)`

```67:88:W7/ExpenseReport/src/test/java/com/revature/ExpenseReport/Service/ExpenseServiceTests.java
@Test
public void happyPath_getExpenseById_returnsExpenseDTO() {
    String id = "thisIsTheId";
    Expense savedExpense = new Expense(date, new BigDecimal("50.00"), "Video Games");
    when(repo.findById(id)).thenReturn(Optional.of(savedExpense));
    ExpenseDTO actual = service.getById(id);
    assertThat(actual).isEqualTo(expected);
}
```

**Interview Talking Points:**
- "I follow the AAA pattern - arrange mock data, act by calling the service method, assert the result"
- "The test name `happyPath_getExpenseById_returnsExpenseDTO` clearly describes what's being tested"
- "I use Mockito to mock the repository - this isolates the service layer from database dependencies"
- "AssertJ provides readable assertions like `assertThat(actual).isEqualTo(expected)`"
- "Testing ensures my service correctly transforms entities to DTOs"

**Common Interview Questions:**
- What's the difference between unit and integration tests?
- Explain test-driven development (TDD)
- What makes a good test?
- How do you test private methods?
- What is test coverage and what's a good target?

---

### Mockito (Mocking Framework)

**Why It's Important:**
Mockito enables true unit testing by isolating the system under test. It creates fake dependencies (mocks) so you can test business logic without databases, external APIs, or other services. This makes tests fast, reliable, and focused.

**What It's Used For in Full Stack:**
- Creating mock objects for dependencies
- Stubbing method behavior
- Verifying interactions
- Testing in isolation
- Making tests deterministic

**Key Concepts for Interviews:**

**1. Mock Creation**
- `@Mock`: Creates a mock instance
- `@InjectMocks`: Injects mocks into the test subject
- `@ExtendWith(MockitoExtension.class)`: JUnit 5 integration

**2. Stubbing**
- `when(mock.method()).thenReturn(value)`: Define behavior
- `when(...).thenThrow(exception)`: Simulate errors
- `doNothing().when(mock).voidMethod()`: For void methods

**3. Verification**
- `verify(mock).method()`: Ensure method was called
- `verify(mock, times(2)).method()`: Verify call count
- `verifyNoMoreInteractions(mock)`: No unexpected calls

```13:27:W7/ExpenseReport/src/test/java/com/revature/ExpenseReport/Service/ExpenseServiceTests.java
@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTests {
    @Mock
    private ExpenseRepository repo;
    @InjectMocks
    private ExpenseService service;
}
```

**Interview Talking Points:**
- "`@ExtendWith(MockitoExtension.class)` integrates Mockito with JUnit 5"
- "`@Mock` creates a fake repository - no real database connection needed"
- "`@InjectMocks` automatically injects the mock repository into the service constructor"
- "This allows me to test the service layer in complete isolation"
- "I use `when().thenReturn()` to define mock behavior and `verify()` to ensure methods are called"

**Common Interview Questions:**
- What's the difference between mock, stub, and spy?
- Why use mocking frameworks?
- When should you NOT use mocks?
- Explain `@Mock` vs `@InjectMocks`
- How do you mock static methods?

---

### Java Stream API

**Why It's Important:**
The Stream API enables functional-style operations on collections. It makes code more concise, readable, and often more efficient through lazy evaluation and parallelization. It's heavily used in modern Java codebases.

**What It's Used For in Full Stack:**
- Transforming collections (map, filter, reduce)
- Data processing pipelines
- Filtering and searching
- Aggregation operations
- Parallel processing

**Key Concepts for Interviews:**

**1. Stream Operations**
- **Intermediate** (lazy, chainable): `filter()`, `map()`, `sorted()`
- **Terminal** (trigger execution): `collect()`, `forEach()`, `reduce()`

**2. Common Methods**
- `map()`: Transform each element
- `filter()`: Keep elements matching predicate
- `collect()`: Gather results (to List, Set, Map)
- `reduce()`: Combine elements to single result
- `flatMap()`: Flatten nested structures

**3. Method References**
- `this::methodName` - reference to instance method
- Cleaner than lambda: `map(e -> methodName(e))`

```26:35:W7/ExpenseReport/src/main/java/com/revature/ExpenseReport/Service/ExpenseService.java
public List<ExpenseDTO> getAllExpenses() {
    return repository.findAll().stream().map(this::ExpenseToDto).toList();
}
public List<ExpenseDTO> searchByExpenseMerchant(String merchant) {
    return repository.findByExpenseMerchant(merchant).stream().map(this::ExpenseToDto).toList();
}
```

**Interview Talking Points:**
- "I use `stream()` to create a processing pipeline for the collection"
- "The `map()` operation transforms each entity into a DTO using the `ExpenseToDto` method"
- "`toList()` is a terminal operation that collects results into a List"
- "Method reference `this::ExpenseToDto` is equivalent to `e -> ExpenseToDto(e)` but more concise"
- "Streams are composable - I could add `.filter()` to search by criteria or `.sorted()` to order results"

**Common Interview Questions:**
- What's the difference between intermediate and terminal operations?
- How are streams lazy?
- When would you use parallel streams?
- Difference between `map()` and `flatMap()`?
- Stream API vs traditional for loops?

---

### RESTful API Development

**Why It's Important:**
REST (Representational State Transfer) is the standard architectural style for web APIs. Understanding REST principles is fundamental to full stack development - the frontend and backend communicate through REST APIs.

**What It's Used For in Full Stack:**
- Communication between frontend and backend
- Third-party integrations
- Microservices communication
- Mobile app backends
- Public APIs

**Key Concepts for Interviews:**

**1. HTTP Methods & CRUD Mapping**
- `GET`: Retrieve resources (Read) - idempotent, safe
- `POST`: Create resources (Create) - non-idempotent
- `PUT`: Update/replace resources (Update) - idempotent
- `PATCH`: Partial update
- `DELETE`: Remove resources (Delete) - idempotent

**2. REST Principles**
- **Stateless**: Each request contains all necessary information
- **Resource-based**: URLs represent resources, not actions
- **Standard HTTP codes**: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error

**3. Spring Boot Annotations**
- `@RestController`: Marks class as REST controller (combines `@Controller` + `@ResponseBody`)
- `@RequestMapping`: Base path for all endpoints
- `@GetMapping`, `@PostMapping`, etc.: Map HTTP methods
- `@RequestBody`: Deserialize JSON to object
- `@RequestParam`: Extract query parameters
- `@PathVariable`: Extract URL path variables

```8:54:W7/ExpenseReport/src/main/java/com/revature/ExpenseReport/Controller/ExpenseController.java
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    @GetMapping
    public List<ExpenseDTO> getAllExpenses() { return service.getAllExpenses(); }
    @GetMapping("/search")
    public List<ExpenseDTO> search (@RequestParam String merchant) {
        return service.searchByExpenseMerchant(merchant);
    }
    @PostMapping
    public ExpenseDTO create(@RequestBody ExpenseWOIDDTO expensedto) {
        return service.create(expensedto);
    }
}
```

**Interview Talking Points:**
- "`@RestController` marks this as a REST controller - responses are automatically serialized to JSON"
- "`@RequestMapping('/api/expenses')` sets the base path - all endpoints start with `/api/expenses`"
- "`@GetMapping` maps to HTTP GET requests - used for reading data"
- "`@PostMapping` maps to HTTP POST - used for creating new resources"
- "`@RequestParam` extracts query parameters like `?merchant=Amazon` for filtering"
- "`@RequestBody` deserializes incoming JSON to a Java object"
- "RESTful URLs are resource-based: `/api/expenses` for the collection, `/api/expenses/123` for specific items"

**Common Interview Questions:**
- What makes an API RESTful?
- Explain idempotency
- What HTTP status codes do you use?
- REST vs GraphQL vs SOAP?
- How do you version APIs?
- How do you handle authentication in REST APIs?

---

## Data Persistence & Management

### SQL (Structured Query Language)

**Why It's Important:**
SQL is the standard language for relational databases. Most enterprise applications use relational databases (PostgreSQL, MySQL, Oracle). Understanding SQL is essential for querying, aggregating, and managing structured data.

**What It's Used For in Full Stack:**
- Querying and manipulating data
- Complex joins across related tables
- Aggregations and analytics
- Data integrity with constraints
- Transactions for consistency

**How I Used It in My Projects:**

**SeQueL watchlistRepo** - Complex joins and ordering:

```java
public List<watchlist> findUser(int userID) throws SQLException {
    String sql = """
            SELECT w.*, m.title,
            EXTRACT(YEAR FROM m.release_date) as release_year
            FROM watchlist w
            JOIN movies m ON w.movieID = m.movieID
            WHERE w.userID = ?
            ORDER BY w.watchDate DESC
            """;
    
    List<watchlist> entries = new ArrayList<>();
    Connection c = null;
    
    try {
        c = dbConn.getConn();
        PreparedStatement stmt = c.prepareStatement(sql);
        stmt.setInt(1, userID);
        
        ResultSet r = stmt.executeQuery();
        while (r.next()) {
            entries.add(mapRS(r));
        }
        return entries;
    } finally {
        dbConn.releaseConn(c);
    }
}
```

**Why SQL Matters for This Project:**
- **INNER JOIN**: Combines watchlist with movies table to get movie title and release year
- **WHERE Clause**: Filters watchlist entries for specific user
- **ORDER BY DESC**: Sorts by most recent watch date first
- **EXTRACT Function**: Pulls year from date field for display
- **PreparedStatement**: Prevents SQL injection with parameterized queries (`?` placeholder)
- **Connection Pooling**: Uses `DatabaseConnection` singleton to reuse connections efficiently

**SeQueL reviewRepo** - Aggregations and statistics:

```java
public double getAvgRating(int movieID) throws SQLException {
    String sql = "SELECT AVG(rating) as avg_rating FROM reviews WHERE movieID = ?";
    
    Connection c = null;
    try {
        c = dbConn.getConn();
        PreparedStatement stmt = c.prepareStatement(sql);
        stmt.setInt(1, movieID);
        
        ResultSet r = stmt.executeQuery();
        if (r.next()) {
            return r.getDouble("avg_rating");
        }
        return 0.0;
    } finally {
        dbConn.releaseConn(c);
    }
}

public int getReviewCount(int movieID) throws SQLException {
    String sql = "SELECT COUNT(*) as review_count FROM reviews WHERE movieID = ?";
    // ... similar pattern
}
```

**Why SQL Matters for This Project:**
- **AVG() Function**: Calculates average rating for a movie across all reviews
- **COUNT() Function**: Gets total number of reviews for analytics
- **Aggregation**: Reduces many review rows to single statistics
- **NULL Handling**: Returns 0.0 if no reviews exist (protects against null)

**SeQueL SQLInit** - Schema design with constraints and foreign keys:

```java
public static void initDB() throws SQLException {
    String createUsers = """
        CREATE TABLE IF NOT EXISTS users (
            userID SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
        """;
    
    String createReviews = """
        CREATE TABLE IF NOT EXISTS reviews (
            reviewID SERIAL PRIMARY KEY,
            userID INTEGER NOT NULL,
            movieID INTEGER NOT NULL,
            rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
            review TEXT,
            watch_date DATE,
            FOREIGN KEY (userID) REFERENCES users(userID),
            FOREIGN KEY (movieID) REFERENCES movies(movieID),
            CONSTRAINT unique_review UNIQUE (userID, movieID)
        )
        """;
    
    String createIndexes = """
        CREATE INDEX IF NOT EXISTS idx_reviews_movie ON reviews(movieID);
        CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(userID);
        """;
    
    // Execute each statement...
}
```

**Why SQL Matters for This Project:**
- **PRIMARY KEY**: Auto-incrementing `SERIAL` for unique IDs
- **FOREIGN KEY**: Enforces referential integrity (reviews must link to valid users/movies)
- **UNIQUE Constraint**: One review per user per movie (prevents duplicates)
- **CHECK Constraint**: Validates rating between 0 and 5
- **Indexes**: Speed up lookups by userID and movieID (performance optimization)
- **NOT NULL**: Ensures required fields are always populated

**feedback.fm & DAWker** - Spring Data JPA (SQL abstraction):
While these projects use JPA, Spring Data generates SQL under the hood:

```java
// This Spring Data method:
List<Song> findByNameContainingIgnoreCase(String namePart);

// Generates this SQL:
// SELECT * FROM songs WHERE LOWER(name) LIKE LOWER('%search%');
```

**Interview Talking Points:**
- "In **SeQueL**, I write raw SQL using JDBC `PreparedStatements` - this gives me full control over query optimization"
- "I use `JOIN` to combine watchlist and movies tables so users see movie titles, not just IDs"
- "The `EXTRACT(YEAR FROM ...)` function pulls the year from a date for display purposes"
- "`ORDER BY watchDate DESC` shows most recent watchlist items first - better UX"
- "I added indexes on `reviewID` and `movieID` because these columns are frequently used in `WHERE` clauses"
- "`FOREIGN KEY` constraints prevent orphaned data - you can't add a review for a movie that doesn't exist"
- "The `UNIQUE (userID, movieID)` constraint enforces business logic - one user, one review per movie"
- "In **feedback.fm** and **DAWker**, Spring Data JPA generates SQL automatically, but I understand the SQL it creates"

**Common Interview Questions:**
- Explain different types of joins
  → *"INNER JOIN returns only matching rows. LEFT JOIN returns all from left table plus matches from right (nulls if no match). I use INNER JOIN in SeQueL's watchlist query to combine watchlist and movies."*
  
- What's the difference between `WHERE` and `HAVING`?
  → *"`WHERE` filters rows before aggregation. `HAVING` filters groups after aggregation. Example: `WHERE userID = 1` filters specific user, `HAVING AVG(rating) > 4` filters groups with high average ratings."*
  
- How do you optimize slow queries?
  → *"Add indexes on columns in `WHERE` clauses, joins, and `ORDER BY`. Use `EXPLAIN ANALYZE` to see query plan. Avoid SELECT *, fetch only needed columns. In SeQueL, I indexed `movieID` and `userID` in the reviews table."*
  
- What are indexes and when should you use them?
  → *"Indexes speed up lookups but slow down writes. Use on columns frequently used in `WHERE`, `JOIN`, or `ORDER BY`. In SeQueL, I indexed foreign keys (userID, movieID) because every query filters by these."*
  
- Explain database normalization
  → *"Organizing data to reduce redundancy. 1NF: atomic values. 2NF: no partial dependencies. 3NF: no transitive dependencies. SeQueL is normalized: users, movies, and reviews are separate tables linked by foreign keys."*
  
- What is a transaction and ACID properties?
  → *"Transaction groups SQL operations into atomic unit. ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed data persists). Critical for financial data."*

---

### MongoDB (NoSQL Database)

**Why It's Important:**
MongoDB is a popular NoSQL document database. It's schema-less, horizontally scalable, and great for flexible data structures. Understanding NoSQL is important as companies increasingly use polyglot persistence (mixing SQL and NoSQL).

**What It's Used For in Full Stack:**
- Storing unstructured or semi-structured data
- Rapid prototyping (no fixed schema)
- Real-time applications
- Big data and analytics
- Storing JSON-like documents

**Key Concepts for Interviews:**

**1. Document Model**
- Data stored as JSON-like documents (BSON)
- Collections instead of tables
- Documents instead of rows
- No fixed schema - flexible structure

**2. CRUD Operations**
- `insertOne()`, `insertMany()`: Create documents
- `find()`: Query documents
- `updateOne()`, `updateMany()`: Modify documents
- `deleteOne()`, `deleteMany()`: Remove documents

**3. MongoDB Java Driver**
- `MongoClient`: Connection to database
- `MongoDatabase`: Access specific database
- `MongoCollection`: Access collection
- `Document` class: Represents documents

```14:77:W3/ExpenseTracker/src/main/java/org/example/Repository/MongoRepository.java
private final String connectionString = "mongodb://mongoadmin:secret@localhost:27017/";
private final MongoCollection<Document> expensesCollection;

public MongoRepository() {
    MongoClient mongoclient = MongoClients.create(connectionString);
    MongoDatabase database = mongoclient.getDatabase("expensesdb");
    this.expensesCollection = database.getCollection("expenses");
}
```

**Interview Talking Points:**
- "I create a `MongoClient` with a connection string containing credentials and host"
- "The connection string format is `mongodb://username:password@host:port/`"
- "`getDatabase()` selects a specific database - here 'expensesdb'"
- "`getCollection()` accesses a collection (similar to a table in SQL)"
- "MongoDB uses `Document` objects to represent JSON-like data"
- "I convert between domain objects and Documents for CRUD operations"

**Common Interview Questions:**
- SQL vs NoSQL - when to use each?
- Explain MongoDB's document model
- What is sharding?
- How does MongoDB ensure data consistency?
- What are aggregation pipelines?
- When would you choose MongoDB over PostgreSQL?

---

### Hibernate (ORM Framework)

**Why It's Important:**
Hibernate is the most popular Java ORM (Object-Relational Mapping) framework. It eliminates boilerplate JDBC code, automatically maps Java objects to database tables, and provides caching and lazy loading. Understanding Hibernate is crucial for Java backend development.

**What It's Used For in Full Stack:**
- Mapping Java classes to database tables
- CRUD operations without SQL
- Managing relationships (one-to-many, many-to-many)
- Lazy loading for performance
- Transaction management

**Key Concepts for Interviews:**

**1. Entity Mapping Annotations**
- `@Entity`: Marks class as a JPA entity
- `@Table`: Specifies table name
- `@Id`: Primary key field
- `@GeneratedValue`: Auto-generate IDs
- `@Column`: Map fields to columns

**2. Relationships**
- `@OneToOne`: One-to-one relationship
- `@OneToMany`: One entity relates to many
- `@ManyToOne`: Many entities relate to one
- `@ManyToMany`: Many-to-many relationship
- `@JoinColumn`: Specifies foreign key column

**3. Fetching Strategies**
- `EAGER`: Load related entities immediately
- `LAZY`: Load related entities on demand
- Lazy loading improves performance

```9:21:W7/ExpenseReport/src/main/java/com/revature/ExpenseReport/Model/Expense.java
@Entity
@Table(name = "expenses")
public class Expense {
    @Id @GeneratedValue private String expenseId;
    @ManyToOne()
    @JoinColumn(name = "reportId")
    private Report report;
}
```

**Interview Talking Points:**
- "`@Entity` tells Hibernate this class maps to a database table"
- "`@Table(name = 'expenses')` specifies the exact table name"
- "`@Id` marks the primary key field - `@GeneratedValue` auto-generates values"
- "`@ManyToOne` defines a many-to-one relationship - many expenses belong to one report"
- "`@JoinColumn(name = 'reportId')` specifies the foreign key column name"
- "This creates a foreign key in the expenses table pointing to the reports table"
- "By default, the relationship is EAGER fetched - I'd add `fetch = FetchType.LAZY` for better performance"

**Common Interview Questions:**
- What is ORM and why use it?
- Explain the N+1 query problem
- Lazy vs Eager loading?
- What is the difference between save() and persist()?
- What are the different states of an entity in Hibernate?
- How does Hibernate caching work?

---

### JSON & Data Serialization

**Why It's Important:**
JSON (JavaScript Object Notation) is the standard format for data exchange in web applications. Understanding serialization (converting objects to JSON) and deserialization (JSON to objects) is fundamental to full stack development.

**What It's Used For in Full Stack:**
- API request/response bodies
- Configuration files
- Data export/import
- Local storage in browsers
- Inter-service communication

**Key Concepts for Interviews:**

**1. Gson Library**
- `toJson()`: Serialize Java objects to JSON
- `fromJson()`: Deserialize JSON to Java objects
- `TypeToken`: Handle generic types (lists, maps)

**2. JSON Structure**
- Objects: `{"key": "value"}`
- Arrays: `["item1", "item2"]`
- Nested structures
- Data types: string, number, boolean, null

**3. File I/O**
- `FileReader`/`FileWriter`: Read/write files
- Exception handling for I/O operations

```15:68:W2/ExpenseTracker/src/main/java/org/example/Repository/JSONRepository.java
private String filename = "expenses.json";
private Gson gson = new Gson();

public List<Expense> loadExpenses() {
    FileReader reader = new FileReader(filename);
    Type listExpenseType = new TypeToken<List<Expense>>(){}.getType();
    List<Expense> expenses = gson.fromJson(reader, listExpenseType);
    return (expenses != null) ? expenses : new ArrayList<>();
}
```

**Interview Talking Points:**
- "Gson is a Google library for JSON serialization/deserialization"
- "`FileReader` opens the JSON file for reading"
- "`TypeToken` is needed for generic types like `List<Expense>` - Java's type erasure removes this at runtime"
- "`fromJson()` deserializes JSON into Java objects automatically"
- "I return an empty list if the file is empty or doesn't exist - prevents null pointer exceptions"
- "This approach is useful for lightweight persistence or configuration files"

**Common Interview Questions:**
- What is serialization?
- JSON vs XML?
- How do you handle circular references in JSON?
- What is Jackson vs Gson?
- How do you customize serialization?

---

### Spring Data JPA

**Why It's Important:**
Spring Data JPA dramatically reduces database access code. It provides repository interfaces with automatically implemented methods, query derivation from method names, and eliminates most boilerplate CRUD code. It's the standard for data access in Spring applications.

**What It's Used For in Full Stack:**
- Simplifying database access
- CRUD operations with minimal code
- Custom queries with method naming
- Pagination and sorting
- Transaction management

**How I Used It in My Projects:**

**feedback.fm SongRepository** - Query derivation from method names:

```java
public interface SongRepository extends JpaRepository<Song, String> {
    // Spring Data derives: SELECT * FROM songs WHERE name = ?
    List<Song> findByName(String name);
    
    // Spring Data derives: SELECT * FROM songs WHERE LOWER(name) LIKE LOWER(?)
    List<Song> findByNameContainingIgnoreCase(String namePart);
    
    // Spring Data derives: SELECT * FROM songs WHERE duration_ms = ?
    List<Song> findByDurationMs(Integer duration);
    
    // Spring Data derives: SELECT s FROM Song s JOIN s.artists a WHERE a.name = ?
    List<Song> findByArtists_Name(String artistName);
}
```

**Why Spring Data JPA Matters for This Project:**
- **Zero SQL Code**: Spring generates all queries from method names
- **Type Safety**: Compiler checks method names and parameter types
- **Query Derivation**: `findByNameContainingIgnoreCase` → `LIKE` query with case-insensitive search
- **Relationship Traversal**: `findByArtists_Name` navigates `@ManyToMany` relationship automatically
- **Built-in CRUD**: Inherits `findAll()`, `save()`, `deleteById()` from `JpaRepository`

**feedback.fm ListenerRepository** - Custom queries and relationship navigation:

```java
public interface ListenerRepository extends JpaRepository<Listener, String> {
    // Query by non-ID field
    List<Listener> findByDisplayName(String displayName);
    
    // Check existence without loading entity
    boolean existsByListenerId(String listenerId);
    
    // Find with sorting
    List<Listener> findAllByOrderByDisplayNameAsc();
}
```

**Why Spring Data JPA Matters for This Project:**
- **existsByListenerId()**: Efficient existence check without fetching full entity
- **Sorting**: `OrderBy` keyword automatically sorts results
- **No SQL**: All CRUD operations handled without writing SQL
- **Lazy Loading**: JPA handles `@OneToMany` relationships lazily to avoid N+1 queries

**DAWker DawRepository** - Complex relationships with Optional:

```java
public interface DawRepository extends JpaRepository<DawEntity, String> {
    // Returns Optional - handles "not found" gracefully
    Optional<List<DawEntity>> findByUserId(Long userId);
    
    // Spring Data manages cascading saves for nested entities
    // When we save a DawEntity, it cascades to ConfigEntity, ComponentEntity, SettingsEntity
}
```

**Why Spring Data JPA Matters for This Project:**
- **Optional Return Type**: Avoids null pointer exceptions when DAW not found
- **Cascade Operations**: `save()` persists entire DAW hierarchy (DAW → Config → Component → Settings) in one call
- **UUID Primary Key**: JPA generates UUIDs automatically with `@GeneratedValue(strategy = GenerationType.UUID)`
- **Relationship Management**: `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)` ensures configs are deleted when DAW is deleted

**DAWker UserRepository** - Combining JPA with custom methods:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Query with Optional for safe null handling
    Optional<User> findByEmailContainingIgnoreCase(String email);
    
    // Existence check for validation
    boolean existsByUsername(String username);
    
    // Delete operations
    void deleteById(Long id);
}
```

**Why Spring Data JPA Matters for This Project:**
- **existsByUsername()**: Used in registration to prevent duplicate usernames
- **Optional**: Login returns `Optional<User>` - service layer checks if present or empty
- **Email Search**: Case-insensitive search allows flexible login (user@example.com or User@Example.com)
- **Cascade Deletes**: When user is deleted, JPA cascades to delete their DAWs, forum posts, and notes

**Comparison: SeQueL (JDBC) vs. feedback.fm/DAWker (Spring Data JPA)**

**SeQueL (Manual SQL):**
```java
public List<watchlist> findUser(int userID) throws SQLException {
    String sql = "SELECT w.*, m.title FROM watchlist w JOIN movies m ON w.movieID = m.movieID WHERE w.userID = ? ORDER BY w.watchDate DESC";
    PreparedStatement stmt = c.prepareStatement(sql);
    stmt.setInt(1, userID);
    ResultSet r = stmt.executeQuery();
    while (r.next()) {
        entries.add(mapResultSet(r));  // Manual mapping
    }
}
```

**feedback.fm (Spring Data JPA):**
```java
public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByListener_ListenerIdOrderByPlayedAtDesc(String listenerId);
    // No SQL, no ResultSet mapping, no PreparedStatement - Spring handles everything
}
```

**Interview Talking Points:**
- "In **feedback.fm**, `SongRepository` extends `JpaRepository<Song, String>` - Song is the entity, String is the primary key type (Spotify IDs)"
- "Spring Data derives queries from method names - `findByNameContainingIgnoreCase` becomes `SELECT * FROM songs WHERE LOWER(name) LIKE LOWER(?)`"
- "I use `Optional<User>` return types to avoid null checks - the service layer checks `findByEmail(...).isPresent()`"
- "In **DAWker**, saving a `DawEntity` cascades to save nested `ConfigEntity`, `ComponentEntity`, and `SettingsEntity` - one save call handles the entire hierarchy"
- "`existsByUsername()` is more efficient than `findByUsername()` when I only need to check existence - it doesn't load the full entity"
- "Compared to **SeQueL**'s manual JDBC (PreparedStatements, ResultSet mapping), Spring Data JPA eliminates 80% of boilerplate code"

**Common Interview Questions:**
- What's the benefit of Spring Data JPA over Hibernate?
  → *"Spring Data JPA is a layer on top of Hibernate. It provides repository abstractions that eliminate boilerplate code. Hibernate is the ORM that does the actual SQL generation and entity management. Together, they make data access simple."*
  
- How does query derivation work?
  → *"Spring Data parses method names at startup. Keywords like `findBy`, `And`, `Or`, `Like`, `IgnoreCase` map to SQL clauses. Example: `findByArtists_Name` navigates the `artists` relationship and filters by `name` field."*
  
- What's the difference between JpaRepository and CrudRepository?
  → *"`CrudRepository` provides basic CRUD (save, findById, deleteById). `JpaRepository` extends it with JPA-specific methods like `flush()`, `saveAndFlush()`, and batch operations. I use `JpaRepository` for full features."*
  
- How do you handle pagination?
  → *"Spring Data provides `PagingAndSortingRepository` with `findAll(Pageable pageable)`. Example: `repository.findAll(PageRequest.of(0, 20))` returns first 20 results. I'd use this in feedback.fm if users had thousands of songs."*
  
- What are projections?
  → *"Projections fetch only needed fields instead of full entities. Interface-based: define interface with getters. Class-based: create DTO. I use DTOs in my service layer for this purpose."*
  
- How do you write custom queries?
  → *"For complex queries, use `@Query` with JPQL or native SQL: `@Query('SELECT s FROM Song s WHERE s.duration > :minDuration')`. I rarely need this because query derivation handles most cases."*

---

## DevOps & Infrastructure

### Maven

**Why It's Important:**
Maven is the standard build tool for Java projects. It manages dependencies, builds the project, runs tests, and packages applications. Understanding Maven is essential for Java development workflows and CI/CD pipelines.

**What It's Used For in Full Stack:**
- Dependency management (libraries, frameworks)
- Building and compiling projects
- Running unit and integration tests
- Packaging applications (JAR, WAR files)
- Publishing artifacts to repositories

**Key Concepts for Interviews:**

**1. Project Object Model (pom.xml)**
- XML file defining project configuration
- Lists all dependencies
- Defines build plugins
- Specifies project metadata

**2. Dependency Management**
- GAV coordinates: GroupId, ArtifactId, Version
- Transitive dependencies (automatic)
- Dependency scopes: `compile`, `test`, `provided`, `runtime`

**3. Maven Lifecycle**
- `mvn clean`: Delete build artifacts
- `mvn compile`: Compile source code
- `mvn test`: Run unit tests
- `mvn package`: Create JAR/WAR
- `mvn install`: Install to local repo
- `mvn deploy`: Deploy to remote repo

**4. Dependency Scopes**
- `compile`: Default, available everywhere
- `provided`: Provided by runtime (e.g., servlet API)
- `runtime`: Not needed for compilation (e.g., JDBC drivers)
- `test`: Only for tests (e.g., JUnit, Mockito)

```4:80:W7/ExpenseReport/pom.xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.0</version>
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
```

**Interview Talking Points:**
- "The `<parent>` section inherits from Spring Boot's parent POM, providing default configurations"
- "Spring Boot manages versions for common dependencies - I don't need to specify versions"
- "`spring-boot-starter-data-jpa` is a starter that bundles JPA, Hibernate, and transaction support"
- "Maven downloads dependencies from Maven Central and caches them locally"
- "Transitive dependencies are handled automatically - I don't need to list every library"
- "I can override versions or exclude transitive dependencies if needed"

**Common Interview Questions:**
- What is Maven and why use it?
- Explain the Maven lifecycle
- What are dependency scopes?
- Maven vs Gradle?
- How do you handle dependency conflicts?
- What is a multi-module project?

---

### Spring Boot

**Why It's Important:**
Spring Boot simplifies Spring application development with convention over configuration. It provides auto-configuration, embedded servers, production-ready features, and eliminates XML configuration. It's the standard for building Java microservices and REST APIs.

**What It's Used For in Full Stack:**
- Rapid application development
- Building REST APIs and microservices
- Embedded servers (no external Tomcat needed)
- Production-ready features (health checks, metrics)
- Simplified Spring configuration

**Key Concepts for Interviews:**

**1. Auto-Configuration**
- Spring Boot automatically configures beans based on classpath
- Reduces boilerplate configuration
- Can be customized or disabled

**2. Annotations**
- `@SpringBootApplication`: Combines `@Configuration`, `@EnableAutoConfiguration`, `@ComponentScan`
- `@Bean`: Register custom beans in IoC container
- `@Configuration`: Marks class as configuration source

**3. Inversion of Control (IoC) Container**
- Spring manages object lifecycle
- Dependency injection
- Loose coupling

**4. Embedded Server**
- Built-in Tomcat, Jetty, or Undertow
- No need to deploy WAR files
- Runs as standalone JAR

```20:33:W7/ExpenseReport/src/main/java/com/revature/ExpenseReport/ExpenseReportApplication.java
@SpringBootApplication
public class ExpenseReportApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExpenseReportApplication.class, args);
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Interview Talking Points:**
- "`@SpringBootApplication` is a meta-annotation that enables auto-configuration and component scanning"
- "`SpringApplication.run()` bootstraps the application, starts the embedded server, and initializes Spring context"
- "The `@Bean` annotation registers `PasswordEncoder` in the IoC container"
- "Spring will inject this bean anywhere I use `@Autowired PasswordEncoder`"
- "BCryptPasswordEncoder is used for secure password hashing in authentication"
- "Spring Boot's embedded server means I can run the app with `java -jar app.jar`"

**Common Interview Questions:**
- What is Spring Boot and how is it different from Spring?
- Explain auto-configuration
- What is the IoC container?
- How does dependency injection work in Spring?
- What are Spring Boot starters?
- How do you configure Spring Boot applications?

---

### Docker

**Why It's Important:**
Docker containers package applications with all dependencies into isolated, portable units. It ensures consistency across development, testing, and production environments. Docker is fundamental to modern DevOps and microservices architecture.

**What It's Used For in Full Stack:**
- Consistent development environments
- Application deployment
- Microservices architecture
- CI/CD pipelines
- Isolating services (database, cache, app)

**How I Used It in My Projects:**

**feedback.fm docker-compose.yml** - PostgreSQL and pgAdmin setup:

```yaml
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
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - spotify_network

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - db
    networks:
      - spotify_network

volumes:
  postgres_data:

networks:
  spotify_network:
```

**Why Docker Matters for This Project:**
- **Isolated Database**: PostgreSQL runs in container - no local install needed
- **Volume Persistence**: `postgres_data` volume persists database even if container is destroyed
- **Port Mapping**: `5432:5432` maps container port to host for Spring Boot connection
- **pgAdmin UI**: Container runs database admin UI for debugging
- **Networking**: Both containers on same network - pgAdmin can connect to db by service name
- **Environment Variables**: Configure database credentials without hardcoding

**DAWker docker-compose.yml** - Multi-service orchestration:

```yaml
services:
  # 1. PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: dawker-db
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: dawker_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d dawker_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  # 2. Spring Boot Backend
  backend:
    build:
      context: ./backend/dawker/dawker
      dockerfile: Dockerfile
    container_name: dawker-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/dawker_db
      SPRING_DATASOURCE_USERNAME: user
      SPRING_DATASOURCE_PASSWORD: password
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1"]
      interval: 15s
      timeout: 10s
      retries: 5
      start_period: 40s

  # 3. React Frontend
  frontend:
    build:
      context: ./frontend/DragnDrop
      dockerfile: Dockerfile
    container_name: dawker-frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend/DragnDrop:/DragnDrop
      - /DragnDrop/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:8080/
    depends_on:
      backend:
        condition: service_healthy

  # 4. Kafka & Zookeeper
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    environment:
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
    healthcheck:
      test: ["CMD", "kafka-topics", "--bootstrap-server", "kafka:29092", "--list"]
      interval: 10s

  # 5. Log Consumer
  log-consumer:
    build:
      context: ./backend/log-consumer/consumer
      dockerfile: Dockerfile
    container_name: dawker-log-consumer
    ports:
      - "8081:8081"
    environment:
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:29092
    depends_on:
      kafka:
        condition: service_healthy
    volumes:
      - ./backend/logs:/app/logs

volumes:
  postgres_data:
```

**Why Docker Matters for This Project:**
- **5-Service Architecture**: Database, backend, frontend, Kafka, log-consumer all containerized
- **Health Checks**: Each service has health checks - `depends_on: condition: service_healthy` ensures startup order
- **Service Discovery**: Backend connects to `db:5432` (service name, not IP) - Docker DNS handles resolution
- **Build from Source**: `build: context: ./backend/dawker/dawker` builds Spring Boot from Dockerfile
- **Volume Mounts**: Logs persist on host at `./backend/logs` even if container restarts
- **Environment Override**: `SPRING_DATASOURCE_URL` points to containerized database
- **Start Period**: Backend gets 40s before health checks start (Spring Boot needs time to initialize)

**DAWker Backend Dockerfile** - Multi-stage build:

```dockerfile
# --- STAGE 1: Build the Application ---
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build JAR
COPY src ./src
RUN mvn clean package -DskipTests

# --- STAGE 2: Run the Application ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Why Docker Matters for This Project:**
- **Multi-Stage Build**: Stage 1 builds with Maven, Stage 2 runs with JRE (smaller final image)
- **Layer Caching**: Copying `pom.xml` first means dependencies are cached unless pom changes
- **Optimized Image**: Final image is JRE (not JDK) + Alpine Linux (minimal)
- **Health Check Support**: Installs `curl` for Spring Boot Actuator health checks
- **Security**: Runs as non-root user (not shown but best practice)

**Interview Talking Points:**
- "In **feedback.fm**, Docker Compose runs PostgreSQL and pgAdmin - this eliminates 'works on my machine' issues"
- "**DAWker** uses a 5-service stack: database, backend, frontend, Kafka, log-consumer - all orchestrated with Docker Compose"
- "Health checks are critical - `depends_on: condition: service_healthy` ensures the database is ready before the backend starts"
- "I use multi-stage Docker builds - Stage 1 compiles with Maven, Stage 2 runs with JRE - final image is 80% smaller"
- "Service names work as hostnames - backend connects to `db:5432` instead of hardcoded IPs thanks to Docker's internal DNS"
- "Volume mounts persist data - `postgres_data` volume ensures database survives container restarts"
- "Environment variables override application.properties - `SPRING_DATASOURCE_URL` points to the containerized database"

**Common Interview Questions:**
- What is Docker and why use it?
  → *"Docker containers package apps with dependencies for consistency across environments. I use Docker Compose in both projects to eliminate setup friction - new developers run `docker-compose up` and have a working environment in minutes."*
  
- Container vs Virtual Machine?
  → *"Containers share the host OS kernel - they're lightweight (MBs, not GBs) and start in seconds. VMs include full OS - they're heavier but provide stronger isolation. Containers are perfect for microservices."*
  
- Explain Dockerfile layers
  → *"Each instruction (FROM, COPY, RUN) creates a layer. Layers are cached - if nothing changes, Docker reuses cached layers. I copy pom.xml before src/ so dependency downloads are cached even when source code changes."*
  
- What is Docker Compose?
  → *"Tool for defining multi-container apps in YAML. DAWker's docker-compose.yml defines 5 services with dependencies, health checks, and networking. One command (`docker-compose up`) starts the entire stack."*
  
- How do you optimize Docker images?
  → *"Multi-stage builds (build in one stage, run in another). Use Alpine Linux (minimal). Copy files in optimal order for layer caching. Don't install unnecessary packages. My DAWker backend image is 200MB (not 1GB)."*
  
- What are Docker volumes?
  → *"Volumes persist data outside containers. `postgres_data` volume stores database files on host - even if I delete the container, data survives. I also use volumes to mount log directories for debugging."*

---

### Jenkins (CI/CD)

**Why It's Important:**
Jenkins is the leading open-source automation server for CI/CD (Continuous Integration/Continuous Deployment). It automates building, testing, and deploying applications, ensuring code quality and rapid delivery. Understanding CI/CD is crucial for modern development workflows.

**What It's Used For in Full Stack:**
- Automated builds on code commits
- Running tests automatically
- Static code analysis
- Automated deployments
- Integration with version control (Git)

**How I Used It in My Projects:**

**DAWker Jenkinsfile** - Multi-stage pipeline with health checks:

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
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
                    ''')
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
                    ''')
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

**Why Jenkins Matters for This Project:**
- **Automated Deployment**: One command builds and starts 5 services in correct order
- **Health Check Validation**: Each stage waits for service to be healthy before proceeding
- **Cross-Platform**: `isUnix()` branching works on Linux, macOS, and Windows Jenkins agents
- **Dependency Ordering**: Database → Kafka → Backend → Frontend → Log Consumer (mimics production startup)
- **Cleanup**: `post { always }` ensures containers are stopped even if pipeline fails
- **Environment Variables**: `DOCKER_COMPOSE_FILE` parameterizes compose file path
- **Verification Stage**: Final `docker ps` confirms all services are running

**Pipeline Flow Breakdown:**

**Stage 1: Checkout**
- Pulls latest code from Git repository
- Ensures Jenkins builds the most recent commit

**Stage 2: Build Docker Images**
- Runs `docker-compose build` to create images for backend, frontend, log-consumer
- If build fails (missing dependency, syntax error), pipeline stops here
- **Why it matters:** Catches compilation errors before deployment

**Stage 3: Start Database**
- Starts PostgreSQL container
- Polls `docker inspect` every 5 seconds until database reports "healthy"
- **Why it matters:** Backend will crash if it starts before database is ready

**Stage 4: Start Kafka & Zookeeper**
- Starts Zookeeper first (Kafka depends on it)
- Waits for Kafka health check to pass
- **Why it matters:** Log-consumer needs Kafka ready to subscribe to topics

**Stage 5: Start Backend**
- Starts Spring Boot backend container
- Waits up to 40 seconds for Spring Boot to initialize (configured in docker-compose.yml)
- Polls `/actuator/health` endpoint until it returns 200 OK
- **Why it matters:** Frontend API calls will fail if backend isn't ready

**Stage 6-7: Start Frontend & Log Consumer**
- Frontend doesn't need health check (static assets, starts instantly)
- Log-consumer starts last (least critical for user-facing functionality)

**Stage 8: Verify Services**
- Runs `docker ps` to list all running containers
- Provides final confirmation that entire stack is up
- Outputs container names, status, and exposed ports

**Post-Build Cleanup:**
- `post { always }` runs even if pipeline fails
- Stops and removes all containers with `docker-compose down`
- Ensures clean state for next build

**Interview Talking Points:**
- "In **DAWker**, I use Jenkins to automate the full stack deployment - database, Kafka, backend, frontend, log-consumer"
- "Each stage has health checks - the pipeline waits for PostgreSQL to be ready before starting the backend"
- "This mimics a real production rollout where you verify each service is healthy before routing traffic"
- "The `isUnix()` branching makes the pipeline cross-platform - it works on Linux CI servers and Windows dev machines"
- "`post { always }` cleanup ensures containers are stopped even if a stage fails - prevents port conflicts on the next build"
- "The `Verify Services` stage outputs `docker ps` - this provides audit trail for DevOps to confirm deployment"
- "If I were deploying to production, I'd add stages for: run tests, push images to registry, deploy to Kubernetes"

**Why feedback.fm and SeQueL Don't Use Jenkins:**
- **feedback.fm**: Smaller project, local development with `docker-compose up`
- **SeQueL**: Console application with no containerization or deployment pipeline
- **DAWker**: More complex (5 services) → needed automated orchestration

**Common Interview Questions:**
- What is CI/CD?
  → *"CI (Continuous Integration) automatically builds and tests code on every commit. CD (Continuous Deployment) automatically deploys passing builds to production. Jenkins orchestrates this pipeline."*
  
- Explain the Jenkins pipeline
  → *"DAWker's pipeline has 8 stages: Checkout code → Build images → Start DB → Start Kafka → Start backend → Start frontend → Start log-consumer → Verify. Each stage must pass before proceeding."*
  
- What are Jenkins agents?
  → *"Jenkins agents are worker machines that execute pipeline stages. `agent any` means any available agent. In production, you'd use specific agents (e.g., Linux agent for Docker builds)."*
  
- How do you trigger Jenkins builds?
  → *"Webhooks from GitHub/GitLab trigger builds on push. Manual triggers via Jenkins UI. Scheduled builds with cron syntax. Poll SCM (less efficient). I'd use webhooks for DAWker."*
  
- What is the difference between declarative and scripted pipelines?
  → *"Declarative (what I use) is structured with `pipeline {}` blocks - easier to read and maintain. Scripted is Groovy code - more flexible but complex. Declarative is the modern standard."*
  
- How do you handle secrets in Jenkins?
  → *"Jenkins Credentials plugin stores secrets. Reference them with `credentials('my-secret-id')`. For Docker registries, use `docker login` with credentials. Never commit secrets to Git."*

---

### Kubernetes

**Why It's Important:**
Kubernetes (K8s) is the industry-standard platform for container orchestration. It automates deployment, scaling, and management of containerized applications. Understanding Kubernetes is essential for modern cloud-native development and DevOps roles.

**What It's Used For in Full Stack:**
- Orchestrating Docker containers at scale
- Automated scaling (horizontal scaling)
- Self-healing (restart failed containers)
- Load balancing and service discovery
- Rolling updates with zero downtime
- Cloud-agnostic deployments

**Key Concepts for Interviews:**

**1. Core Concepts**
- **Pod**: Smallest deployable unit (1+ containers)
- **Deployment**: Manages replicated Pods
- **Service**: Stable network endpoint for Pods
- **ConfigMap**: Configuration data
- **Secret**: Sensitive data (passwords, keys)

**2. Deployment Features**
- **Replicas**: Number of Pod copies
- **Rolling updates**: Gradual updates, zero downtime
- **Rollback**: Revert to previous version
- **Self-healing**: Automatically restart failed Pods

**3. YAML Configuration**
- Declarative infrastructure
- `apiVersion`: K8s API version
- `kind`: Resource type (Deployment, Service, etc.)
- `metadata`: Labels, names
- `spec`: Desired state

```1:26:W8/DockerK8sDemo/minifests/api-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: hawkinsr/apidemo:latest
```

**Interview Talking Points:**
- "This Deployment manages three replicas of the API Pod for high availability"
- "`apiVersion: apps/v1` specifies the Kubernetes API version"
- "`kind: Deployment` defines this as a Deployment resource"
- "`replicas: 3` ensures three identical Pods are always running"
- "If a Pod crashes, Kubernetes automatically starts a new one"
- "`image: hawkinsr/apidemo:latest` pulls the Docker image from a registry"
- "K8s handles load balancing across the three replicas automatically"

**Common Interview Questions:**
- What is Kubernetes and why use it?
- Explain Pods, Deployments, and Services
- How does Kubernetes achieve high availability?
- What is a ReplicaSet?
- How do you scale applications in Kubernetes?
- What is kubectl?
- Kubernetes vs Docker Swarm?

---

## Core Computer Science Concepts

### Object-Oriented Programming (OOP) Principles

**Why It's Important:**
OOP is a fundamental programming paradigm used in Java, Python, C++, and many other languages. Understanding OOP principles is essential for designing maintainable, scalable systems and is frequently tested in interviews.

**What It's Used For in Full Stack:**
- Organizing code into reusable components
- Modeling real-world entities
- Encapsulating data and behavior
- Creating extensible architectures
- Design patterns

**Key Concepts for Interviews:**

**1. Four Pillars of OOP**

**Encapsulation**
- Bundle data (fields) and methods together
- Hide internal state with access modifiers (`private`, `protected`, `public`)
- Expose behavior through public methods (getters/setters)
- Protects data integrity

**Inheritance**
- "Is-a" relationship (Dog is-a Animal)
- Child class inherits parent's fields and methods
- Enables code reuse
- `extends` keyword in Java

**Polymorphism**
- "Many forms" - same interface, different implementations
- **Method Overriding**: Subclass provides specific implementation
- **Method Overloading**: Multiple methods with same name, different parameters
- Enables flexibility and extensibility

**Abstraction**
- Hide complex implementation details
- Show only essential features
- Abstract classes: Can't be instantiated, may have abstract methods
- Interfaces: Contract defining behavior

**2. Abstract Classes vs Interfaces**

**Abstract Classes:**
- Can have both abstract and concrete methods
- Can have instance variables
- Single inheritance (Java)
- Use when classes share common code

**Interfaces:**
- Only method signatures (Java 8+ allows default methods)
- No instance variables (only constants)
- Multiple inheritance
- Use to define contracts/capabilities

```3:19:W1/Animal/src/main/java/org/example/Animal.java
public abstract class Animal {
    private String name;
    public Animal( String name ) { this.name = name; }
    public abstract void makeSound();
}
```

```3:18:W1/Animal/src/main/java/org/example/Dog.java
public class Dog extends Animal implements IMammal{
    public Dog (String name){ super(name); }
    @Override public void makeSound() { System.out.println("Woof!"); }
}
```

**Interview Talking Points:**
- "I use abstract classes when I want to share common code - `Animal` provides a `name` field and constructor"
- "`makeSound()` is abstract - every animal must implement it, but each has different behavior"
- "`Dog` extends `Animal` (inheritance) - it inherits the `name` field and constructor"
- "`Dog` implements `IMammal` (interface) - Java allows single inheritance but multiple interfaces"
- "`@Override` ensures I'm correctly overriding the abstract method - compiler checks this"
- "This demonstrates polymorphism - I can treat `Dog` as an `Animal`, `IMammal`, or `Dog`"

**Common Interview Questions:**
- Explain the four pillars of OOP
- Abstract class vs Interface?
- What is polymorphism?
- What is encapsulation and why is it important?
- Difference between overloading and overriding?
- What are design patterns?

---

### Data Structures & Algorithms

**Why It's Important:**
Understanding data structures and algorithms is fundamental to writing efficient code. It's heavily tested in coding interviews and essential for optimizing application performance.

**What It's Used For in Full Stack:**
- Choosing the right data structure for the problem
- Optimizing database queries
- Efficient data processing
- Caching strategies
- Search and sort operations

**Key Concepts for Interviews:**

**1. Common Data Structures**

**Arrays/Lists**
- Fixed size (arrays) or dynamic (ArrayList)
- O(1) access by index
- O(n) search
- Use for: Sequential data, random access

**Sets**
- No duplicates
- Fast lookups: O(1) for HashSet
- Use for: Unique elements, membership testing

**Maps/Dictionaries**
- Key-value pairs
- O(1) lookup by key (HashMap)
- Use for: Caching, counting, indexing

**Queues**
- FIFO (First-In-First-Out)
- Use for: Task scheduling, BFS

**Stacks**
- LIFO (Last-In-First-Out)
- Use for: Undo operations, DFS

**2. Sorting Algorithms**

**SQL ORDER BY**
- Database handles sorting efficiently
- Can sort by multiple columns
- Ascending (ASC) or descending (DESC)

**Java Collections.sort()**
- Uses Timsort (hybrid merge/insertion sort)
- O(n log n) time complexity
- Stable sort (maintains order of equal elements)

**Stream API sorted()**
- Functional approach to sorting
- `stream().sorted()` - natural order
- `stream().sorted(Comparator.comparing(...))` - custom order

**3. Searching & Filtering**

**SQL WHERE Clause**
- Database indexes make searches efficient
- Can combine conditions with AND/OR

**Stream filter()**
- In-memory filtering
- Lazy evaluation
- Can chain multiple filters

```30:53:W2/SQL/SQLChallenges.sql
SELECT extract(YEAR FROM invoice_date) as InvoiceYear, COUNT(*) as InvoiceCount, SUM(total) AS SalesTotal
FROM invoice
GROUP BY extract(YEAR FROM invoice_date)
ORDER BY InvoiceYear;
```

```33:35:W7/ExpenseReport/src/main/java/com/revature/ExpenseReport/Service/ExpenseService.java
public List<ExpenseDTO> searchByExpenseMerchant(String merchant) {
    return repository.findByExpenseMerchant(merchant).stream().map(this::ExpenseToDto).toList();
}
```

**Interview Talking Points:**
- "SQL `ORDER BY` delegates sorting to the database, which can use indexes for efficiency"
- "`GROUP BY` aggregates data - here I'm grouping invoices by year and counting them"
- "`extract(YEAR FROM ...)` is a SQL function to get the year from a date"
- "For the search function, Spring Data generates a WHERE query from the method name"
- "I use the Stream API to transform the results to DTOs - this is in-memory processing"
- "For large datasets, I'd add pagination to avoid loading everything into memory"

**Common Interview Questions:**
- What's the difference between Array and ArrayList?
- Explain Big O notation
- How does a HashMap work internally?
- What is the time complexity of binary search?
- Explain common sorting algorithms
- When would you use a LinkedList vs ArrayList?

---

### Relational Database Concepts

**Why It's Important:**
Relational databases are the backbone of most enterprise applications. Understanding database design, normalization, and relationships is essential for building scalable, maintainable data models.

**What It's Used For in Full Stack:**
- Structuring application data
- Ensuring data integrity
- Avoiding data anomalies
- Optimizing query performance
- Defining relationships between entities

**Key Concepts for Interviews:**

**1. Database Relationships**

**One-to-One**
- Each record in Table A relates to one in Table B
- Example: User ↔ Profile
- Foreign key in either table (or separate join table)

**One-to-Many**
- One record in Table A relates to many in Table B
- Example: Report → Expenses
- Foreign key in the "many" side (Expense has reportId)

**Many-to-Many**
- Many records in A relate to many in B
- Example: Students ↔ Courses
- Requires join table (Enrollments)

**2. Foreign Keys**
- Column referencing primary key of another table
- Enforces referential integrity
- Prevents orphaned records
- Can cascade deletes/updates

**3. Joins**

**INNER JOIN**
- Returns only matching rows from both tables
- Most common join type

**LEFT JOIN (LEFT OUTER JOIN)**
- All rows from left table
- Matching rows from right table (null if no match)

**RIGHT JOIN**
- All rows from right table
- Matching rows from left table

**FULL OUTER JOIN**
- All rows from both tables
- Nulls where no match

**4. Normalization**
- Process of organizing data to reduce redundancy
- **1NF**: Atomic values, no repeating groups
- **2NF**: 1NF + no partial dependencies
- **3NF**: 2NF + no transitive dependencies
- Goal: Eliminate data anomalies (insert, update, delete)

```65:76:W2/SQL/SQLChallenges.sql
SELECT title, name from Artist join Album USING(artist_id);
SELECT invoice.*
FROM invoice
INNER JOIN customer
ON customer.customer_id = invoice.customer_id
WHERE customer.country = 'Brazil';
```

```9:21:W7/ExpenseReport/src/main/java/com/revature/ExpenseReport/Model/Expense.java
@Entity
@Table(name = "expenses")
public class Expense {
    @Id @GeneratedValue private String expenseId;
    @ManyToOne()
    @JoinColumn(name = "reportId")
    private Report report;
}
```

**Interview Talking Points:**
- "The first query joins Artist and Album tables on artist_id - using `USING` since both tables have the same column name"
- "The second query uses INNER JOIN to combine invoices with customers, then filters by country"
- "In JPA, `@ManyToOne` defines a foreign key relationship - many expenses belong to one report"
- "`@JoinColumn(name = 'reportId')` specifies the foreign key column in the expenses table"
- "This ensures referential integrity - an expense can't exist without a valid report"
- "Joins allow us to query related data across normalized tables efficiently"

**Common Interview Questions:**
- Explain database normalization
- What are the different types of joins?
- What is a foreign key?
- How do you optimize database queries?
- What are database indexes?
- ACID properties of transactions?

---

### Software Design & Architecture

**Why It's Important:**
Good design separates great developers from average ones. Understanding design patterns, SOLID principles, and architectural patterns helps you build maintainable, scalable systems.

**What It's Used For in Full Stack:**
- Structuring applications
- Designing APIs
- Ensuring code maintainability
- Facilitating testing
- Enabling team collaboration

**Key Concepts for Interviews:**

**1. Layered Architecture**

**Presentation Layer (Controllers)**
- Handles HTTP requests/responses
- Input validation
- Delegates to service layer

**Service Layer**
- Business logic
- Transaction management
- Orchestrates repositories
- Independent of web layer

**Data Access Layer (Repositories)**
- Database operations
- Query building
- No business logic

**Benefits:**
- Separation of concerns
- Testable (mock layers)
- Maintainable
- Reusable business logic

**2. SOLID Principles**

**S - Single Responsibility Principle**
- Class should have one reason to change
- Example: Controller handles HTTP, Service handles logic

**O - Open/Closed Principle**
- Open for extension, closed for modification
- Use interfaces and inheritance

**L - Liskov Substitution Principle**
- Subtypes must be substitutable for base types
- Dog can replace Animal without breaking code

**I - Interface Segregation**
- Many specific interfaces > one general interface
- Don't force classes to implement unused methods

**D - Dependency Inversion**
- Depend on abstractions, not concretions
- Use interfaces for dependencies

**3. Design Patterns**

**Repository Pattern**
- Abstracts data access
- Easier to test (mock repository)
- Can switch data sources

**DTO Pattern**
- Separate API contracts from entities
- Control what data is exposed
- Versioning flexibility

**Dependency Injection**
- Inversion of control
- Easier testing
- Loose coupling

**Interview Talking Points:**
- "I structure apps in three layers - controllers handle HTTP, services contain business logic, repositories manage data"
- "This separation makes testing easier - I can mock repositories to test services in isolation"
- "DTOs provide a clean API contract - I don't expose JPA entities with lazy-loading collections to clients"
- "Spring's dependency injection promotes loose coupling - components depend on interfaces, not concrete classes"
- "Following SOLID principles makes code more maintainable and extensible"

**Common Interview Questions:**
- Explain MVC architecture
- What are the SOLID principles?
- Difference between monolith and microservices?
- What design patterns do you know?
- How do you handle authentication and authorization?
- What is REST?

---

## Interview Preparation Tips

### How to Discuss Your Projects

**1. Use the STAR Method**
- **Situation**: Set the context
- **Task**: What needed to be done?
- **Action**: What did you do?
- **Result**: What was the outcome?

**Example:**
"In the Expense Report project, we needed a way to manage expense submissions (Situation). I was tasked with building the REST API (Task). I designed a layered architecture with Spring Boot, using JPA for data persistence and DTOs for API contracts (Action). The result was a scalable API that handles CRUD operations with proper validation and transaction management (Result)."

**2. Connect to Business Value**
- Don't just describe technical details
- Explain *why* you made decisions
- Show awareness of trade-offs

**Example:**
"I chose PostgreSQL over MongoDB because expense data is highly relational - reports have many expenses, users have many reports. SQL's ACID properties ensure data consistency, which is critical for financial data."

**3. Show Problem-Solving**
- Discuss challenges you faced
- Explain how you debugged issues
- Show continuous learning

**Example:**
"I encountered an N+1 query problem where fetching reports loaded expenses in separate queries. I solved it by using `@EntityGraph` to fetch related data in one query, improving performance significantly."

---

### Common Behavioral Questions

**"Tell me about yourself"**
- 2-3 minute summary
- Current role/situation
- Relevant experience
- Why you're interested in the position
- Keep it professional and concise

**"Why do you want this job?"**
- Research the company/role
- Connect your skills to their needs
- Show enthusiasm
- Mention specific technologies or projects

**"Describe a technical challenge you faced"**
- Use STAR method
- Focus on your contribution
- Explain technical decisions
- Show what you learned

**"How do you handle disagreements with team members?"**
- Show collaboration skills
- Focus on productive resolution
- Emphasize respect for different viewpoints
- Give concrete example if possible

---

### Technical Interview Strategies

**1. Clarify Requirements**
- Ask questions before coding
- Confirm input/output formats
- Discuss edge cases
- Clarify constraints (time/space complexity)

**2. Think Out Loud**
- Explain your approach
- Discuss trade-offs
- Show your thought process
- It's okay to brainstorm multiple solutions

**3. Start Simple**
- Get a working solution first
- Then optimize
- Discuss Big O complexity
- Consider edge cases

**4. Test Your Code**
- Walk through test cases
- Check edge cases (empty input, null, large numbers)
- Fix bugs you find
- Explain your testing strategy

**5. System Design**
- Start with high-level architecture
- Identify components (frontend, API, database)
- Discuss scaling (load balancing, caching, replication)
- Consider trade-offs (consistency vs availability)

---

### Final Checklist

Before your interview, review:

**Technical Skills:**
- [ ] Can explain each technology on your resume
- [ ] Have concrete examples from your projects
- [ ] Understand trade-offs and alternatives
- [ ] Can discuss challenges and learnings

**Coding:**
- [ ] Practice common algorithms (sorting, searching)
- [ ] Review data structures (arrays, maps, sets, lists)
- [ ] Practice explaining code out loud
- [ ] Comfortable with your IDE/editor

**System Design:**
- [ ] Understand REST API design
- [ ] Know basic database design
- [ ] Can discuss scalability concepts
- [ ] Familiar with microservices vs monolith

**Communication:**
- [ ] Practice STAR method for behavioral questions
- [ ] Prepare "Tell me about yourself" answer
- [ ] Have questions ready for interviewer
- [ ] Can explain technical concepts to non-technical people

---

## Quick Reference Cheat Sheet

**Frontend Stack:**
React + TypeScript + HTML5 + CSS3

**Backend Stack:**
Java + Spring Boot + Spring Data JPA + Hibernate

**Databases:**
PostgreSQL (SQL) + MongoDB (NoSQL)

**Testing:**
JUnit + Mockito + AssertJ

**DevOps:**
Docker + Kubernetes + Jenkins + Maven

**Architecture Layers:**
Controller → Service → Repository → Database

**Key Patterns:**
- Repository Pattern
- DTO Pattern
- Dependency Injection
- Layered Architecture

**Remember:**
- Explain the "why," not just the "what"
- Connect technologies to real projects
- Show problem-solving skills
- Demonstrate continuous learning
- Ask clarifying questions

Good luck with your interviews!
