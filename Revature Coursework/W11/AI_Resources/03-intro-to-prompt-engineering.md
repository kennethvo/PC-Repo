# Introduction to Prompt Engineering

## Learning Objectives

- Define prompt engineering and its importance
- Understand the basic anatomy of an effective prompt
- Recognize common prompting mistakes
- Apply fundamental prompting techniques

## Why This Matters

If GenAI is the powerful engine, then prompts are the steering wheel. As we continue our **"Empowering Developers with AI"** journey, mastering prompt engineering is what separates developers who get mediocre AI outputs from those who get exceptional results. This skill will become as fundamental as knowing how to write good search queries or API requests.

## The Concept

### What is Prompt Engineering?

**Prompt Engineering** is the practice of crafting inputs (prompts) to AI systems to achieve desired outputs. It's part art, part science—combining clear communication with an understanding of how AI models process information.

```
Prompt Engineering = Clear Intent + Proper Context + Structured Format
```

### Why Does Prompting Matter?

The same AI model can produce vastly different results based on how you ask:

| Prompt Quality | Example Prompt | Typical Result |
|----------------|----------------|----------------|
| **Poor** | "code" | Confusion or generic output |
| **Basic** | "Write Java code" | Simple, possibly off-target code |
| **Good** | "Write a Java method to validate email addresses" | Functional code |
| **Excellent** | "Write a Java method that validates email addresses using regex. Return true if valid, false otherwise. Include javadoc and unit test examples." | Production-ready code with docs |

### The Anatomy of an Effective Prompt

A well-structured prompt typically includes these elements:

```
┌─────────────────────────────────────────────────────────┐
│  1. ROLE (Optional)                                      │
│     "You are an experienced Java developer..."           │
├─────────────────────────────────────────────────────────┤
│  2. CONTEXT                                              │
│     "I'm building a user registration system..."         │
├─────────────────────────────────────────────────────────┤
│  3. TASK                                                 │
│     "Write a method that validates email addresses..."   │
├─────────────────────────────────────────────────────────┤
│  4. CONSTRAINTS/REQUIREMENTS                             │
│     "Use regex, return boolean, handle null input..."    │
├─────────────────────────────────────────────────────────┤
│  5. OUTPUT FORMAT (Optional)                             │
│     "Include the method signature, implementation,       │
│      and example usage in your response..."              │
└─────────────────────────────────────────────────────────┘
```

### Basic Prompting Techniques

#### 1. Be Specific

```
Instead of: "Help me with my code"
Use:        "Debug this NullPointerException in my Java UserService class"

Instead of: "Write a function"
Use:        "Write a Python function that converts Celsius to Fahrenheit"
```

#### 2. Provide Context

```
Instead of: "Fix this error"
Use:        "I'm using Spring Boot 3.2 with Java 17. I'm getting this error 
             when starting my application: [paste error]. Here's my 
             configuration: [paste config]"
```

#### 3. Specify the Output Format

```
Instead of: "Explain REST APIs"
Use:        "Explain REST APIs in 3 bullet points, suitable for a 
             beginner developer"

Instead of: "List some design patterns"
Use:        "List 5 design patterns commonly used in Java, formatted as 
             a table with columns: Pattern Name, Use Case, Example"
```

#### 4. Use Examples (When Helpful)

```
"Convert the following text to camelCase:
 Example: 'hello world' → 'helloWorld'
 Now convert: 'user first name'"
```

### Common Prompting Mistakes

| Mistake | Example | Better Approach |
|---------|---------|-----------------|
| Too vague | "Make it better" | "Improve readability by adding comments and meaningful variable names" |
| No context | "Why doesn't this work?" | "Why does this Spring Boot controller return 404 when I call /api/users?" |
| Assuming knowledge | "Use the usual pattern" | "Use the Repository pattern with Spring Data JPA" |
| Overloading | One prompt with 10 different requests | Break into smaller, focused prompts |

### Prompting for Code: Quick Tips

```java
// GOOD: Specific request with context
"Write a Java method for a Spring Boot REST controller that:
- Handles GET requests to /api/products/{id}
- Returns a Product object as JSON
- Returns 404 if product not found
- Uses constructor injection for the ProductService"

// RESULT: Accurate, usable code
```

```java
// POOR: Vague request
"Write a controller method"

// RESULT: Generic code that may not fit your needs
```

### The Iterative Approach

Prompt engineering is often iterative—you refine based on results:

```
1. Start with initial prompt
            ↓
2. Review the output
            ↓
3. Identify gaps or issues
            ↓
4. Refine the prompt
            ↓
5. Repeat until satisfied
```

### Preview: Advanced Techniques

*We'll cover these in depth on Wednesday:*

- **Zero-shot prompting**: Getting results without examples
- **Few-shot prompting**: Providing examples to guide output
- **Chain-of-thought**: Encouraging step-by-step reasoning
- **Prompt templates**: Creating reusable prompt structures

## Summary

- Prompt engineering is the skill of crafting effective inputs for AI systems
- Good prompts are specific, contextual, and clearly structured
- The basic anatomy includes: role, context, task, constraints, and output format
- Common mistakes include being too vague, lacking context, and overloading prompts
- Prompting is iterative—refine based on the outputs you receive

## Additional Resources

- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [OpenAI Prompt Engineering Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google's Introduction to Prompt Design](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/introduction-prompt-design)
