# Spring AI Use Cases

## Learning Objectives

- Identify practical applications for Spring AI
- Design AI-enhanced features for enterprise apps
- Recognize patterns for common use cases
- Plan AI integration in existing systems

## Why This Matters

Knowing what you CAN build is as important as knowing HOW to build. These use cases inspire practical applications and help you recognize opportunities for AI enhancement.

## The Concept

### Use Case Categories

| Category | Examples |
|----------|----------|
| **Conversational** | Chatbots, assistants, support |
| **Content** | Generation, summarization, translation |
| **Analysis** | Classification, extraction, sentiment |
| **Search** | Semantic search, recommendations |
| **Automation** | Workflows, decision support |

---

### 1. Customer Support Chatbot

```java
@RestController
@RequestMapping("/api/support")
public class SupportController {
    
    private final ChatClient chatClient;
    
    @PostMapping("/chat")
    public SupportResponse chat(@RequestBody SupportRequest request) {
        String response = chatClient.prompt()
            .system("""
                You are a support agent for TechStore.
                - Be helpful and professional
                - If you can't help, offer to escalate
                - Never make up product information
                """)
            .user(request.message())
            .functions("getProductInfo", "checkOrderStatus", "createTicket")
            .call()
            .content();
        
        return new SupportResponse(response);
    }
}
```

---

### 2. Content Generation

```java
@Service
public class ContentService {
    
    private final ChatClient chatClient;
    
    public String generateProductDescription(Product product) {
        return chatClient.prompt()
            .user("""
                Write a compelling product description for:
                Name: %s
                Category: %s
                Features: %s
                
                Format: 2-3 sentences, highlight benefits, use active voice.
                """.formatted(product.getName(), 
                              product.getCategory(), 
                              product.getFeatures()))
            .call()
            .content();
    }
    
    public String generateBlogPost(String topic, String keywords) {
        return chatClient.prompt()
            .user("Write a 500-word blog post about: " + topic + 
                  ". Include keywords: " + keywords)
            .call()
            .content();
    }
}
```

---

### 3. Document Analysis

```java
@Service
public class DocumentAnalyzer {
    
    private final ChatClient chatClient;
    
    public ContractSummary analyzeContract(String contractText) {
        return chatClient.prompt()
            .user("""
                Analyze this contract and extract:
                - Parties involved
                - Key dates
                - Payment terms
                - Termination clauses
                - Potential risks
                
                Contract:
                %s
                """.formatted(contractText))
            .call()
            .entity(ContractSummary.class);
    }
}

record ContractSummary(
    List<String> parties,
    List<KeyDate> dates,
    String paymentTerms,
    String terminationClause,
    List<String> risks
) {}
```

---

### 4. Semantic Search with RAG

```java
@Service
public class SemanticSearchService {
    
    private final EmbeddingModel embeddingModel;
    private final VectorStore vectorStore;
    private final ChatClient chatClient;
    
    public String searchAndAnswer(String question) {
        // 1. Find relevant documents
        List<Document> relevantDocs = vectorStore
            .similaritySearch(question, 5);
        
        // 2. Build context from documents
        String context = relevantDocs.stream()
            .map(Document::getContent)
            .collect(Collectors.joining("\n\n"));
        
        // 3. Answer using context
        return chatClient.prompt()
            .system("Answer based only on the provided context. " +
                    "If the answer isn't in the context, say so.")
            .user("Context:\n" + context + "\n\nQuestion: " + question)
            .call()
            .content();
    }
}
```

---

### 5. Email Classification and Routing

```java
@Service
public class EmailRouter {
    
    private final ChatClient chatClient;
    
    public EmailClassification classifyEmail(String emailContent) {
        return chatClient.prompt()
            .user("""
                Classify this email into one of these categories:
                - SUPPORT_REQUEST
                - SALES_INQUIRY  
                - COMPLAINT
                - SPAM
                - OTHER
                
                Also determine the urgency (LOW, MEDIUM, HIGH) and 
                suggest which department should handle it.
                
                Email:
                %s
                """.formatted(emailContent))
            .call()
            .entity(EmailClassification.class);
    }
}

record EmailClassification(
    String category,
    String urgency, 
    String department,
    String summary
) {}
```

---

### 6. Code Review Assistant

```java
@Service
public class CodeReviewService {
    
    private final ChatClient chatClient;
    
    public CodeReviewResult review(String code, String language) {
        return chatClient.prompt()
            .system("""
                You are a senior developer conducting code review.
                Focus on: bugs, security, performance, readability.
                Be constructive and explain your reasoning.
                """)
            .user("Review this %s code:\n```%s\n%s\n```"
                  .formatted(language, language, code))
            .call()
            .entity(CodeReviewResult.class);
    }
}

record CodeReviewResult(
    List<Issue> issues,
    List<String> positives,
    String overallAssessment
) {}

record Issue(String type, String severity, String description, String suggestion) {}
```

---

### Integration Patterns

| Pattern | Use When |
|---------|----------|
| **REST Endpoint** | External access to AI |
| **Event-Driven** | Async processing |
| **Scheduled** | Batch analysis |
| **Embedded** | In-flow enhancement |

## Summary

- Customer support: Chatbots with function calling
- Content: Generation, summarization, translation
- Analysis: Classification, extraction, sentiment
- Search: RAG for context-aware answers
- Automation: Email routing, code review
- Choose patterns based on latency and volume requirements

## Additional Resources

- [Spring AI Examples](https://github.com/spring-projects/spring-ai/tree/main/spring-ai-samples)
- [RAG Pattern](https://docs.spring.io/spring-ai/reference/api/vectordbs.html)
