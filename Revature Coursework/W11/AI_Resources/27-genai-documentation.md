# Using GenAI for Documentation

## Learning Objectives

- Generate documentation efficiently with AI
- Create different types of technical documentation
- Maintain documentation quality and accuracy
- Integrate documentation generation into workflow

## Why This Matters

Documentation is essential but often neglected. AI makes creating and maintaining documentation fast enough to actually do it, improving code maintainability and team collaboration.

## The Concept

### Documentation Types AI Can Generate

| Type | AI Effectiveness | Best Approach |
|------|------------------|---------------|
| Javadoc/JSDoc | ⭐⭐⭐⭐⭐ | Give method signature |
| README files | ⭐⭐⭐⭐ | Describe project structure |
| API docs | ⭐⭐⭐⭐ | Provide endpoint details |
| Code comments | ⭐⭐⭐⭐ | Review for accuracy |
| Architecture docs | ⭐⭐⭐ | Needs human input |
| User guides | ⭐⭐⭐ | Good first draft |

### Javadoc Generation

#### From Method Signature

**Prompt:**

```
Generate Javadoc for this method:

public OrderResponse createOrder(CreateOrderRequest request, Long customerId)
    throws CustomerNotFoundException, InsufficientStockException {
    // Creates an order for the specified customer
    // Validates stock, calculates total, persists order
}
```

**Generated:**

```java
/**
 * Creates a new order for the specified customer.
 *
 * <p>This method validates that sufficient stock exists for all items,
 * calculates the order total, and persists the order to the database.</p>
 *
 * @param request the order creation request containing items and quantities
 * @param customerId the unique identifier of the customer placing the order
 * @return the created order details wrapped in an OrderResponse
 * @throws CustomerNotFoundException if no customer exists with the given ID
 * @throws InsufficientStockException if any product lacks sufficient stock
 * @see OrderResponse
 * @see CreateOrderRequest
 */
public OrderResponse createOrder(CreateOrderRequest request, Long customerId) {
```

### README Generation

**Prompt:**

```
Generate a README.md for a Spring Boot microservice:

Name: order-service
Purpose: Handles order creation and management
Tech: Java 17, Spring Boot 3.2, PostgreSQL, Redis (caching)
Endpoints: CRUD for orders, order status updates
Related services: user-service, inventory-service, payment-service

Include: project description, prerequisites, setup, API overview, configuration
```

### API Documentation

**Prompt:**

```
Generate OpenAPI/Swagger annotations for this endpoint:

@PostMapping("/orders")
public ResponseEntity<OrderResponse> createOrder(
    @Valid @RequestBody CreateOrderRequest request) {
    // Creates new order
    // Returns 201 on success
    // Returns 400 for validation errors
    // Returns 404 if customer not found
}
```

**Generated:**

```java
@Operation(
    summary = "Create a new order",
    description = "Creates a new order for the authenticated customer"
)
@ApiResponses(value = {
    @ApiResponse(responseCode = "201", description = "Order created successfully",
        content = @Content(schema = @Schema(implementation = OrderResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid request data"),
    @ApiResponse(responseCode = "404", description = "Customer not found")
})
@PostMapping("/orders")
public ResponseEntity<OrderResponse> createOrder(
```

### Inline Code Comments

**Prompt:**

```
Add explanatory comments to this code for a junior developer:

```java
List<Order> pendingOrders = orders.stream()
    .filter(o -> o.getStatus() == OrderStatus.PENDING)
    .filter(o -> o.getCreatedAt().isBefore(LocalDateTime.now().minusDays(7)))
    .sorted(Comparator.comparing(Order::getCreatedAt))
    .collect(Collectors.toList());
```

**Generated:**

```java
// Find orders that need attention (pending and older than 7 days)
List<Order> pendingOrders = orders.stream()
    // Keep only orders with PENDING status
    .filter(o -> o.getStatus() == OrderStatus.PENDING)
    // Keep only orders created more than 7 days ago
    .filter(o -> o.getCreatedAt().isBefore(LocalDateTime.now().minusDays(7)))
    // Sort by creation date (oldest first) for priority processing
    .sorted(Comparator.comparing(Order::getCreatedAt))
    // Collect into a list for batch processing
    .collect(Collectors.toList());
```

### Documentation Workflow

```
1. Write/Update Code
         ↓
2. Generate Documentation with AI
         ↓
3. Review for Accuracy
         ↓
4. Adjust for Context/Audience
         ↓
5. Commit with Code Changes
```

### Quality Review Checklist

| Aspect | Check |
|--------|-------|
| Accuracy | Do descriptions match actual behavior? |
| Completeness | All parameters and returns documented? |
| Clarity | Would a new developer understand? |
| Examples | Are usage examples provided where helpful? |
| Links | Are related classes/methods referenced? |

### Best Practices

1. **Include context** about the project and audience
2. **Generate alongside code** to keep in sync
3. **Review every generated doc** for accuracy
4. **Use consistent style** across the codebase
5. **Automate where possible** (Javadoc at write time)

## Summary

- AI excels at generating Javadoc, JSDoc, and inline comments
- README and API docs benefit from AI-generated first drafts
- Always review AI documentation for accuracy
- Generate documentation as you write code, not after
- Maintain consistent style and quality standards

## Additional Resources

- [Javadoc Guide](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)
- [OpenAPI/Swagger](https://swagger.io/specification/)
