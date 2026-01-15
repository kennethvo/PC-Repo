# Introduction to Spring AI

## Learning Objectives

- Understand what Spring AI is and its purpose
- Recognize how Spring AI fits into the Spring ecosystem
- Identify use cases for Spring AI in enterprise applications
- Set up a basic Spring AI project

## Why This Matters

Spring AI brings AI capabilities into the familiar Spring ecosystem. As we conclude our **"Empowering Developers with AI"** week, you'll learn how to integrate AI directly into your Spring Boot applications—a powerful skill for building intelligent enterprise applications.

## The Concept

### What is Spring AI?

**Spring AI** is a Spring project that provides a consistent API for integrating AI capabilities into Spring applications. It abstracts away the complexity of working with different AI providers.

```
┌─────────────────────────────────────────────────────────────┐
│                     SPRING AI                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Your Spring Application                                    │
│         ↓                                                   │
│  Spring AI Abstraction Layer                                │
│         ↓                                                   │
│  ┌─────────┬─────────┬─────────┬─────────┐                 │
│  │ OpenAI  │ Azure   │ Anthropic│ Ollama │ ...             │
│  │ (GPT)   │ OpenAI  │ (Claude) │ (Local)│                 │
│  └─────────┴─────────┴─────────┴─────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Why Spring AI?

| Without Spring AI | With Spring AI |
|-------------------|----------------|
| Different APIs for each provider | Unified API |
| Manual HTTP/SDK setup | Auto-configuration |
| Custom retry/error handling | Built-in resilience |
| Provider lock-in | Easy provider switching |
| Manual prompt management | Template support |

### Spring AI Capabilities

| Capability | Description |
|------------|-------------|
| **Chat Completion** | Conversational AI interactions |
| **Embeddings** | Vector representations for similarity |
| **Image Generation** | Create images from text |
| **Audio Transcription** | Speech-to-text |
| **Function Calling** | AI-triggered function execution |
| **RAG Support** | Retrieval-Augmented Generation |

### Getting Started

#### Maven Dependencies

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
</dependency>
```

#### Configuration

```yaml
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4
          temperature: 0.7
```

#### Basic Usage

```java
@Service
public class AiChatService {
    
    private final ChatClient chatClient;
    
    public AiChatService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }
    
    public String chat(String userMessage) {
        return chatClient.prompt()
            .user(userMessage)
            .call()
            .content();
    }
}
```

### Supported Providers

| Provider | Starter Dependency |
|----------|-------------------|
| OpenAI | `spring-ai-openai-spring-boot-starter` |
| Azure OpenAI | `spring-ai-azure-openai-spring-boot-starter` |
| Anthropic | `spring-ai-anthropic-spring-boot-starter` |
| Ollama (Local) | `spring-ai-ollama-spring-boot-starter` |
| Amazon Bedrock | `spring-ai-bedrock-spring-boot-starter` |
| Google Vertex AI | `spring-ai-vertex-ai-spring-boot-starter` |

### When to Use Spring AI

| Use Case | Example |
|----------|---------|
| Customer support chatbot | AI-powered help desk |
| Content generation | Product descriptions |
| Document analysis | Contract summarization |
| Search enhancement | Semantic search |
| Data extraction | Extract info from PDFs |

## Summary

- Spring AI provides a unified API for AI integration in Spring applications
- Supports multiple providers: OpenAI, Azure, Anthropic, Ollama, and more
- Offers chat, embeddings, image generation, and function calling
- Follows Spring Boot conventions with auto-configuration
- Enables enterprise AI applications with familiar patterns

## Additional Resources

- [Spring AI Documentation](https://docs.spring.io/spring-ai/reference/)
- [Spring AI GitHub](https://github.com/spring-projects/spring-ai)
- [Spring AI Samples](https://github.com/spring-projects/spring-ai/tree/main/spring-ai-samples)
