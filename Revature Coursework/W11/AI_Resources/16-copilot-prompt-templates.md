# Copilot Prompt Templates

## Learning Objectives

- Understand what prompt templates are
- Learn why templates improve productivity
- Recognize how templates standardize AI interactions
- Create effective prompt templates

## Why This Matters

Prompt templates turn your best prompts into reusable assets. Instead of crafting new prompts for similar tasks, you can use proven templates that consistently deliver good results.

## The Concept

### What Are Prompt Templates?

A **prompt template** is a pre-written prompt structure with placeholders for variable content. Think of them as functions for prompts:

```
TEMPLATE:
"Write a {language} method called {methodName} that:
- Takes {parameters}
- Returns {returnType}
- {requirements}

Include: {includeOptions}"

USAGE:
"Write a Java method called validateEmail that:
- Takes String email
- Returns boolean
- Validates using regex and checks for null

Include: Javadoc comments"
```

### Why Use Templates?

| Benefit | Description |
|---------|-------------|
| Consistency | Same quality every time |
| Speed | No need to think about structure |
| Best practices | Templates encode learned patterns |
| Team alignment | Everyone uses same prompts |
| Iteration | Improve template once, benefit everywhere |

### Template Structure

```
┌─────────────────────────────────────────────────────────────┐
│  PROMPT TEMPLATE ANATOMY                                    │
├─────────────────────────────────────────────────────────────┤
│  [STATIC CONTEXT]        → Always included                  │
│  {variable}              → Replaced for each use            │
│  [OPTIONAL: section]     → Include when relevant            │
│  [INSTRUCTIONS]          → How to complete the task         │
│  [OUTPUT FORMAT]         → Expected structure               │
└─────────────────────────────────────────────────────────────┘
```

### Example Templates

#### Template 1: Method Generation

```markdown
# Method Generation Template

Write a {language} method with the following specifications:

**Method Name:** {methodName}
**Parameters:** {parameters}
**Return Type:** {returnType}
**Purpose:** {description}

Requirements:
- {requirement1}
- {requirement2}
- {requirement3}

Code Style:
- Include null checks for all reference parameters
- Add appropriate documentation
- Follow {styleGuide} conventions

[OPTIONAL: Include unit test examples]
```

**Usage:**

```
Language: Java
Method Name: findActiveUsers
Parameters: LocalDate since, int limit
Return Type: List<User>
Description: Finds active users who logged in since the given date
Requirements:
- Sort by last login descending
- Limit results to specified count
- Exclude deactivated accounts
Style Guide: Google Java Style
Include: unit test examples
```

#### Template 2: Code Review

```markdown
# Code Review Template

Review the following code for:

1. **Bugs:** Logic errors, null pointer risks, edge cases
2. **Performance:** Inefficiencies, unnecessary operations
3. **Readability:** Naming, structure, complexity
4. **Best Practices:** {framework} patterns, SOLID principles
5. **Security:** {securityConcerns}

Code to review:
```{language}
{code}
```

Provide feedback in this format:

- **Issue:** Description
- **Location:** Line number or section
- **Severity:** Critical/Major/Minor
- **Suggestion:** How to fix

```

#### Template 3: Exception Handling

```markdown
# Exception Handler Template

Create a {framework} exception handler for:

**Exception Type:** {exceptionClass}
**HTTP Status:** {statusCode}
**Response Body:** {responseStructure}

Additional requirements:
- Log the error at {logLevel} level
- Include {debugInfo} in non-production environments
- Reference: correlation ID from request header

Generate the handler method and any supporting classes.
```

#### Template 4: Test Generation

```markdown
# Test Generation Template

Generate {testFramework} tests for the following code:

```{language}
{codeToTest}
```

Test coverage requirements:

- Happy path scenarios: {happyPaths}
- Edge cases: {edgeCases}
- Error scenarios: {errorScenarios}

Test style:

- Use {namingConvention} for test method names
- Use {assertionStyle} assertions
- Include {setupTeardown} setup/teardown if needed

```

### Creating Your Own Templates

#### Step 1: Identify Repetitive Prompts

What prompts do you write frequently?
- CRUD operations?
- API endpoints?
- Validation logic?
- Test cases?

#### Step 2: Extract the Pattern

Take a successful prompt and identify:
- What stays the same?
- What changes?

#### Step 3: Create Placeholders

Replace variable parts with clear placeholders:
```

Actual:    "Write a Java method called findByEmail"
Template:  "Write a {language} method called {methodName}"

```

#### Step 4: Add Default Values

Include sensible defaults:
```

{language: Java}
{framework: Spring Boot 3.x}
{testFramework: JUnit 5}

```

#### Step 5: Document and Share

Add usage examples and share with your team.

### Template Maintenance

Keep templates effective by:
- Reviewing results regularly
- Updating based on learnings
- Removing templates that don't work well
- Sharing improvements with the team

## Summary

- Prompt templates are reusable prompt structures with placeholders
- Templates ensure consistent, high-quality outputs
- Good templates include context, variables, and clear instructions
- Create templates from frequently used, successful prompts
- Maintain and improve templates over time

## Additional Resources

- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot)
- [Prompt Template Libraries](https://www.promptingguide.ai/prompts)
