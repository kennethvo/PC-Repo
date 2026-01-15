# Trainee Exercise: AI-Assisted Development Project

## Overview

**Duration:** 3-4 hours  
**Type:** Collaborative Project  
**Mode:** Implementation with AI Assistance

## Learning Objectives

- Apply AI pair programming to build a complete feature
- Practice the full AI-assisted development workflow
- Experience real-world collaboration with AI tools
- Reflect on effective AI usage patterns

## Prerequisites

- Completed AI Tools Setup exercise
- Working AI extension in your IDE
- Existing Spring Boot project (or use provided starter)

## The Challenge

Build a **Book Review System** using AI assistance at every step.

### Feature Requirements

Create a system where users can:

1. Add books to a catalog
2. Write reviews for books
3. View all reviews for a book
4. Get average rating for a book
5. Search books by title or author

### Technical Requirements

- Spring Boot 3.x with Java 17
- JPA entities with proper relationships
- RESTful API endpoints
- Input validation
- Unit tests for service layer
- API documentation (Javadoc or OpenAPI)

---

## Instructions

### Part 1: Design with AI (30 minutes)

#### Task 1.1: Get Architecture Advice

Open AI chat and ask:

```
I need to build a book review system with Spring Boot.
Features: add books, write reviews, view reviews, get average rating, search.
What entities, relationships, and layers do I need?
```

**Document the AI's response:**

Entity Design Suggested:

- Book entity fields:
- Review entity fields:
- Relationship:

Layers Suggested
-

-
-

#### Task 1.2: Database Design

Ask:

```
Show me the JPA entity relationships for Book and Review.
A Book has many Reviews. Reviews include rating (1-5), text, author name, and date.
```

**Document or screenshot the response.**

---

### Part 2: Implementation (2 hours)

Build each component using AI assistance. Document your prompts and any modifications you made.

#### Task 2.1: Create Book Entity

**Use comment-driven generation:**

```java
package com.example.bookreviews.model;

// JPA entity for books in the catalog
// Fields: id (Long), title (String), author (String), isbn (String), 
// publishedYear (int), reviews (OneToMany to Review)
// Include: validation annotations, Lombok

@Entity
```

**What did AI generate?**

**What modifications did you make? Why?**

#### Task 2.2: Create Review Entity

**Your prompt/comments:**

**What did AI generate?**

**What modifications did you make?**

#### Task 2.3: Create Repositories

Generate BookRepository and ReviewRepository with custom query methods.

**Prompts used:**

**Methods generated:**

#### Task 2.4: Create BookService

Generate a service with methods for:

- Add new book
- Find book by ID
- Search books by title or author
- Get all books
- Delete book

**Document your approach:**

#### Task 2.5: Create ReviewService

Generate a service with methods for:

- Add review to book
- Get all reviews for book
- Get average rating for book
- Delete review

**What prompts did you use?**

**Did AI handle the average calculation correctly?**

#### Task 2.6: Create Controllers

Create BookController and ReviewController with RESTful endpoints.

**Endpoints created:**

---

### Part 3: Testing with AI (45 minutes)

#### Task 3.1: Generate Unit Tests

Ask AI:

```
Generate JUnit 5 tests for BookService.addBook and ReviewService.addReview.
Include: happy path, validation failures, not found cases.
Use Mockito and AssertJ.
```

**Number of tests generated:**

**Tests you added or modified:**

#### Task 3.2: Test the Application

Run your tests:

```bash
mvn test
```

**Results:**

- Tests passed:
- Tests failed:
- Issues fixed:

---

### Part 4: Documentation with AI (30 minutes)

#### Task 4.1: Add Javadoc

Generate Javadoc for your service classes:

```
Generate Javadoc for all public methods in BookService including 
param, return, and throws tags.
```

#### Task 4.2: Create README

Ask AI to help write a README for your feature:

```
Write a README section for the Book Review System feature including:
- Overview
- API endpoints
- Example requests
- Setup instructions
```

---

### Part 5: Reflection (15 minutes)

Answer these questions:

1. **Time Savings**: Estimate how long this would have taken without AI. How much time did AI save?

2. **Quality**: Was the AI-generated code high quality? What did you have to fix?

3. **Learning**: Did using AI help or hinder your learning? Explain.

4. **Effective Prompts**: What prompts worked best? Share 2-3 examples.

5. **Challenges**: What was difficult about working with AI? How did you overcome it?

6. **Future Use**: How will you use AI tools in your future development work?

---

## Deliverable

Submit a ZIP file containing:

1. **Source code** - Your complete implementation
2. **Screenshots** - Key AI interactions (at least 3)
3. **Reflection document** - Answers to Part 5 questions
4. **Prompt log** - List of significant prompts you used

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Working entities with relationships | 15 |
| Complete repositories | 10 |
| Service layer implementation | 20 |
| REST controllers with all endpoints | 15 |
| Unit tests (at least 5 passing) | 15 |
| Documentation (Javadoc + README) | 10 |
| Reflection quality | 15 |
| **Total** | **100** |

---

## Tips for Success

- Start with small prompts and build up
- Review every piece of AI-generated code
- Don't be afraid to ask follow-up questions
- If AI output is wrong, try being more specific
- Document interesting prompts for future use
