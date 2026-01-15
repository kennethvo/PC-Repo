# Using GenAI for Testing

## Learning Objectives

- Apply AI to generate unit and integration tests
- Create comprehensive test suites with AI assistance
- Identify edge cases using AI
- Maintain test quality with AI-generated tests

## Why This Matters

Test writing is often the most skipped part of development due to time pressure. AI dramatically speeds up test creation, making comprehensive testing practical even under tight deadlines.

## The Concept

### AI Testing Capabilities

| Task | AI Effectiveness | Notes |
|------|------------------|-------|
| Happy path tests | ⭐⭐⭐⭐⭐ | Excellent |
| Edge case identification | ⭐⭐⭐⭐ | Good suggestions |
| Mock setup | ⭐⭐⭐⭐ | Framework-specific |
| Test data generation | ⭐⭐⭐⭐⭐ | Great for variations |
| Integration tests | ⭐⭐⭐ | Needs more guidance |
| BDD/Cucumber | ⭐⭐⭐ | Can write scenarios |

### Test Generation Patterns

#### Pattern 1: Test from Method

```
Generate JUnit 5 tests for this method:

```java
public Optional<User> findByEmail(String email) {
    if (email == null || email.isBlank()) {
        throw new IllegalArgumentException("Email cannot be empty");
    }
    return userRepository.findByEmail(email.toLowerCase().trim());
}
```

Cover: happy path, null input, blank input, email normalization
Use: Mockito for UserRepository, AssertJ assertions

```

#### Pattern 2: Test Scenario List

```

For OrderService.createOrder, write tests for these scenarios:

1. Successful order creation with valid items
2. Invalid: customer doesn't exist
3. Invalid: product doesn't exist
4. Invalid: insufficient stock
5. Edge: order with single item
6. Edge: order with maximum allowed items (10)

Use JUnit 5 @Nested for grouping, Mockito for mocks.

```

#### Pattern 3: Edge Case Discovery

```

Given this validation method:

```java
public boolean isValidPassword(String password) {
    if (password == null || password.length() < 8) return false;
    return password.matches(".*[A-Z].*") 
        && password.matches(".*[a-z].*")
        && password.matches(".*\\d.*");
}
```

What edge cases should I test? List them, then generate the tests.

```

### Sample Generated Test Structure

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Nested
    @DisplayName("findByEmail")
    class FindByEmail {
        
        @Test
        @DisplayName("should return user when email exists")
        void shouldReturnUser_whenEmailExists() {
            // Given
            String email = "test@example.com";
            User expectedUser = new User(1L, email);
            when(userRepository.findByEmail(email))
                .thenReturn(Optional.of(expectedUser));
            
            // When
            Optional<User> result = userService.findByEmail(email);
            
            // Then
            assertThat(result).isPresent().contains(expectedUser);
        }
        
        @Test
        @DisplayName("should throw exception for null email")
        void shouldThrowException_whenEmailIsNull() {
            assertThatThrownBy(() -> userService.findByEmail(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("empty");
        }
    }
}
```

### AI Prompts for Testing

#### For Unit Tests

```
Generate unit tests for [ClassName].[methodName]:

Context:
- Framework: JUnit 5 + Mockito + AssertJ  
- Class under test: [paste class or signature]
- Dependencies to mock: [list dependencies]

Test Style:
- Method naming: should_[outcome]_when_[condition]
- Use @DisplayName for readable output
- Given-When-Then comments in each test
- Group related tests with @Nested

Coverage:
- Happy path
- Edge cases (boundaries, empty collections)
- Error cases (exceptions, validation failures)
```

#### For Integration Tests

```
Generate Spring Boot integration test for [ControllerName]:

Endpoint: [HTTP method] [path]
Request: [body/params description]
Expected: [success response]
Errors: [error scenarios]

Use:
- @SpringBootTest with WebEnvironment.RANDOM_PORT
- TestRestTemplate or MockMvc
- @Sql for test data setup
- @Transactional for cleanup
```

### Test Quality Review

AI-generated tests need review for:

| Check | What to Look For |
|-------|------------------|
| Assertions | Are they testing the right things? |
| Isolation | Are tests independent? |
| Mocks | Configured correctly? |
| Edge cases | All boundaries covered? |
| Naming | Descriptive test names? |
| Maintainability | Easy to understand? |

### Best Practices

1. **Provide the actual code** for accurate test generation

2. **Specify your testing conventions**

   ```
   "Method naming: given_when_then format"
   ```

3. **Request specific assertions**

   ```
   "Use AssertJ fluent assertions"
   ```

4. **Ask for parameterized tests** when appropriate

   ```
   "Use @ParameterizedTest for multiple valid/invalid inputs"
   ```

## Summary

- AI excels at unit test generation, especially happy paths
- Edge case identification is a strong use case
- Always review AI tests for assertion quality
- Provide actual code and specific conventions for best results
- AI tests are a starting point—enhance with business logic understanding

## Additional Resources

- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [AI Test Generation Research](https://www.microsoft.com/en-us/research/project/ai-for-software-testing/)
