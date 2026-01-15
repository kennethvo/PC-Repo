# Trainee Exercise: Prompt Engineering

## Overview

**Duration:** 2-3 hours  
**Type:** Individual Skill Building  
**Mode:** Practical Application

## Learning Objectives

- Apply zero-shot and few-shot prompting techniques
- Transform vague prompts into effective ones
- Iterate on prompts to improve output quality
- Compare prompting strategies for different tasks

## Prerequisites

- Access to an LLM (ChatGPT, Claude, or similar)
- Understanding of zero-shot and few-shot concepts from today's reading

## Instructions

### Part 1: Zero-Shot Optimization (30 minutes)

Below are 5 weak prompts. Your task is to improve each one using zero-shot techniques (no examples, just better instructions).

#### Prompt 1.1: Original

```
Write code for sorting
```

**Your improved version:**
(Write your improved prompt here, then test it)

**Evaluation criteria:**

- Did you specify the programming language?
- Did you specify what's being sorted?
- Did you specify the sorting algorithm or performance requirements?

---

#### Prompt 1.2: Original

```
Explain databases
```

**Your improved version:**
(Write your improved prompt here, then test it)

**Evaluation criteria:**

- Did you specify the audience level?
- Did you constrain the scope or length?
- Did you request a specific format?

---

#### Prompt 1.3: Original

```
Fix this code
```

**Your improved version:**
(Assume you have code with a NullPointerException)

**Evaluation criteria:**

- Did you include the code?
- Did you describe the error?
- Did you provide context (language, framework)?

---

#### Prompt 1.4: Original

```
Make a test
```

**Your improved version:**
(Assume you want to test a UserService.createUser method)

**Evaluation criteria:**

- Did you specify the test framework?
- Did you specify what scenarios to test?
- Did you describe the method being tested?

---

#### Prompt 1.5: Original

```
Create an API endpoint
```

**Your improved version:**
(Assume you want a GET endpoint for products by category)

**Evaluation criteria:**

- Did you specify the framework?
- Did you specify HTTP method and path?
- Did you describe request/response format?

---

### Part 2: Few-Shot Practice (45 minutes)

Create few-shot prompts for these scenarios where consistency matters.

#### Task 2.1: Code Comment Style

Create a few-shot prompt that generates comments in YOUR preferred style.

**Requirements:**

- Create 2-3 example input/output pairs
- Include a method signature and the comment you want
- Test with a new method signature

**Your few-shot prompt:**

```
(Write your few-shot prompt here)
```

**Test input:**

```java
public List<User> findActiveUsersByDepartment(String departmentId, int limit)
```

**Document:** Was the output consistent with your examples?

---

#### Task 2.2: Variable Naming Convention

Create a few-shot prompt that converts descriptions to variable names in camelCase.

**Requirements:**

- Provide 3 examples
- Test with 2 new descriptions

**Your few-shot prompt:**

```
(Write your few-shot prompt here)
```

**Test inputs:**

- "the user's email address"
- "number of failed login attempts"

**Document:** Did the AI follow your naming pattern?

---

#### Task 2.3: Error Message Formatting

Create a few-shot prompt for generating standardized error messages.

**Your desired format example:**

```
ERROR-001: User registration failed - Invalid email format provided
```

**Requirements:**

- Create the pattern template
- Provide 3 examples
- Test with 2 new error scenarios

**Your few-shot prompt:**

```
(Write your few-shot prompt here)
```

---

### Part 3: Iterative Refinement (45 minutes)

Start with this task and iterate until you get excellent output.

**Task:** Generate a complete Spring Boot REST endpoint for creating a new product.

**Step 1: First attempt**
Write your initial prompt:

```
(Your first prompt)
```

**Output quality (1-5):** ___
**What's missing or wrong:**

---

**Step 2: Refined prompt**
Improve based on Step 1 issues:

```
(Your refined prompt)
```

**Output quality (1-5):** ___
**What improved:**
**What's still missing:**

---

**Step 3: Final prompt**
Make final improvements:

```
(Your final prompt)
```

**Output quality (1-5):** ___
**Document your iteration journey:**

---

### Part 4: Technique Comparison (30 minutes)

Test the same task with different techniques and compare results.

**Task:** Generate a method that validates a password against these rules:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (!@#$%^&*)

#### Approach A: Zero-Shot

Write a clear, detailed zero-shot prompt:

```
(Your zero-shot prompt)
```

**Rate output quality (1-5):** ___

---

#### Approach B: Few-Shot

Write a prompt with examples of validation methods:

```
(Your few-shot prompt)
```

**Rate output quality (1-5):** ___

---

#### Comparison Analysis

- Which approach produced better code?
- Which was easier to write?
- When would you use each approach?

---

## Deliverable

Create a document `Prompt_Engineering_Exercise_{YourName}.md` with:

### 1. Part 1 Responses

Your 5 improved zero-shot prompts and self-evaluation.

### 2. Part 2 Responses

Your 3 few-shot prompts, test results, and analysis.

### 3. Part 3 Documentation

Your iteration journey showing all 3 prompt versions and improvements.

### 4. Part 4 Analysis

Comparison of zero-shot vs few-shot for the password validation task.

### 5. Key Learnings

Write 3-5 bullet points about what you learned about prompt engineering.

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Part 1: Quality of improved prompts | 20 |
| Part 2: Effective few-shot examples | 25 |
| Part 3: Clear iteration and improvement | 25 |
| Part 4: Thoughtful comparison analysis | 20 |
| Key learnings and reflection | 10 |
| **Total** | **100** |

---

## Tips for Success

- Test every prompt—don't just write them
- Be specific about your requirements
- For few-shot, make examples diverse but consistent
- Document what works and what doesn't
- Save your best prompts for future use
