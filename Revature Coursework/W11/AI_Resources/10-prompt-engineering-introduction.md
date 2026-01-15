# Prompt Engineering Introduction

## Learning Objectives

- Understand prompt engineering as a systematic discipline
- Learn the core principles of effective prompting
- Recognize the impact of prompt structure on output quality
- Apply foundational prompting patterns

## Why This Matters

We introduced prompting on Monday, and today we dive deep. Prompt engineering is becoming a critical skill for developers. As we continue **"Empowering Developers with AI"**, mastering these techniques will make you dramatically more effective at leveraging AI tools.

## The Concept

### Prompt Engineering as a Discipline

**Prompt engineering** is the systematic practice of designing inputs to AI systems to achieve reliable, high-quality outputs. It combines:

- **Communication skills** (clarity, specificity)
- **Technical understanding** (how LLMs process prompts)
- **Iterative refinement** (testing and improving)

```
┌─────────────────────────────────────────────────────────────┐
│  PROMPT ENGINEERING FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT DESIGN ─────→ LLM PROCESSING ─────→ OUTPUT QUALITY  │
│                                                             │
│  • Clarity           • Token prediction    • Relevance     │
│  • Context           • Pattern matching    • Accuracy      │
│  • Structure         • Attention           • Usefulness    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Core Principles

#### 1. Clarity Over Cleverness

```
❌ "Do that thing with the data"
✅ "Parse this JSON array and extract all email addresses into a List<String>"
```

The LLM cannot read your mind. Be explicit.

#### 2. Context Is King

The more relevant context you provide, the better the output:

| Component | Example |
|-----------|---------|
| Technology stack | "Using Spring Boot 3.2 with Java 17" |
| Current state | "I have a working User entity already" |
| Goal | "I need to add validation for registration" |
| Constraints | "Must use Jakarta validation annotations" |

#### 3. Structure Guides Output

How you structure your prompt influences how the LLM structures its response:

```
Unstructured Prompt:
"Tell me about REST APIs, validation, and error handling"

Structured Prompt:
"For each of these topics, provide a 2-sentence explanation:
1. REST APIs
2. Request validation
3. Error handling"
```

#### 4. Specificity Reduces Ambiguity

| Vague | Specific |
|-------|----------|
| "Make it better" | "Improve readability by extracting this logic into a helper method" |
| "Write tests" | "Write 3 JUnit 5 tests covering happy path, null input, and exception case" |
| "Explain this" | "Explain what this code does line by line, then summarize in one sentence" |

### The Prompt Structure Template

A well-designed prompt often includes these sections:

```markdown
## ROLE (Optional)
Who should the AI act as?

## CONTEXT
What's the situation? What do I already have?

## TASK
What specific action do I need?

## REQUIREMENTS
What constraints or specifications apply?

## FORMAT
How should the output be structured?

## EXAMPLES (Optional)
What does good output look like?
```

### Example: Complete Prompt

```
ROLE: You are an experienced Java developer.

CONTEXT: I'm building a REST API with Spring Boot 3.2 for a 
user management system. I have a UserController and UserService 
already implemented.

TASK: Create a custom exception handler for the controller.

REQUIREMENTS:
- Handle UserNotFoundException (return 404)
- Handle ValidationException (return 400)
- Handle all other exceptions (return 500)
- Log errors appropriately
- Return a consistent error response body

FORMAT: Provide the complete @ControllerAdvice class with all 
necessary imports.
```

### Prompting Patterns Overview

| Pattern | When to Use | Example |
|---------|-------------|---------|
| Zero-shot | Simple, common tasks | "Explain what this does" |
| Few-shot | Custom formats or patterns | "Here's an example, now do this" |
| Chain-of-thought | Complex reasoning | "Think step by step" |
| Role-based | Specialized knowledge | "As a security expert..." |
| Constrained | Specific output requirements | "Respond in exactly 3 bullets" |

*We'll explore Zero-shot and Few-shot in detail next.*

### The Iteration Cycle

Prompt engineering is inherently iterative:

```
1. Draft initial prompt
        ↓
2. Send to LLM
        ↓
3. Analyze output
        ↓
4. Identify gaps
        ↓
5. Refine prompt
        ↓
→ Repeat until satisfied
```

**Tips for iteration:**

- Change one thing at a time
- Keep notes on what works
- Save effective prompts for reuse

## Summary

- Prompt engineering is a systematic discipline, not guesswork
- Core principles: clarity, context, structure, specificity
- Use a consistent template: Role, Context, Task, Requirements, Format
- Prompting is iterative—refine based on results
- Different patterns suit different tasks (zero-shot, few-shot, etc.)

## Additional Resources

- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [OpenAI Prompt Engineering Documentation](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic's Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/intro-to-prompting)
