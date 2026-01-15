# Identifying Repetitive Tasks

## Learning Objectives

- Recognize tasks suitable for prompt template automation
- Analyze your development workflow for template opportunities
- Prioritize which templates to create first
- Avoid over-templating simple tasks

## Why This Matters

The most effective prompt templates target tasks you do repeatedly. Learning to identify these patterns is key to maximizing your productivity with AI tools.

## The Concept

### What Makes a Task Template-Worthy?

Not every task needs a template. Look for these characteristics:

```
┌─────────────────────────────────────────────────────────────┐
│  TEMPLATE-WORTHY TASK CRITERIA                              │
├─────────────────────────────────────────────────────────────┤
│  ✓ You do it frequently (weekly or more)                   │
│  ✓ It follows a predictable pattern                        │
│  ✓ It takes multiple prompts to get right                  │
│  ✓ The output format should be consistent                  │
│  ✓ Others might benefit from the same template             │
└─────────────────────────────────────────────────────────────┘
```

### Common Template Opportunities

#### Development Tasks

| Task | Frequency | Template Value |
|------|-----------|----------------|
| CRUD operations | High | ⭐⭐⭐⭐⭐ |
| API endpoint creation | High | ⭐⭐⭐⭐⭐ |
| Unit test writing | High | ⭐⭐⭐⭐⭐ |
| Entity/DTO creation | Medium | ⭐⭐⭐⭐ |
| Exception handlers | Medium | ⭐⭐⭐⭐ |
| Configuration classes | Low | ⭐⭐⭐ |

#### Documentation Tasks

| Task | Frequency | Template Value |
|------|-----------|----------------|
| Javadoc comments | High | ⭐⭐⭐⭐⭐ |
| README sections | Medium | ⭐⭐⭐⭐ |
| API documentation | Medium | ⭐⭐⭐⭐ |
| Code review comments | High | ⭐⭐⭐⭐ |

#### Problem-Solving Tasks

| Task | Frequency | Template Value |
|------|-----------|----------------|
| Debugging errors | High | ⭐⭐⭐ |
| Code refactoring | Medium | ⭐⭐⭐ |
| Performance analysis | Low | ⭐⭐ |

### How to Identify Your Patterns

#### Step 1: Track Your Prompts

For one week, note every prompt you write:

```
- What task?
- How many attempts to get good output?
- Would you use this prompt again?
```

#### Step 2: Analyze Patterns

Look for:

- Tasks you did more than 3 times
- Prompts you refined multiple times
- Prompts you wished you had saved

#### Step 3: Calculate ROI

```
Template Value = (Time per prompt × Frequency) − Template creation time

High Value:  5 min × 20 times/month = 100 min saved
Low Value:   2 min × 2 times/month = 4 min saved
```

### Examples of Pattern Recognition

#### Example 1: Entity Creation

You notice you frequently prompt:

```
"Create a Java entity for Customer with fields..."
"Create a Java entity for Order with fields..."
"Create a Java entity for Product with fields..."
```

**Pattern identified:** Entity creation with JPA annotations

**Template opportunity:**

```markdown
Create a JPA entity for {entityName} with:
- Fields: {fieldList}
- Include @Entity, @Table, @Id, @GeneratedValue
- Add Lombok @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor
- Include audit fields (createdAt, updatedAt) with appropriate annotations
```

#### Example 2: Test Creation

You notice you frequently prompt:

```
"Write tests for the UserService.createUser method"
"Write tests for the OrderService.calculateTotal method"
```

**Pattern identified:** Service method testing

**Template opportunity:**

```markdown
Write JUnit 5 tests for {className}.{methodName}:
- Test happy path with valid input
- Test edge cases: {edgeCases}
- Test error handling: {expectedExceptions}
- Use @MockBean for dependencies
- Follow Given-When-Then structure
```

### Tasks NOT Worth Templating

| Task | Why Not |
|------|---------|
| One-time fixes | Won't use again |
| Highly unique requests | No pattern to extract |
| Very simple prompts | Template overhead exceeds benefit |
| Exploratory questions | Different each time |

### Template Prioritization Matrix

```
                    HIGH FREQUENCY
                         │
    Templates to      ┌──┴──┐     Templates to
    create eventually │     │     create FIRST
                      │  3  │  1  │
                      ├─────┼─────┤
    LOW ──────────────┼─────┼─────┼────────── HIGH
    COMPLEXITY        │  4  │  2  │         COMPLEXITY
                      │     │     │
                      └──┬──┘     Templates to
    Don't template      │        create second
                    LOW FREQUENCY
```

**Priority order:** 1 → 2 → 3 → (skip 4)

## Summary

- Template-worthy tasks are frequent, predictable, and pattern-based
- Track your prompts to identify repetitive patterns
- Calculate the ROI: time saved vs. creation effort
- Prioritize high-frequency, high-complexity tasks first
- Don't over-template—simple, one-time tasks don't need templates

## Additional Resources

- [Productivity with AI Tools](https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/)
