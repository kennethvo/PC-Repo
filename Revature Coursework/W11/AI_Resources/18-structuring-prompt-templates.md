# Structuring Your Prompt Template

## Learning Objectives

- Design effective prompt template structures
- Create templates with clear, usable placeholders
- Include appropriate context and instructions
- Build templates that are flexible yet consistent

## Why This Matters

A well-structured template is reusable and produces consistent results. A poorly structured template leads to frustration and inconsistent output. Learn the patterns that work.

## The Concept

### Template Structure Framework

Every effective template has these components:

```
┌─────────────────────────────────────────────────────────────┐
│  1. HEADER (Metadata)                                       │
│     - Template name                                         │
│     - Purpose                                               │
│     - When to use                                           │
├─────────────────────────────────────────────────────────────┤
│  2. CONTEXT SECTION                                         │
│     - Static context (always included)                      │
│     - Variable context (user provides)                      │
├─────────────────────────────────────────────────────────────┤
│  3. TASK DESCRIPTION                                        │
│     - Clear action statement                                │
│     - Specific requirements                                 │
├─────────────────────────────────────────────────────────────┤
│  4. CONSTRAINTS/OPTIONS                                     │
│     - What to include/exclude                               │
│     - Toggleable features                                   │
├─────────────────────────────────────────────────────────────┤
│  5. OUTPUT FORMAT                                           │
│     - How response should be structured                     │
│     - Example if helpful                                    │
└─────────────────────────────────────────────────────────────┘
```

### Designing Placeholders

#### Clear Naming

```
❌ Poor:     {x}, {input}, {stuff}
✅ Good:     {className}, {methodName}, {returnType}
✅ Better:   {className: User}, {methodName: findById}  (with defaults)
```

#### Placeholder Types

| Type | Example | Usage |
|------|---------|-------|
| Required | `{entityName}` | Must be provided |
| Default | `{language: Java}` | Has fallback value |
| Optional | `[{includeTests}]` | Can be omitted |
| Multi-select | `{fields: comma-separated}` | List of items |

### Template Example: Full Breakdown

```markdown
# Template: REST Controller Endpoint

## Purpose
Generate a single REST endpoint in a Spring Boot controller.

## When to Use
When adding a new endpoint to an existing controller.

---

## Template

You are creating a Spring Boot REST endpoint.

### Context
- Framework: Spring Boot 3.x with Java 17
- Controller: {controllerClass}
- Entity: {entityClass}
- Service: {serviceClass}

### Task
Create a {httpMethod} endpoint for {endpointPath}.

### Requirements
- Request: {requestType} (body/path variable/query params)
- Response: {responseType}
- Functionality: {description}
- Validation: {validationRules}

### Options (include if applicable)
[x] Include error handling
[x] Include logging
[ ] Include metrics
[ ] Include security annotations

### Output Format
Provide:
1. The endpoint method with annotations
2. Any DTOs needed (if not using entity directly)
3. Brief explanation of validation applied

---

## Usage Example

- controllerClass: UserController
- entityClass: User
- serviceClass: UserService
- httpMethod: POST
- endpointPath: /api/users
- requestType: RequestBody with CreateUserDTO
- responseType: ResponseEntity<User>
- description: Creates a new user and returns the created entity
- validationRules: Email must be valid, name required, age >= 18
```

### Building Flexible Templates

#### Optional Sections

Use brackets to mark optional sections:

```markdown
Generate a {entityName} repository.

Base requirements:
- Extend JpaRepository<{entityClass}, {idType}>
- Include standard CRUD operations

[OPTIONAL: Custom Queries]
Add custom query methods for: {customQueries}

[OPTIONAL: Auditing]
Include @EntityListeners(AuditingEntityListener.class)
```

#### Conditional Logic

Indicate when sections apply:

```markdown
Create a service method for {operation}.

IF {operation} is CREATE or UPDATE:
- Include validation
- Include null checking for required fields

IF {operation} is DELETE:
- Check existence before deletion
- Return boolean success indicator

IF {operation} is READ:
- Return Optional<{entityClass}>
- Handle not-found gracefully
```

### Template Documentation

#### Include Usage Instructions

```markdown
## How to Fill This Template

1. Replace all {placeholders} with actual values
2. Remove any [OPTIONAL] sections you don't need
3. Verify the generated code compiles
4. Add entity-specific business logic as needed

## Common Mistakes
- Forgetting to specify the ID type
- Not matching the service class name pattern
- Missing validation annotations
```

#### Version Your Templates

```markdown
# Entity Generator Template v2.1
## Changelog
- v2.1: Added support for audit fields
- v2.0: Switched to Lombok annotations
- v1.0: Initial version
```

### Template Testing Checklist

Before finalizing a template:

```
☐ Variables have clear, descriptive names
☐ Default values are sensible
☐ Optional sections are clearly marked
☐ Output format is specified
☐ Usage example is included
☐ Generated output compiles without modification
☐ Template handles common variations
☐ Documentation explains when to use it
```

## Summary

- Templates have 5 key sections: header, context, task, constraints, output format
- Use clear, descriptive placeholder names with defaults when helpful
- Mark optional sections clearly
- Document how to use the template
- Version templates and track improvements
- Test templates to ensure they produce working output

## Additional Resources

- [Template Design Patterns](https://www.promptingguide.ai/techniques)
- [Copilot Custom Instructions](https://docs.github.com/en/copilot)
