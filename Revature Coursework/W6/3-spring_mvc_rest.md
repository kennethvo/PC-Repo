# Week 6 - Wednesday: Spring MVC & RESTful Services

## 1. Overview of Spring MVC & Architecture

### What is Spring MVC?

**Spring MVC** is a web framework built on the Servlet API that follows the Model-View-Controller pattern.

### MVC Components

| Component | Responsibility | Spring Implementation |
|-----------|---------------|----------------------|
| **Model** | Business data and logic | POJOs, Services |
| **View** | Presentation/UI | Thymeleaf, JSP, JSON |
| **Controller** | Handle requests, coordinate | @Controller, @RestController |

### Spring MVC Architecture

```
                              ┌─────────────────┐
                              │   Client        │
                              │  (Browser/App)  │
                              └────────┬────────┘
                                       │ HTTP Request
                                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                         Spring MVC                                │
│  ┌─────────────────────┐                                         │
│  │  DispatcherServlet  │◄──────── Front Controller               │
│  │  (Central Entry)    │                                         │
│  └──────────┬──────────┘                                         │
│             │                                                     │
│             ▼                                                     │
│  ┌─────────────────────┐                                         │
│  │   HandlerMapping    │  "Which controller handles /users?"     │
│  └──────────┬──────────┘                                         │
│             │                                                     │
│             ▼                                                     │
│  ┌─────────────────────┐    ┌──────────────┐                    │
│  │    Controller       │───▶│   Service    │                    │
│  │  (@Controller)      │    │   Layer      │                    │
│  └──────────┬──────────┘    └──────────────┘                    │
│             │                                                     │
│             ▼                                                     │
│  ┌─────────────────────┐                                         │
│  │   ViewResolver      │  (For MVC) "home" → /WEB-INF/home.jsp  │
│  └──────────┬──────────┘                                         │
│             │                                                     │
│             ▼                                                     │
│  ┌─────────────────────┐                                         │
│  │ View / JSON Response│  (For REST) Direct JSON/XML            │
│  └─────────────────────┘                                         │
└──────────────────────────────────────────────────────────────────┘
```

### Request Flow (Step by Step)

1. Client sends HTTP request (e.g., `GET /api/users/1`)
2. **DispatcherServlet** receives all requests
3. **HandlerMapping** finds the appropriate controller method
4. **HandlerAdapter** invokes the controller method
5. Controller processes request, calls service layer
6. Controller returns response (Model+View or ResponseBody)
7. **ViewResolver** (MVC) or **HttpMessageConverter** (REST) prepares response
8. Response sent back to client

---

## 2. Request Handling

### The DispatcherServlet

The **DispatcherServlet** is the front controller that dispatches requests to handlers.

**Auto-configured in Spring Boot** - no setup needed!

### Handler Methods

Handler methods are annotated methods in controllers that process specific requests.

```java
@Controller
public class UserController {
    
    @GetMapping("/users")
    public String listUsers(Model model) {
        // Handler method
        model.addAttribute("users", userService.findAll());
        return "users/list";  // View name
    }
}
```

---

## 3. Controllers and @Controller

### @Controller Annotation

Used for traditional MVC applications that return views.

```java
@Controller
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public String listUsers(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        return "users/list";  // Returns view name "users/list"
    }
    
    @GetMapping("/{id}")
    public String showUser(@PathVariable Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        return "users/show";
    }
    
    @GetMapping("/new")
    public String newUserForm(Model model) {
        model.addAttribute("user", new User());
        return "users/form";
    }
    
    @PostMapping
    public String createUser(@ModelAttribute User user) {
        userService.save(user);
        return "redirect:/users";  // Redirect after POST
    }
}
```

### @RestController Annotation

Combines `@Controller` + `@ResponseBody` for REST APIs.

```java
@RestController
@RequestMapping("/api/users")
public class UserRestController {
    
    private final UserService userService;
    
    public UserRestController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();  // Returns JSON directly
    }
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);  // Returns JSON
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);  // Receives/returns JSON
    }
}
```

### @Controller vs @RestController

| Aspect | @Controller | @RestController |
|--------|-------------|-----------------|
| **Purpose** | Web MVC (HTML views) | REST APIs (JSON/XML) |
| **Return Type** | View name (String) | Response body (Object) |
| **@ResponseBody** | Required for JSON | Implicit (included) |
| **Content Type** | text/html | application/json |
| **Use Case** | Server-rendered pages | API endpoints |

---

## 4. @RequestMapping MVC Annotations

### @RequestMapping

The base annotation for mapping HTTP requests.

```java
@Controller
@RequestMapping("/products")  // Class-level prefix
public class ProductController {
    
    @RequestMapping(method = RequestMethod.GET)
    public String listProducts() {
        return "products/list";
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String showProduct(@PathVariable Long id) {
        return "products/show";
    }
    
    @RequestMapping(
        value = "/search",
        method = RequestMethod.GET,
        params = "category",  // Requires ?category=xxx
        produces = "application/json"
    )
    @ResponseBody
    public List<Product> searchByCategory(@RequestParam String category) {
        return productService.findByCategory(category);
    }
}
```

### RequestMapping Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `value` / `path` | URL pattern | `"/users/{id}"` |
| `method` | HTTP method | `RequestMethod.GET` |
| `params` | Required parameters | `"category"` |
| `headers` | Required headers | `"Accept=application/json"` |
| `consumes` | Request Content-Type | `"application/json"` |
| `produces` | Response Content-Type | `"application/json"` |

---

## 5. HTTP Method Annotations

### Shortcut Annotations (Preferred)

| Annotation | HTTP Method | Use Case |
|------------|-------------|----------|
| `@GetMapping` | GET | Retrieve resource |
| `@PostMapping` | POST | Create resource |
| `@PutMapping` | PUT | Update (full) resource |
| `@PatchMapping` | PATCH | Update (partial) resource |
| `@DeleteMapping` | DELETE | Delete resource |

### Complete CRUD Example

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    // CREATE
    @PostMapping
    public ResponseEntity<Product> create(@RequestBody @Valid ProductDTO dto) {
        Product product = productService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    
    // READ (all)
    @GetMapping
    public List<Product> getAll() {
        return productService.findAll();
    }
    
    // READ (one)
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.findById(id);
    }
    
    // UPDATE (full)
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody @Valid ProductDTO dto) {
        return productService.update(id, dto);
    }
    
    // UPDATE (partial)
    @PatchMapping("/{id}")
    public Product partialUpdate(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return productService.partialUpdate(id, updates);
    }
    
    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 6. Path Variables and Request Params

### @PathVariable

Extract values from the URL path.

```java
// URL: GET /api/users/123
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userService.findById(id);
}

// Multiple path variables: GET /api/orders/456/items/789
@GetMapping("/orders/{orderId}/items/{itemId}")
public OrderItem getOrderItem(
        @PathVariable Long orderId,
        @PathVariable Long itemId) {
    return orderService.findItem(orderId, itemId);
}

// Different variable name
@GetMapping("/users/{userId}")
public User getUser(@PathVariable("userId") Long id) {
    return userService.findById(id);
}

// Optional path variable (Spring 4.3.3+)
@GetMapping({"/users", "/users/{id}"})
public Object getUsers(@PathVariable(required = false) Long id) {
    if (id == null) {
        return userService.findAll();
    }
    return userService.findById(id);
}
```

### @RequestParam

Extract query parameters from the URL.

```java
// URL: GET /api/users?page=1&size=20
@GetMapping("/users")
public List<User> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    return userService.findAll(PageRequest.of(page, size));
}

// Required parameter: GET /api/search?q=spring
@GetMapping("/search")
public List<Product> search(@RequestParam String q) {
    return productService.search(q);
}

// Optional parameter
@GetMapping("/products")
public List<Product> getProducts(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice) {
    return productService.filter(category, minPrice, maxPrice);
}

// Multiple values: GET /api/users?ids=1,2,3
@GetMapping("/users")
public List<User> getUsersByIds(@RequestParam List<Long> ids) {
    return userService.findByIds(ids);
}
```

### Comparison

| Aspect | @PathVariable | @RequestParam |
|--------|---------------|---------------|
| **Location** | URL path | Query string |
| **Example** | `/users/123` | `/users?id=123` |
| **Required** | Yes (by default) | Yes (by default) |
| **Best For** | Resource identifiers | Filtering, pagination |

---

## 7. Validation

### Bean Validation (JSR-380)

Add validation dependency:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### Validation Annotations

| Annotation | Purpose |
|------------|---------|
| `@NotNull` | Not null |
| `@NotBlank` | Not null, not empty, not whitespace |
| `@NotEmpty` | Not null, not empty |
| `@Size(min, max)` | String/collection size |
| `@Min`, `@Max` | Numeric bounds |
| `@Email` | Valid email format |
| `@Pattern` | Regex pattern |
| `@Past`, `@Future` | Date constraints |
| `@Positive`, `@Negative` | Numeric sign |

### DTO with Validation

```java
public class UserDTO {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be 3-50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
        message = "Password must contain uppercase, lowercase, and digit"
    )
    private String password;
    
    @Min(value = 0, message = "Age must be positive")
    @Max(value = 150, message = "Age must be realistic")
    private Integer age;
    
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;
    
    // Getters and setters
}
```

### Validating in Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDTO dto) {
        // @Valid triggers validation
        // If validation fails, MethodArgumentNotValidException is thrown
        User user = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO dto) {
        return userService.update(id, dto);
    }
}
```

### Custom Validator

```java
// Custom annotation
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Validator implementation
@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    
    private final UserRepository userRepository;
    
    public UniqueEmailValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return email != null && !userRepository.existsByEmail(email);
    }
}

// Usage
public class UserDTO {
    @UniqueEmail
    private String email;
}
```

---

## 8. Request Body and @RequestBody Annotation

### @RequestBody

Binds the HTTP request body to a Java object (usually JSON).

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        // JSON body automatically converted to OrderRequest
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }
}
```

**Request**:
```json
POST /api/orders
Content-Type: application/json

{
    "userId": 123,
    "items": [
        {"productId": 1, "quantity": 2},
        {"productId": 5, "quantity": 1}
    ],
    "shippingAddress": "123 Main St"
}
```

### @ResponseBody

Writes the return value directly to the response body (implicit in @RestController).

```java
@Controller
public class ApiController {
    
    @GetMapping("/api/data")
    @ResponseBody  // Required with @Controller
    public Data getData() {
        return new Data("value");  // Converted to JSON
    }
}

// With @RestController, @ResponseBody is implicit
@RestController
public class ApiController {
    
    @GetMapping("/api/data")
    public Data getData() {
        return new Data("value");  // Automatically JSON
    }
}
```

### HttpMessageConverters

Spring uses **HttpMessageConverters** to convert request/response bodies.

| Content-Type | Converter | Library |
|--------------|-----------|---------|
| `application/json` | `MappingJackson2HttpMessageConverter` | Jackson |
| `application/xml` | `Jaxb2RootElementHttpMessageConverter` | JAXB |
| `text/plain` | `StringHttpMessageConverter` | Built-in |

---

## 9. ResponseEntity Class

### What is ResponseEntity?

**ResponseEntity** represents the entire HTTP response: status code, headers, and body.

### Basic Usage

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    // Return with specific status
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO dto) {
        User user = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    // Return 204 No Content
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // Return 404 Not Found
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // With custom headers
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        FileData file = fileService.getFile(id);
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + file.getName() + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(file.getSize())
            .body(file.getData());
    }
    
    // With location header (for created resources)
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO dto) {
        User user = userService.create(dto);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(user.getId())
            .toUri();
        
        return ResponseEntity.created(location).body(user);
    }
}
```

### ResponseEntity Builder Methods

| Method | Status Code | Use Case |
|--------|-------------|----------|
| `ok()` | 200 | Successful GET/PUT |
| `created(uri)` | 201 | Resource created |
| `accepted()` | 202 | Async processing |
| `noContent()` | 204 | Successful DELETE |
| `badRequest()` | 400 | Validation error |
| `notFound()` | 404 | Resource not found |
| `status(code)` | Any | Custom status |

---

## 10. HTTP Status Codes

### Common Status Codes

| Code | Status | Meaning | Use Case |
|------|--------|---------|----------|
| **2xx** | **Success** | | |
| 200 | OK | Request succeeded | GET, PUT |
| 201 | Created | Resource created | POST |
| 204 | No Content | Success, no body | DELETE |
| **3xx** | **Redirection** | | |
| 301 | Moved Permanently | Resource relocated | URL change |
| 302 | Found | Temporary redirect | After POST |
| **4xx** | **Client Error** | | |
| 400 | Bad Request | Invalid request | Validation fail |
| 401 | Unauthorized | Not authenticated | No login |
| 403 | Forbidden | Not authorized | No permission |
| 404 | Not Found | Resource doesn't exist | Invalid ID |
| 405 | Method Not Allowed | Wrong HTTP method | POST on GET-only |
| 409 | Conflict | Resource conflict | Duplicate |
| 422 | Unprocessable Entity | Semantic error | Business rule |
| **5xx** | **Server Error** | | |
| 500 | Internal Server Error | Server error | Exception |
| 503 | Service Unavailable | Server overloaded | Maintenance |

---

## 11. Exception Handling

### @ExceptionHandler

Handle exceptions in a specific controller.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
    
    // Handle specific exception in this controller
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUserNotFound(UserNotFoundException ex) {
        return new ErrorResponse("USER_NOT_FOUND", ex.getMessage());
    }
}
```

### @ControllerAdvice (Global Exception Handling)

Handle exceptions across all controllers.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    // Handle specific exception
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
        return new ErrorResponse("NOT_FOUND", ex.getMessage());
    }
    
    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
        
        return new ErrorResponse("VALIDATION_FAILED", errors);
    }
    
    // Handle all other exceptions
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);
        return new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred");
    }
}
```

### Error Response DTO

```java
public class ErrorResponse {
    private String code;
    private String message;
    private List<String> details;
    private LocalDateTime timestamp = LocalDateTime.now();
    
    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public ErrorResponse(String code, List<String> details) {
        this.code = code;
        this.details = details;
    }
    
    // Getters
}
```

---

## 12. Swagger UI (API Documentation)

### What is Swagger/OpenAPI?

**OpenAPI** (formerly Swagger) is a specification for describing REST APIs. **Swagger UI** provides interactive documentation.

### Adding Swagger to Spring Boot

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

### Access Swagger UI

Once added, access at:
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

### Documenting APIs

```java
@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {
    
    @Operation(
        summary = "Get user by ID",
        description = "Retrieves a user by their unique identifier"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{id}")
    public User getUser(
            @Parameter(description = "User ID", required = true, example = "123")
            @PathVariable Long id) {
        return userService.findById(id);
    }
    
    @Operation(summary = "Create a new user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @PostMapping
    public ResponseEntity<User> createUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "User data",
                required = true,
                content = @Content(schema = @Schema(implementation = UserDTO.class))
            )
            @RequestBody @Valid UserDTO dto) {
        User user = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
```

### Documenting DTOs

```java
@Schema(description = "User creation request")
public class UserDTO {
    
    @Schema(description = "Username", example = "john_doe", minLength = 3, maxLength = 50)
    @NotBlank
    private String username;
    
    @Schema(description = "Email address", example = "john@example.com")
    @Email
    private String email;
    
    @Schema(description = "User's age", minimum = "0", maximum = "150")
    private Integer age;
}
```

### Configuration

```properties
# application.properties
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
```

---

## Summary

Key concepts covered today:

| Topic | Key Points |
|-------|------------|
| **Spring MVC Architecture** | DispatcherServlet, HandlerMapping, Controllers |
| **Controllers** | @Controller (views), @RestController (JSON) |
| **Request Mapping** | @GetMapping, @PostMapping, @PutMapping, @DeleteMapping |
| **Path Variables** | Extract from URL path: `/users/{id}` |
| **Request Params** | Extract from query string: `?page=1` |
| **Validation** | @Valid, Bean Validation annotations |
| **Request Body** | @RequestBody for JSON input |
| **ResponseEntity** | Control status, headers, body |
| **Exception Handling** | @ExceptionHandler, @ControllerAdvice |
| **Swagger** | Interactive API documentation |

**Tomorrow**: Hibernate, ORM, JPA, and querying strategies!
