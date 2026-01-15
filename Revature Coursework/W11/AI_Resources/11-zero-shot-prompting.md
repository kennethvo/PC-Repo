# Zero-Shot Prompting

## Learning Objectives

- Understand what zero-shot prompting is
- Recognize when zero-shot prompting is appropriate
- Apply zero-shot prompting effectively
- Know the limitations of zero-shot approaches

## Why This Matters

Zero-shot prompting is the most common way developers interact with LLMs. Understanding its strengths and limitations helps you know when it will work well and when you need more advanced techniques.

## The Concept

### What is Zero-Shot Prompting?

**Zero-shot prompting** means asking the LLM to perform a task without providing any examples in the prompt. You describe what you want, and the model uses its training to generate the response.

```
┌─────────────────────────────────────────────────────────────┐
│  ZERO-SHOT PROMPTING                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Prompt: "Write a Java method to calculate factorial"       │
│                                                             │
│  ↓ No examples provided                                     │
│                                                             │
│  LLM: Uses training knowledge to generate method            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Zero-Shot vs Few-Shot

| Aspect | Zero-Shot | Few-Shot |
|--------|-----------|----------|
| Examples in prompt | None | 1 or more |
| Prompt length | Shorter | Longer |
| Token usage | Lower | Higher |
| When to use | Common tasks | Custom patterns |

### When Zero-Shot Works Well

Zero-shot prompting is most effective for:

**1. Common Programming Tasks**

```
"Write a Java method that checks if a string is a palindrome"
```

The LLM has seen thousands of palindrome implementations.

**2. Standard Explanations**

```
"Explain the difference between GET and POST HTTP methods"
```

Well-documented concepts with consistent definitions.

**3. Code Translation**

```
"Convert this Python function to Java:
def add(a, b):
    return a + b"
```

Straightforward transformation.

**4. Bug Identification**

```
"What's wrong with this code?
String s = null;
System.out.println(s.length());"
```

Common error pattern.

### Zero-Shot Prompt Patterns

#### Pattern 1: Direct Request

```
"Write a SQL query to find all users who registered in the last 30 days"
```

#### Pattern 2: Task + Constraints

```
"Write a Java method to validate email addresses.
Use regex and return a boolean."
```

#### Pattern 3: Task + Context + Requirements

```
"I'm using Spring Boot with JPA.
Write a repository method that finds users by email domain.
Use Spring Data query derivation syntax."
```

#### Pattern 4: Role + Task

```
"As a code reviewer, identify potential issues in this code:
[code snippet]"
```

### Improving Zero-Shot Results

Even without examples, you can improve results:

#### Be Specific About Output Format

```
Instead of: "Explain REST"

Use: "Explain REST in exactly 5 bullet points, each under 20 words"
```

#### Provide Relevant Context

```
Instead of: "Write a login method"

Use: "Write a Spring Security login method that:
- Takes username and password
- Returns a JWT token
- Throws AuthenticationException on failure"
```

#### Use Role Assignment

```
Instead of: "Review this code"

Use: "As a senior Java developer conducting a code review, 
identify any issues with this code and suggest improvements"
```

### When Zero-Shot Falls Short

Zero-shot may not work well for:

| Scenario | Problem | Solution |
|----------|---------|----------|
| Custom format | LLM guesses format | Use few-shot with examples |
| Domain-specific tasks | Unusual patterns | Provide examples |
| Specific coding style | Doesn't match preferences | Show style examples |
| Complex multi-step | May miss steps | Use chain-of-thought |

### Zero-Shot Examples

#### Example 1: Effective Zero-Shot

```
Prompt: "Write a Java method called 'capitalizeWords' that takes a 
String and returns it with the first letter of each word capitalized.
Handle null input by returning null."
```

This works well because:

- Clear method name
- Clear input/output types
- Specific edge case handling

#### Example 2: Zero-Shot Reaching Its Limits

```
Prompt: "Format this data as we typically do in our team reports"
```

This won't work because:

- LLM doesn't know your team's format
- Need to provide an example (few-shot)

## Summary

- Zero-shot prompting asks the LLM to perform tasks without examples
- Works well for common tasks, standard patterns, and well-documented concepts
- Improve results by being specific, providing context, and using roles
- Falls short for custom formats, domain-specific tasks, or specific styles
- When zero-shot isn't enough, upgrade to few-shot prompting

## Additional Resources

- [Zero-Shot Learning Explained - Prompt Engineering Guide](https://www.promptingguide.ai/techniques/zeroshot)
- [OpenAI Prompt Examples](https://platform.openai.com/examples)
