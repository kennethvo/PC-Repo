# Interaction and Dialog State

## Learning Objectives

- Understand how multi-turn conversations work with LLMs
- Learn to maintain context across interactions
- Recognize context window limitations
- Apply strategies for effective dialog management

## Why This Matters

Real development conversations with AI aren't single prompts—they're ongoing dialogs. Understanding how LLMs handle conversation history helps you work more effectively and avoid common pitfalls.

## The Concept

### How LLMs Handle Conversations

LLMs don't have true memory—each request sends the entire conversation history:

```
┌─────────────────────────────────────────────────────────────┐
│  TURN 1                                                     │
├─────────────────────────────────────────────────────────────┤
│  User: "Write a User class in Java"                        │
│  LLM: [generates User class]                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  TURN 2 (What's actually sent)                              │
├─────────────────────────────────────────────────────────────┤
│  [System prompt]                                            │
│  User: "Write a User class in Java"                        │
│  Assistant: [entire User class response]                    │
│  User: "Add a method to validate the email"                │
│  LLM: [generates validation method]                         │
└─────────────────────────────────────────────────────────────┘
```

### Context Window

The **context window** is the maximum amount of text (in tokens) the model can process at once:

| Model | Context Window |
|-------|----------------|
| GPT-3.5 | 16K tokens |
| GPT-4 | 128K tokens |
| Claude 3 | 200K tokens |
| Copilot Chat | Varies |

**Implications:**

- Long conversations can exceed the limit
- When exceeded, earlier context is typically dropped
- Code + conversation both count toward the limit

### Maintaining Context Effectively

#### 1. Reference Previous Responses

```
Turn 1: "Write a UserService class with findById"
Turn 2: "In that UserService, add a deleteUser method"
Turn 3: "Now add logging to all methods in UserService"
```

#### 2. Summarize When Needed

If the conversation is long:

```
"Let me summarize where we are:
- We have a UserService with CRUD operations
- We added logging
- Now I need to add caching to the findById method"
```

#### 3. Bring Context Forward

When context might be lost:

```
"Referring to the User class we created earlier (with id, email, name fields),
add a constructor that takes all fields"
```

### Dialog Patterns

#### Pattern 1: Iterative Refinement

```
Turn 1: "Write a method to validate passwords"
Turn 2: "Add a check for at least one uppercase letter"
Turn 3: "Also require at least one number"
Turn 4: "Now refactor to return a list of violations instead of boolean"
```

#### Pattern 2: Exploration

```
Turn 1: "What are my options for caching in Spring Boot?"
Turn 2: "Tell me more about Redis option"
Turn 3: "How would I implement that with my UserService?"
Turn 4: "Show me the configuration"
```

#### Pattern 3: Problem Solving

```
Turn 1: "I'm getting this error: [error message]"
Turn 2: "I tried your suggestion, now getting: [new error]"
Turn 3: "That fixed it. Can you explain why that worked?"
```

### When to Start a New Conversation

| Continue Conversation | Start New Conversation |
|----------------------|------------------------|
| Building on previous code | Unrelated topic |
| Iterating on same feature | Different project |
| Troubleshooting same issue | Context causing confusion |
| Related questions | Hit context limit |

### Managing Long Conversations

#### 1. Condense History

```
"Let me recap: We built a User entity, UserRepository, UserService,
and UserController. Now I need to add pagination to the findAll endpoint."
```

#### 2. Extract and Reference

```
"I'll reference the code we wrote (saved in UserService.java).
Now I need a similar pattern for ProductService."
```

#### 3. Reset When Confused

If the LLM seems confused by conflicting earlier context:

```
"Let's start fresh on this. I have a Spring Boot app with..."
```

### Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Too many topics | LLM loses focus | One topic per conversation |
| No references | "Which class?" confusion | Be explicit about references |
| Stale context | Old info conflicts | Summarize current state |
| Over-reliance | Assumes LLM remembers | Provide key context each time |

### Dialog State Indicators

Watch for these signs:

**Context is working well:**

- LLM references previous code correctly
- Builds appropriately on earlier responses
- Maintains consistent naming/style

**Context is degrading:**

- LLM asks about previously discussed items
- Contradicts earlier responses
- Uses different names/style than established

## Summary

- LLMs send entire conversation history with each request
- Context windows limit how much history can be processed
- Reference previous responses explicitly for clarity
- Summarize long conversations to maintain focus
- Start new conversations when topics change or context degrades

## Additional Resources

- [Chat Completion API - OpenAI](https://platform.openai.com/docs/guides/chat)
- [Managing Long Conversations - Anthropic](https://docs.anthropic.com/claude/docs/conversation-management)
