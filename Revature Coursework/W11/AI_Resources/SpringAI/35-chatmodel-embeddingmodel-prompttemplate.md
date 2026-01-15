# ChatModel, EmbeddingModel, and PromptTemplate

## Learning Objectives

- Use ChatModel for conversational AI
- Apply EmbeddingModel for vector operations
- Create dynamic prompts with PromptTemplate
- Choose the right model type for your use case

## Why This Matters

These three components are the workhorses of Spring AI. Understanding each one's purpose and usage patterns enables you to build sophisticated AI features.

## The Concept

### ChatModel

**Purpose:** Send prompts to AI and receive text responses.

```java
@Service
public class ChatService {
    
    private final ChatModel chatModel;
    
    public ChatService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }
    
    public String ask(String question) {
        Prompt prompt = new Prompt(new UserMessage(question));
        ChatResponse response = chatModel.call(prompt);
        return response.getResult().getOutput().getContent();
    }
}
```

#### With Options

```java
public String askWithOptions(String question, float temperature) {
    Prompt prompt = new Prompt(
        new UserMessage(question),
        ChatOptions.builder()
            .withTemperature(temperature)
            .build()
    );
    return chatModel.call(prompt).getResult().getOutput().getContent();
}
```

#### Streaming

```java
public Flux<String> streamResponse(String question) {
    Prompt prompt = new Prompt(new UserMessage(question));
    return chatModel.stream(prompt)
        .map(response -> response.getResult().getOutput().getContent());
}
```

---

### EmbeddingModel

**Purpose:** Convert text to numerical vectors for similarity comparisons.

```java
@Service
public class EmbeddingService {
    
    private final EmbeddingModel embeddingModel;
    
    public float[] getEmbedding(String text) {
        EmbeddingResponse response = embeddingModel.embed(text);
        return response.getResult().getOutput();
    }
    
    public List<float[]> getEmbeddings(List<String> texts) {
        EmbeddingResponse response = embeddingModel.embed(texts);
        return response.getResults().stream()
            .map(embedding -> embedding.getOutput())
            .toList();
    }
}
```

#### Use Cases for Embeddings

| Use Case | How Embeddings Help |
|----------|---------------------|
| Semantic search | Find similar documents |
| Recommendations | Find similar products |
| Clustering | Group related content |
| RAG | Retrieve relevant context |

#### Similarity Calculation

```java
public double cosineSimilarity(float[] vec1, float[] vec2) {
    double dotProduct = 0.0;
    double norm1 = 0.0;
    double norm2 = 0.0;
    
    for (int i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        norm1 += vec1[i] * vec1[i];
        norm2 += vec2[i] * vec2[i];
    }
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}
```

---

### PromptTemplate

**Purpose:** Create dynamic prompts with variable substitution.

```java
@Service
public class PromptService {
    
    private final ChatModel chatModel;
    
    public String generateProductDescription(String productName, String category) {
        PromptTemplate template = new PromptTemplate(
            "Write a compelling product description for {productName} in the {category} category. " +
            "Keep it under 100 words and highlight key benefits."
        );
        
        Prompt prompt = template.create(Map.of(
            "productName", productName,
            "category", category
        ));
        
        return chatModel.call(prompt).getResult().getOutput().getContent();
    }
}
```

#### Template from Resource

```java
// templates/product-description.st (in resources)
// Write a product description for {productName}...

@Value("classpath:templates/product-description.st")
private Resource templateResource;

public String generate(String productName) {
    PromptTemplate template = new PromptTemplate(templateResource);
    Prompt prompt = template.create(Map.of("productName", productName));
    return chatModel.call(prompt).getResult().getOutput().getContent();
}
```

#### Complex Templates

```java
String templateText = """
    You are a {role}.
    
    Context: {context}
    
    User Question: {question}
    
    Provide a helpful answer in {format} format.
    """;

PromptTemplate template = new PromptTemplate(templateText);
Prompt prompt = template.create(Map.of(
    "role", "technical support specialist",
    "context", "The user is asking about our API",
    "question", userQuestion,
    "format", "markdown"
));
```

### Choosing the Right Model

| Need | Use | Example |
|------|-----|---------|
| Generate text | ChatModel | Chatbots, content generation |
| Compare similarity | EmbeddingModel | Search, recommendations |
| Dynamic prompts | PromptTemplate | Reusable prompt patterns |
| All together | Combine them | RAG systems |

## Summary

- **ChatModel**: Core interface for conversational AI interactions
- **EmbeddingModel**: Converts text to vectors for similarity operations
- **PromptTemplate**: Creates dynamic, variable-based prompts
- Use ChatModel for generation, EmbeddingModel for similarity, PromptTemplate for reusability
- These components often work together in sophisticated applications

## Additional Resources

- [Spring AI Chat Models](https://docs.spring.io/spring-ai/reference/api/chatmodel.html)
- [Spring AI Embeddings](https://docs.spring.io/spring-ai/reference/api/embeddings.html)
- [Prompt Templates](https://docs.spring.io/spring-ai/reference/api/prompt.html)
