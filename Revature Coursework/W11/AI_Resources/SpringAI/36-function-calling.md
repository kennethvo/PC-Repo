# Function Calling in Spring AI

## Learning Objectives

- Understand what function calling is
- Implement function calling with Spring AI
- Register functions for AI to invoke
- Handle function results in conversations

## Why This Matters

Function calling lets AI execute code in your application. This transforms AI from a text generator into an intelligent agent that can perform real actions—check databases, call APIs, or execute business logic.

## The Concept

### What is Function Calling?

**Function calling** allows the AI to recognize when it should invoke a specific function and request that invocation. You provide the results back to the AI for a complete response.

```
┌─────────────────────────────────────────────────────────────┐
│                   FUNCTION CALLING FLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User: "What's the weather in NYC?"                     │
│                     ↓                                       │
│  2. AI recognizes: needs getWeather(location)              │
│                     ↓                                       │
│  3. Spring AI calls: yourFunction("NYC")                   │
│                     ↓                                       │
│  4. Function returns: {"temp": 72, "condition": "sunny"}   │
│                     ↓                                       │
│  5. AI responds: "The weather in NYC is 72°F and sunny"    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Defining Functions

#### Using @FunctionDefinition

```java
@Configuration
public class AiFunctions {
    
    @Bean
    @Description("Get the current weather for a location")
    public Function<WeatherRequest, WeatherResponse> getWeather() {
        return request -> {
            // Call weather API
            return weatherService.getWeather(request.location());
        };
    }
}

record WeatherRequest(String location) {}
record WeatherResponse(int temperature, String condition) {}
```

#### Using Functional Beans

```java
@Bean
@Description("Find products by category")
public Function<ProductQuery, List<Product>> searchProducts(ProductService productService) {
    return query -> productService.findByCategory(query.category());
}

record ProductQuery(String category) {}
```

### Using Functions in Chat

```java
@Service
public class AssistantService {
    
    private final ChatClient chatClient;
    
    public String chat(String userMessage) {
        return chatClient.prompt()
            .user(userMessage)
            .functions("getWeather", "searchProducts")  // Enable these functions
            .call()
            .content();
    }
}
```

### Multiple Functions

```java
@Configuration
public class StoreFunctions {
    
    @Bean
    @Description("Get current inventory for a product")
    public Function<InventoryRequest, InventoryResponse> getInventory(
            InventoryService inventoryService) {
        return request -> inventoryService.check(request.productId());
    }
    
    @Bean
    @Description("Place an order for a customer")
    public Function<OrderRequest, OrderResponse> placeOrder(
            OrderService orderService) {
        return request -> orderService.create(request);
    }
    
    @Bean
    @Description("Get customer information by email")
    public Function<CustomerLookup, Customer> findCustomer(
            CustomerService customerService) {
        return request -> customerService.findByEmail(request.email());
    }
}
```

### Chat with All Functions

```java
public String assistantChat(String message) {
    return chatClient.prompt()
        .user(message)
        .functions("getInventory", "placeOrder", "findCustomer")
        .call()
        .content();
}
```

**Example conversation:**

```
User: "Can you check if customer john@example.com has any pending orders and 
       whether we have the iPhone 15 in stock?"

AI: *calls findCustomer("john@example.com")*
    *calls getInventory("iphone-15")*
    "John Smith (john@example.com) has 2 pending orders. 
     Yes, we have 45 iPhone 15 units in stock."
```

### Security Considerations

| Risk | Mitigation |
|------|------------|
| Unauthorized actions | Validate user permissions before executing |
| Data exposure | Filter sensitive data from responses |
| Rate limiting | Limit function calls per conversation |
| Injection | Validate/sanitize function inputs |

```java
@Bean
@Description("Delete a user account")
public Function<DeleteRequest, DeleteResponse> deleteUser(
        UserService userService, SecurityContext securityContext) {
    return request -> {
        // Verify the caller has permission
        if (!securityContext.hasRole("ADMIN")) {
            return new DeleteResponse(false, "Unauthorized");
        }
        return userService.delete(request.userId());
    };
}
```

## Summary

- Function calling lets AI invoke your code during conversations
- Define functions as Spring beans with `@Description`
- Enable functions in ChatClient with `.functions(...)`
- AI decides when to call functions based on user input
- Always validate permissions for sensitive operations

## Additional Resources

- [Spring AI Function Calling](https://docs.spring.io/spring-ai/reference/api/function-calling.html)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
