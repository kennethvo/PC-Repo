# Spring AI Providers

## Learning Objectives

- Compare supported AI providers in Spring AI
- Configure different providers
- Switch between providers with minimal code changes
- Choose the right provider for your use case

## Why This Matters

Spring AI's provider abstraction is a key benefit. Understanding the providers helps you choose wisely and maintain flexibility to switch if needed.

## The Concept

### Supported Providers

| Provider | Model Access | Best For |
|----------|--------------|----------|
| **OpenAI** | GPT-4, GPT-3.5 | General purpose, wide support |
| **Azure OpenAI** | GPT models via Azure | Enterprise, compliance needs |
| **Anthropic** | Claude 3, Claude 2 | Safety, long context |
| **Ollama** | Llama, Mistral, etc. | Local/private deployment |
| **AWS Bedrock** | Anthropic, Cohere, etc. | AWS ecosystem |
| **Google Vertex AI** | Gemini, PaLM | GCP ecosystem |
| **Mistral AI** | Mistral models | European, fast inference |

### Provider Configuration

#### OpenAI

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
</dependency>
```

```yaml
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4
```

#### Azure OpenAI

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-azure-openai-spring-boot-starter</artifactId>
</dependency>
```

```yaml
spring:
  ai:
    azure:
      openai:
        api-key: ${AZURE_OPENAI_KEY}
        endpoint: ${AZURE_OPENAI_ENDPOINT}
        deployment-name: gpt-4-deployment
```

#### Anthropic (Claude)

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-anthropic-spring-boot-starter</artifactId>
</dependency>
```

```yaml
spring:
  ai:
    anthropic:
      api-key: ${ANTHROPIC_API_KEY}
      chat:
        options:
          model: claude-3-sonnet-20240229
```

#### Ollama (Local)

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-ollama-spring-boot-starter</artifactId>
</dependency>
```

```yaml
spring:
  ai:
    ollama:
      base-url: http://localhost:11434
      chat:
        options:
          model: llama3
```

### Provider Comparison

| Aspect | OpenAI | Azure | Anthropic | Ollama |
|--------|--------|-------|-----------|--------|
| Cost | Per token | Per token | Per token | Free (local) |
| Privacy | Cloud | Enterprise cloud | Cloud | On-premise |
| Models | GPT-4, 4o | Same as OpenAI | Claude 3 | Many OSS |
| Speed | Fast | Fast | Fast | Varies |
| Context | 128K | 128K | 200K | Varies |
| Setup | Simple | Complex | Simple | Local install |

### Switching Providers

The abstraction makes switching easy:

```java
// This code works with ANY provider
@Service
public class ChatService {
    
    private final ChatClient chatClient;
    
    public String chat(String message) {
        return chatClient.prompt()
            .user(message)
            .call()
            .content();
    }
}
```

**To switch:** Change the dependency and configuration. No code changes needed.

### Multi-Provider Setup

For different use cases, you can configure multiple providers:

```java
@Configuration
public class AiConfig {
    
    @Bean
    @Primary
    public ChatModel primaryChat(OpenAiChatModel openAiChatModel) {
        return openAiChatModel;  // Default for most uses
    }
    
    @Bean
    @Qualifier("private")
    public ChatModel privateChat(OllamaChatModel ollamaChatModel) {
        return ollamaChatModel;  // For sensitive data
    }
}

@Service
public class SecureService {
    
    @Qualifier("private")
    private final ChatModel privateChatModel;
    
    public String processConfidential(String data) {
        // Uses local Ollama, data stays on-premise
    }
}
```

### Choosing a Provider

| Requirement | Recommended Provider |
|-------------|---------------------|
| Best quality | OpenAI GPT-4 or Claude 3 |
| Enterprise compliance | Azure OpenAI |
| Data privacy | Ollama (local) |
| Long documents | Anthropic Claude |
| AWS environment | Amazon Bedrock |
| GCP environment | Google Vertex AI |
| Cost-sensitive | Ollama or smaller models |

## Summary

- Spring AI supports OpenAI, Azure, Anthropic, Ollama, Bedrock, and more
- Each provider has a starter dependency and specific configuration
- The abstraction allows provider switching without code changes
- Multiple providers can coexist for different use cases
- Choose based on: quality, privacy, cost, and ecosystem

## Additional Resources

- [Spring AI Providers](https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html)
- [Ollama Models](https://ollama.ai/library)
