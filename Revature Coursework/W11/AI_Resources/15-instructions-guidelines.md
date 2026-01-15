# Instructions and Guidelines

## Learning Objectives

- Learn to write clear, effective instructions in prompts
- Understand how explicit guidelines improve output quality
- Apply constraint-based prompting techniques
- Create reusable instruction patterns

## Why This Matters

Clear instructions are the difference between mediocre and excellent AI outputs. This skill applies to every interaction with LLMs and is essential for **AI-empowered development**.

## The Concept

### Why Instructions Matter

LLMs follow instructions literally but interpret vague requests creatively:

```
Vague:    "Make it better" → LLM guesses what "better" means
Specific: "Improve readability by adding comments and 
          extracting magic numbers to named constants" 
          → LLM knows exactly what to do
```

### Instruction Categories

```
┌────────────────────────────────────────────────────────────┐
│              INSTRUCTION TYPES                             │
├────────────────────────────────────────────────────────────┤
│  WHAT to do    → Task description                         │
│  HOW to do it  → Method/approach                          │
│  BOUNDARIES    → Constraints/limitations                   │
│  OUTPUT FORMAT → How to structure response                 │
│  QUALITY BARS  → Standards to meet                        │
└────────────────────────────────────────────────────────────┘
```

### Writing Effective Instructions

#### 1. Use Imperative Verbs

Start instructions with action verbs:

```
✅ Good verbs: Write, Create, Explain, List, Compare, Analyze, 
              Convert, Validate, Implement, Refactor

❌ Avoid: Maybe, Perhaps, You could, Consider
```

**Examples:**

```
✅ "Write a method that validates email addresses"
✅ "List the top 5 differences between HashMap and TreeMap"
✅ "Refactor this code to use the Strategy pattern"

❌ "Maybe you could write some code..."
❌ "Perhaps explain this concept..."
```

#### 2. Be Explicit About Requirements

```
Implicit (LLM guesses):
"Write a validation method"

Explicit (LLM knows):
"Write a validation method that:
- Takes a User object as input
- Checks email format using regex
- Checks age is between 18 and 120
- Checks name is not null or blank
- Returns a List<String> of error messages (empty if valid)"
```

#### 3. Set Clear Boundaries

Tell the LLM what NOT to do:

```
"Explain Java streams.
- Do NOT include parallel streams (cover later)
- Do NOT exceed 200 words
- Do NOT use technical jargon without explanation"
```

#### 4. Specify Output Format

```
"Compare ArrayList vs LinkedList.

Format your response as:
| Aspect | ArrayList | LinkedList |
|--------|-----------|------------|
..."
```

```
"List 5 design patterns.

Format:
1. **Pattern Name**: One-sentence description
"
```

### Instruction Patterns

#### Pattern 1: Step-by-Step

```
"Complete this task step by step:
1. First, analyze the existing code structure
2. Then, identify the components to extract
3. Next, design the new class hierarchy
4. Finally, implement the refactored solution"
```

#### Pattern 2: Constraint List

```
"Write a REST controller with these constraints:
- Use Spring Boot 3.x conventions
- Include @Valid for request body validation
- Return ResponseEntity for all endpoints
- Log all requests at DEBUG level
- Handle exceptions with @ExceptionHandler"
```

#### Pattern 3: Before/After Requirements

```
"Convert this code:
BEFORE: Uses raw JDBC connections
AFTER: Uses Spring Data JPA with proper repository pattern"
```

#### Pattern 4: Checklist Validation

```
"After generating the code, verify:
☐ All methods have Javadoc
☐ No hardcoded values (use constants)
☐ Null checks on all parameters
☐ Exceptions have meaningful messages"
```

### Guidelines for Code Prompts

#### Include Technical Context

```
"Environment:
- Java 17
- Spring Boot 3.2
- PostgreSQL
- Maven

Task: Create a UserRepository interface..."
```

#### Specify Coding Standards

```
"Follow these coding standards:
- Use camelCase for variables
- Use PascalCase for classes
- Max 120 characters per line
- Prefer composition over inheritance"
```

#### Define Error Handling

```
"Handle errors as follows:
- Input validation: throw IllegalArgumentException
- Not found: throw ResourceNotFoundException
- Database errors: wrap in ServiceException with original cause"
```

### Common Instruction Mistakes

| Mistake | Example | Fix |
|---------|---------|-----|
| Vague task | "Help with code" | "Write a method to..." |
| No format | "List some patterns" | "List 5 patterns as a numbered list" |
| Conflicting | "Be brief but explain in detail" | Choose one |
| Too many | 20 requirements at once | Break into multiple prompts |
| Assumed knowledge | "Do it our usual way" | Specify the way explicitly |

## Summary

- Use imperative verbs to start instructions
- Be explicit about all requirements
- Set clear boundaries on what to include/exclude
- Always specify output format
- Use patterns: step-by-step, constraints, before/after, checklists
- Include relevant technical context

## Additional Resources

- [Clear Instructions - OpenAI](https://platform.openai.com/docs/guides/prompt-engineering/tactic-provide-detailed-instructions)
- [Prompt Structure Best Practices](https://www.promptingguide.ai/introduction/tips)
