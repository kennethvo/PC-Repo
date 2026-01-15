# Output Parsing in Spring AI

## Learning Objectives

- Parse AI responses to typed Java objects
- Use built-in converters for common types
- Create custom output parsers
- Handle parsing errors gracefully

## Why This Matters

AI returns text, but applications need structured data. Output parsing bridges the gap, letting you work with type-safe objects instead of parsing strings manually.

## The Concept

### The Problem

```
AI Response: "The product costs $29.99 and is available in 3 colors: 
              red, blue, and green."

What you need: Product(price=29.99, colors=["red", "blue", "green"])
```

### Built-in Entity Conversion

Spring AI can automatically parse responses to Java types:

```java
record Product(String name, BigDecimal price, List<String> colors) {}

public Product getProductInfo(String description) {
    return chatClient.prompt()
        .user("Extract product information from: " + description)
        .call()
        .entity(Product.class);
}
```

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                   OUTPUT PARSING FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Spring AI adds format instructions to prompt            │
│  2. AI returns JSON (or structured format)                  │
│  3. Spring AI parses JSON to your type                      │
│  4. You receive a typed object                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Common Output Types

#### Simple Types

```java
// String (default)
String text = chatClient.prompt().user("...").call().content();

// List of strings
List<String> items = chatClient.prompt()
    .user("List 5 programming languages")
    .call()
    .entity(new ParameterizedTypeReference<List<String>>() {});
```

#### Records

```java
record BookReview(
    String title,
    String author,
    int rating,
    String summary
) {}

BookReview review = chatClient.prompt()
    .user("Review the book: Clean Code by Robert Martin")
    .call()
    .entity(BookReview.class);
```

#### Complex Nested Types

```java
record Order(
    String orderId,
    Customer customer,
    List<OrderItem> items,
    BigDecimal total
) {}

record Customer(String name, String email) {}
record OrderItem(String product, int quantity, BigDecimal price) {}

Order order = chatClient.prompt()
    .user("Create a sample order for office supplies")
    .call()
    .entity(Order.class);
```

### Explicit Output Instructions

Sometimes you need to be explicit about the format:

```java
public List<Task> extractTasks(String document) {
    String prompt = """
        Extract all action items from this document.
        Return as JSON array with objects containing: 
        task (string), assignee (string), dueDate (YYYY-MM-DD).
        
        Document: %s
        """.formatted(document);
    
    return chatClient.prompt()
        .user(prompt)
        .call()
        .entity(new ParameterizedTypeReference<List<Task>>() {});
}

record Task(String task, String assignee, String dueDate) {}
```

### Error Handling

```java
public Optional<Product> parseProduct(String text) {
    try {
        Product product = chatClient.prompt()
            .user("Extract product info from: " + text)
            .call()
            .entity(Product.class);
        return Optional.of(product);
    } catch (OutputParsingException e) {
        log.warn("Failed to parse product: {}", e.getMessage());
        return Optional.empty();
    }
}
```

### Validation with Parsed Output

```java
public record CreateUserRequest(
    @NotBlank String name,
    @Email String email,
    @Min(18) int age
) {}

public CreateUserRequest generateTestUser() {
    CreateUserRequest user = chatClient.prompt()
        .user("Generate a realistic test user for a US-based application")
        .call()
        .entity(CreateUserRequest.class);
    
    // Validate after parsing
    var violations = validator.validate(user);
    if (!violations.isEmpty()) {
        throw new ValidationException(violations);
    }
    
    return user;
}
```

## Summary

- Use `.entity(Class)` to parse AI responses to typed objects
- Works with records, classes, and generic types
- Spring AI automatically adds format instructions
- Handle parsing errors gracefully
- Validate parsed objects for business rules

## Additional Resources

- [Spring AI Output Parsing](https://docs.spring.io/spring-ai/reference/api/output-parsing.html)
- [Structured Outputs](https://docs.spring.io/spring-ai/reference/api/structured-outputs.html)
