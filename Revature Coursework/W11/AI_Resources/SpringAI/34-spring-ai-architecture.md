# Spring AI Architecture and Core Concepts

## Learning Objectives

- Understand Spring AI's layered architecture
- Identify core components and their responsibilities
- Recognize how data flows through Spring AI
- Apply architectural knowledge to design decisions

## Why This Matters

Understanding the architecture helps you use Spring AI effectively and troubleshoot issues. You'll know where to look when things don't work as expected.

## The Concept

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                          │
│  Your controllers, services, business logic                 │
├─────────────────────────────────────────────────────────────┤
│                   API LAYER                                 │
│  ChatClient, EmbeddingClient, ImageClient                   │
├─────────────────────────────────────────────────────────────┤
│                  MODEL LAYER                                │
│  ChatModel, EmbeddingModel, ImageModel                      │
├─────────────────────────────────────────────────────────────┤
│                 PROVIDER LAYER                              │
│  OpenAI, Azure, Anthropic, Ollama implementations           │
├─────────────────────────────────────────────────────────────┤
│                 TRANSPORT LAYER                             │
│  HTTP clients, retry logic, error handling                  │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. ChatClient

High-level API for conversational AI:

```java
@Autowired
private ChatClient chatClient;

String response = chatClient.prompt()
    .system("You are a helpful assistant")
    .user("What is Spring AI?")
    .call()
    .content();
```

#### 2. ChatModel

Lower-level interface for chat operations:

```java
public interface ChatModel {
    ChatResponse call(Prompt prompt);
    Flux<ChatResponse> stream(Prompt prompt);
}
```

#### 3. Prompt

Encapsulates the complete request:

```java
Prompt prompt = new Prompt(
    List.of(
        new SystemMessage("You are a helpful assistant"),
        new UserMessage("Explain Spring AI")
    ),
    ChatOptions.builder()
        .withTemperature(0.7f)
        .build()
);
```

#### 4. Message Types

| Type | Purpose |
|------|---------|
| `SystemMessage` | Sets AI behavior/context |
| `UserMessage` | User's input |
| `AssistantMessage` | AI's previous responses |
| `FunctionMessage` | Function call results |

### Data Flow

```
User Input
     ↓
┌─────────────┐
│ ChatClient  │ ← Fluent API, building prompts
└─────────────┘
     ↓
┌─────────────┐
│   Prompt    │ ← Messages + Options
└─────────────┘
     ↓
┌─────────────┐
│  ChatModel  │ ← Provider implementation
└─────────────┘
     ↓
┌─────────────┐
│ HTTP Call   │ ← To OpenAI, Azure, etc.
└─────────────┘
     ↓
┌──────────────┐
│ ChatResponse │ ← Parsed response
└──────────────┘
     ↓
Response Content
```

### Options and Configuration

#### Chat Options

```java
ChatOptions options = ChatOptions.builder()
    .withModel("gpt-4")
    .withTemperature(0.7f)
    .withMaxTokens(1000)
    .withTopP(1.0f)
    .build();
```

#### Per-Request Overrides

```java
chatClient.prompt()
    .options(ChatOptions.builder()
        .withTemperature(0.0f)  // Override default
        .build())
    .user("Give me a precise answer")
    .call();
```

### Output Parsing

Spring AI can parse responses to typed objects:

```java
record BookRecommendation(String title, String author, String reason) {}

BookRecommendation book = chatClient.prompt()
    .user("Recommend a Java book")
    .call()
    .entity(BookRecommendation.class);
```

### Streaming Support

For real-time responses:

```java
Flux<String> stream = chatClient.prompt()
    .user("Tell me a story")
    .stream()
    .content();

stream.subscribe(chunk -> System.out.print(chunk));
```

## Summary

- Spring AI uses a layered architecture: Application → API → Model → Provider
- Core components: ChatClient (high-level), ChatModel (low-level), Prompt, Messages
- Data flows from user input through prompts to provider and back
- Options can be configured globally or overridden per-request
- Supports both synchronous and streaming responses

## Additional Resources

- [Spring AI Architecture](https://docs.spring.io/spring-ai/reference/concepts.html)
- [ChatClient API](https://docs.spring.io/spring-ai/reference/api/chatclient.html)
