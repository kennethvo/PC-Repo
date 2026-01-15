# Example Prompt Templates

## Learning Objectives

- See practical, ready-to-use prompt templates
- Understand how templates apply to common development tasks
- Customize templates for your specific needs
- Build your own template library

## Why This Matters

The best way to learn templates is through examples. This collection provides working templates you can use immediately and adapt for your projects.

## Template Library

### Template 1: Service Method Generator

**Use for:** Creating service layer methods in Spring Boot

```markdown
# Service Method Template

## Context
- Framework: Spring Boot 3.x / Java 17
- Project: {projectContext}
- Service class: {serviceClassName}
- Repository: {repositoryClassName}

## Task
Create a service method for **{operation}** on **{entityName}**.

## Specifications
- Method name: {methodName}
- Parameters: {parameters}
- Return type: {returnType}
- Dependencies: {dependencies}

## Requirements
- Include proper exception handling
- Add @Transactional annotation if modifying data
- Validate input parameters
- Add logging at DEBUG level for entry/exit
- Add logging at ERROR level for exceptions

## Output
Provide the complete method with:
1. Method signature with annotations
2. Implementation
3. Javadoc comment
```

---

### Template 2: DTO Generator

**Use for:** Creating DTOs for API requests/responses

```markdown
# DTO Generator Template

## Task
Create a **{dtoType}** DTO for **{entityName}**.

DTO Type options: Request, Response, Patch, Summary

## Entity Fields Reference
{entityFields}

## Requirements
- Use Java record syntax
- Include validation annotations for Request DTOs:
  - @NotNull for required fields
  - @Size for string length limits
  - @Email for email fields
  - @Positive for numeric IDs
- Include @JsonProperty if JSON name differs from Java name
- Exclude sensitive fields: {excludeFields}

## Mapping
{mappingInstructions}

## Output
Provide:
1. The DTO record
2. A static factory method for common conversions
```

---

### Template 3: API Endpoint

**Use for:** Creating REST controller endpoints

```markdown
# API Endpoint Template

## Endpoint Details
- Path: {endpointPath}
- HTTP Method: {httpMethod}
- Controller: {controllerClass}

## Request
- Path variables: {pathVariables}
- Query parameters: {queryParams}
- Request body: {requestBodyType}

## Response
- Success: {successResponse} (HTTP {successStatus})
- Errors: {errorResponses}

## Business Logic
{businessDescription}

## Requirements
- Use ResponseEntity for all responses
- Include @Valid for request body validation
- Include appropriate Swagger/OpenAPI annotations
- Log the request at INFO level

## Generate
1. The endpoint method
2. Any helper methods needed
3. Suggested integration test outline
```

---

### Template 4: Unit Test Suite

**Use for:** Generating comprehensive unit tests

```markdown
# Unit Test Template

## Class Under Test
```{language}
{classCode}
```

## Test Framework

- JUnit 5
- Mockito for mocking
- AssertJ for assertions

## Coverage Requirements

### Happy Path Tests

{happyPathScenarios}

### Edge Case Tests

{edgeCaseScenarios}

### Error Handling Tests

{errorScenarios}

## Test Style

- Method naming: should_{outcome}_when_{condition}
- Use @BeforeEach for common setup
- Use @DisplayName for readable test names
- Group related tests with @Nested

## Generate

Complete test class with all specified scenarios.

```

---

### Template 5: Exception Handler

**Use for:** Creating global exception handlers

```markdown
# Exception Handler Template

## Exceptions to Handle

| Exception | HTTP Status | Error Code | Message Template |
|-----------|-------------|------------|------------------|
{exceptionTable}

## Error Response Format
```json
{
  "timestamp": "ISO-8601",
  "status": number,
  "error": "Error code",
  "message": "User-friendly message",
  "path": "Request path",
  "details": {} // Optional additional info
}
```

## Requirements

- Use @RestControllerAdvice
- Log all exceptions at appropriate levels
- Include correlation ID from header: X-Correlation-ID
- Mask sensitive information in error messages

## Generate

1. ErrorResponse DTO
2. GlobalExceptionHandler class
3. Example of custom exception if needed

```

---

### Template 6: Code Review

**Use for:** Getting structured code review feedback

```markdown
# Code Review Template

## Code to Review
```{language}
{code}
```

## Context

- Project type: {projectType}
- Team standards: {standards}
- Focus areas: {focusAreas}

## Review Categories

### 1. Correctness

- Logic errors
- Edge cases not handled
- Potential bugs

### 2. Performance

- Inefficient algorithms
- Unnecessary operations
- Resource leaks

### 3. Maintainability

- Code clarity
- Naming conventions
- Method length
- Single Responsibility

### 4. Security

- Input validation
- Sensitive data handling
- Injection risks

### 5. {customCategory}

{customCriteria}

## Output Format

For each issue found:

- **Category:** Classification
- **Severity:** 🔴 Critical | 🟡 Major | 🟢 Minor
- **Location:** Line number or section
- **Issue:** Description
- **Suggestion:** How to fix

```

---

### Template 7: Documentation

**Use for:** Generating README sections or technical docs

```markdown
# Documentation Template

## Document Type
{docType: README section | API doc | Architecture doc | User guide}

## Content Focus
{focus}

## Audience
{audience: Developers | End users | Stakeholders}

## Information to Include
{information}

## Tone
- Technical but accessible
- Concise
- Include examples where helpful

## Format Requirements
- Use markdown headings
- Include code examples with syntax highlighting
- Use tables for comparisons
- Add links to related documentation

## Generate
{docType} covering the specified information.
```

---

## Customization Tips

### Adapting Templates

1. **Start with a base template**
2. **Identify what's different** for your project
3. **Add project-specific context** (your conventions, naming patterns)
4. **Test the template** with a real example
5. **Iterate** based on output quality

### Building Your Template Library

```
/my-templates
  /code-generation
    - entity-template.md
    - controller-template.md
    - service-template.md
  /testing
    - unit-test-template.md
    - integration-test-template.md
  /documentation
    - readme-template.md
    - api-doc-template.md
  /review
    - code-review-template.md
```

## Summary

- These templates cover common development tasks
- Customize placeholders for your project specifics
- Build a library of templates you use frequently
- Share templates with your team for consistency
- Iterate on templates based on output quality

## Additional Resources

- [Prompt Template Collections](https://www.promptingguide.ai/prompts)
- [GitHub Copilot Patterns](https://docs.github.com/en/copilot)
