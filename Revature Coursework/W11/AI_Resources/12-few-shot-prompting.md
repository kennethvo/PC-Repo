# Few-Shot Prompting

## Learning Objectives

- Understand what few-shot prompting is
- Know when to use few-shot over zero-shot
- Construct effective few-shot prompts
- Apply few-shot patterns for consistent output

## Why This Matters

Few-shot prompting is your secret weapon for getting consistent, customized output from LLMs. When zero-shot doesn't produce the format or style you need, few-shot provides the control you need.

## The Concept

### What is Few-Shot Prompting?

**Few-shot prompting** means providing one or more examples in your prompt to show the LLM exactly what you want. The model learns the pattern from your examples and applies it to new input.

```
┌─────────────────────────────────────────────────────────────┐
│  FEW-SHOT PROMPTING                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Example 1: Input → Output                                  │
│  Example 2: Input → Output                                  │
│  Example 3: Input → Output                                  │
│                                                             │
│  Actual Task: New Input → ?                                 │
│                                                             │
│  LLM: Learns pattern from examples, applies to new input    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Terminology

| Term | Examples Provided |
|------|-------------------|
| Zero-shot | 0 examples |
| One-shot | 1 example |
| Few-shot | 2-5 examples |
| Many-shot | 6+ examples |

### When to Use Few-Shot

| Scenario | Why Few-Shot Helps |
|----------|-------------------|
| Custom output format | Shows exact structure |
| Specific coding style | Demonstrates patterns |
| Consistent responses | Reduces variation |
| Domain terminology | Teaches vocabulary |
| Classification tasks | Shows category mapping |

### Few-Shot Structure

```markdown
## Task Description
Explain what you want the model to do.

## Examples

### Example 1
Input: [example input]
Output: [example output]

### Example 2
Input: [example input]
Output: [example output]

## Your Task
Input: [actual input]
Output:
```

### Practical Examples

#### Example 1: Code Comments

**Prompt:**

```
Convert method signatures to Javadoc comments.

Example 1:
Method: public int add(int a, int b)
Javadoc:
/**
 * Adds two integers together.
 * @param a the first integer
 * @param b the second integer
 * @return the sum of a and b
 */

Example 2:
Method: public String reverse(String input)
Javadoc:
/**
 * Reverses the characters in a string.
 * @param input the string to reverse
 * @return the reversed string
 */

Now convert this:
Method: public boolean isValid(String email, boolean strict)
Javadoc:
```

The LLM will follow the established pattern.

#### Example 2: Data Transformation

**Prompt:**

```
Convert these class descriptions to Java record definitions.

Example 1:
Description: A Point with x and y coordinates (integers)
Record: public record Point(int x, int y) {}

Example 2:
Description: A Person with name (String) and age (int)
Record: public record Person(String name, int age) {}

Now convert:
Description: A Product with id (Long), name (String), and price (BigDecimal)
Record:
```

#### Example 3: Error Message Formatting

**Prompt:**

```
Format error messages for our API responses.

Example 1:
Error: User not found
Formatted: {"error": "NOT_FOUND", "message": "User not found", "status": 404}

Example 2:
Error: Invalid email format
Formatted: {"error": "VALIDATION_ERROR", "message": "Invalid email format", "status": 400}

Now format:
Error: Database connection failed
Formatted:
```

### Best Practices for Few-Shot

#### 1. Use Diverse Examples

```
✅ Good: Show different variations
Example 1: Simple case
Example 2: Edge case
Example 3: Complex case

❌ Bad: All examples are too similar
Example 1: Simple case A
Example 2: Simple case B
Example 3: Simple case C
```

#### 2. Keep Examples Consistent

All examples should follow the exact same format:

```
✅ Good:
Input: "hello" → Output: "HELLO"
Input: "world" → Output: "WORLD"

❌ Bad:
Input: "hello" → Output: HELLO
Input: world → Output: "WORLD"
```

#### 3. Order Matters

Place simpler examples first, complex examples later:

```
Example 1: Simple case (teaches basic pattern)
Example 2: Medium complexity (adds nuance)
Example 3: Edge case (handles exceptions)
```

#### 4. Enough But Not Too Many

| Examples | Tradeoff |
|----------|----------|
| 1 | May not capture full pattern |
| 2-3 | Usually optimal |
| 4-5 | Good for complex patterns |
| 6+ | Uses more tokens, diminishing returns |

### Few-Shot for Code

**Prompt:**

```
Generate validation methods following this pattern:

Example 1:
Field: username (must be 3-20 characters)
Method:
public boolean isValidUsername(String username) {
    if (username == null) return false;
    return username.length() >= 3 && username.length() <= 20;
}

Example 2:
Field: age (must be 0-150)
Method:
public boolean isValidAge(Integer age) {
    if (age == null) return false;
    return age >= 0 && age <= 150;
}

Now generate:
Field: email (must contain @ and end with common TLD)
Method:
```

## Summary

- Few-shot prompting provides examples to show the LLM your desired pattern
- Use when zero-shot doesn't produce the right format or style
- 2-3 diverse, consistent examples usually work best
- Structure: description → examples → actual task
- Particularly useful for custom formats, coding styles, and classification

## Additional Resources

- [Few-Shot Prompting - Prompt Engineering Guide](https://www.promptingguide.ai/techniques/fewshot)
- [Few-Shot Learning Research](https://arxiv.org/abs/2005.14165)
