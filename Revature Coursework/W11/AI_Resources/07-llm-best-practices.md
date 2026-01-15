# LLM Best Practices

## Learning Objectives

- Apply proven strategies for effective LLM interaction
- Avoid common mistakes when working with LLMs
- Maximize productivity while maintaining code quality
- Develop a sustainable AI-assisted workflow

## Why This Matters

Having access to powerful LLMs is only valuable if you use them effectively. These best practices will help you become a truly **AI-empowered developer**—one who leverages AI strategically rather than blindly.

## The Concept

### Best Practice Categories

```
┌────────────────────────────────────────────────────────────┐
│                 LLM BEST PRACTICES                         │
├────────────────────────────────────────────────────────────┤
│  1. PROMPTING STRATEGY     │  3. VERIFICATION              │
│  2. CONTEXT MANAGEMENT     │  4. WORKFLOW INTEGRATION      │
└────────────────────────────────────────────────────────────┘
```

---

### 1. Prompting Strategy

#### Be Specific and Explicit

```
❌ "Write a user class"

✅ "Write a Java User class with:
   - Fields: id (Long), email (String), createdAt (LocalDateTime)
   - JPA annotations for PostgreSQL
   - Lombok annotations for getters/setters
   - Validation annotations on email"
```

#### Provide Context

```
❌ "Fix this error"

✅ "I'm using Spring Boot 3.2 with Java 17 and Hibernate.
   Error: LazyInitializationException when accessing user.getOrders()
   Context: This happens in a @RestController method
   [paste relevant code]"
```

#### Specify Output Format

```
❌ "Compare ArrayList and LinkedList"

✅ "Compare ArrayList and LinkedList as a table with columns:
   Operation, ArrayList Time Complexity, LinkedList Time Complexity, Winner"
```

#### Break Complex Tasks Into Steps

```
❌ "Build an e-commerce checkout system"

✅ Step 1: "Design the data model for a shopping cart"
   Step 2: "Implement the Cart entity and CartItem entity"
   Step 3: "Create the CartService with add/remove methods"
   Step 4: "Build the REST endpoints for cart operations"
```

---

### 2. Context Management

#### Include Relevant Code

When asking about code, include:

- The code in question
- Related classes/interfaces
- Configuration if relevant
- Error messages (full stack trace)

#### Stay Within One Domain Per Conversation

Don't mix unrelated topics:

```
❌ Same conversation:
   - "Help me with this SQL query"
   - "Now write some React code"
   - "Explain Docker networking"

✅ Focused conversation:
   - "Design the database schema for users"
   - "Write the User entity class"
   - "Create the UserRepository"
   - "Implement the UserService"
```

#### Reference Previous Responses

```
"In that UserService you created, add a method to find users 
by email domain (e.g., @company.com)"
```

---

### 3. Verification

#### Never Trust Blindly

**Always verify:**

- Code compiles
- Tests pass
- Logic is correct
- Security is sound

#### Test Generated Code

```java
// AI generated this method
public int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// YOU should write these tests
@Test void factorialOfZero_returnsOne() { assertEquals(1, factorial(0)); }
@Test void factorialOfFive_returns120() { assertEquals(120, factorial(5)); }
@Test void factorialOfNegative_shouldHandle() { /* What happens? */ }
```

#### Cross-Reference with Documentation

When the AI gives specific API information:

1. Check the official documentation
2. Verify version compatibility
3. Confirm method signatures

#### Use Multiple Sources

For important decisions:

```
1. Ask LLM for initial answer
2. Check official documentation
3. Search Stack Overflow for edge cases
4. Consult team/senior developers if needed
```

---

### 4. Workflow Integration

#### Know When to Use AI

| Use AI | Don't Use AI |
|--------|--------------|
| Boilerplate code | Critical security logic |
| First draft of docs | Final production code |
| Learning concepts | Understanding proprietary systems |
| Brainstorming | Decisions requiring domain expertise |

#### Iterate Productively

```
First prompt → Review output → Refine requirements → Better prompt → Better output
```

Don't accept the first response if it's not quite right:

```
"Good start, but modify the method to also handle null input 
by returning an empty Optional"
```

#### Maintain Understanding

**Anti-Pattern:** Copying code you don't understand

**Best Practice:**

1. Accept AI-generated code
2. Read and understand every line
3. Modify as needed
4. Add comments explaining non-obvious parts
5. Be able to explain the code to others

---

### Quick Reference Checklist

Before using AI-generated code:

```
☐ I understand what this code does
☐ I have tested critical paths
☐ I have verified external API calls are correct
☐ I have checked for security implications
☐ I have verified performance is acceptable
☐ I can explain this code in a review
☐ The code follows team conventions
```

---

### Common Mistakes to Avoid

| Mistake | Better Approach |
|---------|-----------------|
| Accepting without review | Always read and test |
| Vague prompts | Be specific and contextual |
| Ignoring limitations | Know what AI can't do well |
| Over-reliance | Maintain your own skills |
| Sharing sensitive data | Never share production secrets |
| Trusting API details | Verify against documentation |

## Summary

- Be specific and provide context in every prompt
- Break complex tasks into smaller, focused requests
- Always verify, test, and understand AI-generated code
- Use AI as a productivity multiplier, not a replacement for understanding
- Develop a verification habit—never trust blindly

## Additional Resources

- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results)
- [GitHub Copilot Best Practices](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot)
