# Searching Codebases with GenAI

## Learning Objectives

- Use AI to understand unfamiliar codebases
- Navigate large projects efficiently with AI assistance
- Ask effective questions about code structure
- Leverage AI-powered code search tools

## Why This Matters

Every developer faces unfamiliar codebases—new jobs, open-source contributions, or legacy projects. AI dramatically reduces the time to understand how code works and where to make changes.

## The Concept

### AI-Powered Code Understanding

Traditional search finds text. AI-powered search understands intent:

```
Traditional: Search "user" → finds all files with "user" in name
AI-powered:  "Where is user authentication handled?" → finds auth logic
```

### Codebase Questions to Ask AI

#### Understanding Structure

```
"Explain the architecture of this Spring Boot project. 
What are the main packages and their responsibilities?"

"How is the code organized? What patterns does it follow?"

"Where would I add a new REST endpoint for managing products?"
```

#### Finding Implementation

```
"Where is user authentication implemented?"

"What class handles order pricing calculations?"

"How does the application connect to the database?"
```

#### Understanding Flow

```
"Trace the flow of a user login request from controller to database."

"What happens when an order is placed? Walk through the code path."

"How are exceptions handled in this project?"
```

### Using Copilot Chat for Codebase Questions

**In VS Code with Copilot:**

```
# @workspace where is authentication handled?

# @workspace explain the OrderService class

# @workspace how would I add a new entity?

# @workspace find all usages of the UserRepository
```

The `@workspace` directive tells Copilot to search your codebase.

### Using Chat-Based AI (ChatGPT/Claude)

When using external AI, provide context:

```
I'm working on a Spring Boot e-commerce application. Here's the structure:

src/main/java/com/example/
├── controller/
│   ├── OrderController.java
│   ├── ProductController.java
│   └── UserController.java
├── service/
│   ├── OrderService.java
│   ├── ProductService.java
│   └── UserService.java
├── repository/
│   └── ...
└── model/
    └── ...

I need to add a feature for order discounts. 
Where should I put this logic and what files would I need to modify?
```

### Dedicated Codebase AI Tools

| Tool | Description |
|------|-------------|
| **Sourcegraph Cody** | AI that indexes and searches your entire codebase |
| **Cursor** | IDE with built-in AI understanding of project |
| **Bloop** | Natural language code search |
| **GitHub Code Search** | AI-enhanced search across repositories |

### Effective Codebase Questions

| Question Type | Example |
|---------------|---------|
| Location | "Where is X implemented?" |
| Explanation | "What does this class do?" |
| Flow | "How does data get from A to B?" |
| Pattern | "What pattern is used for database access?" |
| Modification | "How would I add a new feature like X?" |
| Debugging | "What could cause this error?" |

### Limitations and Tips

**Limitations:**

- AI may not have your latest code (refresh/re-index)
- Large monorepos can be partially indexed
- Private/proprietary patterns may not be understood
- AI can make mistakes about your specific code

**Tips:**

1. Be specific about file names or class names when known
2. Provide context about your project structure
3. Verify answers by actually reading the code
4. Use AI to narrow down, then manually explore

## Summary

- AI transforms code search from text matching to intent understanding
- Use @workspace in Copilot for codebase-aware questions
- Provide structure context when using external AI
- Ask about structure, implementation, flow, and modification
- Always verify AI answers against actual code

## Additional Resources

- [Sourcegraph Cody](https://sourcegraph.com/cody)
- [GitHub Code Search](https://github.com/search)
- [Cursor IDE](https://cursor.sh)
