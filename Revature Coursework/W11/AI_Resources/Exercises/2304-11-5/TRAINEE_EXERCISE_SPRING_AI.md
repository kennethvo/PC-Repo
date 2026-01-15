# Trainee Exercise: Build an AI-Powered API

## Overview

**Duration:** 3-4 hours  
**Type:** Individual Project  
**Mode:** Implementation

## Learning Objectives

- Set up a Spring AI project from scratch
- Implement AI chat functionality
- Use structured output parsing
- Create function calling integrations
- Build a practical AI-enhanced application

## Prerequisites

- Working Java 17+ environment
- Maven or Gradle
- OpenAI API key OR Ollama installed locally
- Spring Boot knowledge

## The Challenge

Build an **AI Study Assistant** that helps students learn programming concepts.

### Core Features

1. **Explain Concepts** - Ask the AI to explain any programming concept
2. **Generate Examples** - Get code examples for concepts
3. **Quiz Me** - Generate quiz questions on a topic
4. **Review Code** - Submit code for AI review and feedback

---

## Instructions

### Part 1: Project Setup (30 minutes)

#### Task 1.1: Create Spring Boot Project

Use Spring Initializr (start.spring.io) with:

- Java 17
- Spring Boot 3.2+
- Dependencies: Spring Web

#### Task 1.2: Add Spring AI

Add to pom.xml:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>1.0.0-M2</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <!-- Choose ONE provider -->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    </dependency>
</dependencies>

<repositories>
    <repository>
        <id>spring-milestones</id>
        <url>https://repo.spring.io/milestone</url>
    </repository>
</repositories>
```

#### Task 1.3: Configure Provider

Create application.yml with your API key (or Ollama config).

**Verify setup works:**
Create a test endpoint that returns a simple AI response.

---

### Part 2: Core Implementation (2 hours)

#### Task 2.1: Define Response Types

Create records for structured responses:

```java
// For concept explanations
record ConceptExplanation(
    String concept,
    String summary,
    String detailedExplanation,
    String codeExample,
    List<String> keyPoints,
    List<String> relatedTopics
) {}

// For quiz questions
record QuizQuestion(
    String question,
    List<String> options,
    String correctAnswer,
    String explanation
) {}

// For code reviews
record CodeReview(
    int qualityScore,
    List<String> issues,
    List<String> improvements,
    String revisedCode
) {}
```

#### Task 2.2: Create Study Service

Implement the core service:

```java
@Service
public class StudyAssistantService {
    
    private final ChatClient chatClient;
    
    // Constructor
    
    public ConceptExplanation explainConcept(String concept, String level) {
        // Implement: Use system prompt for a tutor persona
        // Use .entity() for structured output
    }
    
    public String generateExample(String concept, String language) {
        // Implement: Return code example for the concept
    }
    
    public List<QuizQuestion> generateQuiz(String topic, int count) {
        // Implement: Generate quiz questions
    }
    
    public CodeReview reviewCode(String code, String language) {
        // Implement: Review submitted code
    }
}
```

#### Task 2.3: Create REST Controller

Create endpoints for each feature:

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/study/explain/{concept} | Explain a concept |
| POST | /api/study/example | Generate code example |
| POST | /api/study/quiz | Generate quiz questions |
| POST | /api/study/review | Review submitted code |

---

### Part 3: Add Function Calling (45 minutes)

#### Task 3.1: Create Study Resources

Create a mock resource service:

```java
@Service
public class StudyResourceService {
    
    private final List<Resource> resources = List.of(
        new Resource("1", "Java Basics", "https://docs.oracle.com/...", "beginner"),
        new Resource("2", "Spring Boot Guide", "https://spring.io/...", "intermediate"),
        // Add more...
    );
    
    public List<Resource> findByTopic(String topic) { ... }
    public List<Resource> findByLevel(String level) { ... }
}

record Resource(String id, String title, String url, String level) {}
```

#### Task 3.2: Register Functions

```java
@Configuration
public class StudyFunctions {
    
    @Bean
    @Description("Find study resources by topic (e.g., 'java', 'spring')")
    public Function<TopicRequest, List<Resource>> findResourcesByTopic(
            StudyResourceService service) {
        // Implement
    }
    
    @Bean
    @Description("Find study resources by difficulty level (beginner/intermediate/advanced)")
    public Function<LevelRequest, List<Resource>> findResourcesByLevel(
            StudyResourceService service) {
        // Implement
    }
}
```

#### Task 3.3: Create Assistant Chat

Add a general chat endpoint that can use functions:

```java
@PostMapping("/chat")
public String chat(@RequestBody String message) {
    return chatClient.prompt()
        .system("You are a programming tutor. Help students learn. " +
                "Recommend resources when appropriate.")
        .user(message)
        .functions("findResourcesByTopic", "findResourcesByLevel")
        .call()
        .content();
}
```

---

### Part 4: Testing (30 minutes)

#### Test All Endpoints

Use curl, Postman, or a test class.

**Test 1: Explain Concept**

```bash
curl http://localhost:8080/api/study/explain/java-streams?level=beginner
```

**Test 2: Generate Quiz**

```bash
curl -X POST http://localhost:8080/api/study/quiz \
  -H "Content-Type: application/json" \
  -d '{"topic": "object-oriented programming", "count": 3}'
```

**Test 3: Code Review**

```bash
curl -X POST http://localhost:8080/api/study/review \
  -H "Content-Type: application/json" \
  -d '{"code": "public class Hello { public static void main(String args) { System.out.println(\"Hello\"); }}", "language": "java"}'
```

**Test 4: Function-Enabled Chat**

```bash
curl -X POST http://localhost:8080/api/study/chat \
  -d "I want to learn Java. What resources do you have for beginners?"
```

---

## Deliverable

Submit a ZIP containing:

1. **Complete source code**
2. **README.md** with:
   - Setup instructions
   - API documentation
   - Example requests/responses
3. **Screenshots** of successful API calls
4. **Reflection** (see below)

### Reflection Questions

Answer in 1-2 paragraphs each:

1. What was the most challenging part of integrating Spring AI?
2. How did structured output parsing help your application?
3. When would function calling be most valuable in a production app?
4. What would you add with more time?

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Project setup and configuration | 15 |
| Explain concept endpoint | 20 |
| Quiz generation endpoint | 15 |
| Code review endpoint | 15 |
| Function calling implementation | 20 |
| Testing and documentation | 10 |
| Reflection quality | 5 |
| **Total** | **100** |

---

## Bonus Challenges (+15 points)

1. **Streaming Responses (+5)**: Implement SSE streaming for long responses
2. **Conversation History (+5)**: Maintain chat history across requests
3. **Custom UI (+5)**: Build a simple HTML frontend for the assistant
