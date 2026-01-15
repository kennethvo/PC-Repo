# Trainee Exercise: Create Your Own Template

## Overview

**Duration:** 2 hours  
**Type:** Individual Creative Exercise  
**Mode:** Practical Application

## Learning Objectives

- Analyze repetitive tasks in your development workflow
- Design a structured prompt template from scratch
- Test and iterate on your template
- Document your template for team use

## Prerequisites

- Completed today's reading on prompt templates
- Access to an LLM for testing
- Knowledge of a repetitive task you do frequently

## Instructions

### Part 1: Task Identification (20 minutes)

First, identify a genuinely repetitive task from your development experience.

#### Brainstorm Tasks

List 5 tasks you do repeatedly in development:

1. ________________________________
2. ________________________________
3. ________________________________
4. ________________________________
5. ________________________________

#### Evaluate Each Task

For each task, rate (1-5):

- Frequency: How often do you do this?
- Consistency: Does it follow a pattern?
- Complexity: Is it complex enough to benefit from a template?

| Task | Frequency | Consistency | Complexity | Total |
|------|-----------|-------------|------------|-------|
| 1    |           |             |            |       |
| 2    |           |             |            |       |
| 3    |           |             |            |       |
| 4    |           |             |            |       |
| 5    |           |             |            |       |

**Select the task with the highest total for template creation.**

---

### Part 2: Template Design (30 minutes)

Design your template following the structure we learned.

#### Step 2.1: Define Template Metadata

```markdown
# Template Name: ______________________

## Purpose
(What does this template help you do?)

## When to Use
(In what situations should you use this template?)

## Tags
(Categorize your template: #coding #testing #documentation etc.)
```

#### Step 2.2: Identify Variables

List all the parts that change each time you use this template:

| Variable Name | Description | Example Value | Required? |
|---------------|-------------|---------------|-----------|
| {variable1}   |             |               |           |
| {variable2}   |             |               |           |
| {variable3}   |             |               |           |
| {variable4}   |             |               |           |

#### Step 2.3: Write the Template

Create your complete template:

```markdown
# [Your Template Name]

## Context
[Static context that applies every time]
[Variable context: {variables}]

## Task
[Clear action statement with {variables}]

## Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Constraints
- [Constraint 1]
- [Constraint 2]

## Output Format
[How the response should be structured]

[Optional sections if needed]
```

---

### Part 3: Template Testing (40 minutes)

Test your template with three different scenarios.

#### Test 1: Basic Use Case

**Fill in the variables:**

```
variable1 = 
variable2 = 
variable3 = 
variable4 = 
```

**The complete prompt (with variables filled in):**

```
(Paste your filled-in template here)
```

**Result quality (1-5):** ___
**What worked well:**
**What needs improvement:**

---

#### Test 2: Edge Case

Choose a more challenging or unusual scenario for your task.

**Fill in the variables:**

```
variable1 = 
variable2 = 
variable3 = 
variable4 = 
```

**Result quality (1-5):** ___
**Did the template handle this case? Why or why not?**

---

#### Test 3: Variation

Try a different variation of your typical use case.

**Fill in the variables:**

```
variable1 = 
variable2 = 
variable3 = 
variable4 = 
```

**Result quality (1-5):** ___
**Document findings:**

---

### Part 4: Template Iteration (20 minutes)

Based on your testing, improve your template.

#### Issues Identified

| Issue | Test Where Found | Proposed Fix |
|-------|------------------|--------------|
|       |                  |              |
|       |                  |              |
|       |                  |              |

#### Revised Template

Write your improved template version:

```markdown
# [Template Name] v2.0

[Your revised template here]
```

#### Re-test with Test 1 Scenario

**Result quality improvement:** ___→___

---

### Part 5: Documentation (10 minutes)

Document your template for others (or future you) to use.

```markdown
# Template: [Name]

## Purpose
[One sentence summary]

## When to Use
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

## Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| {var1}   |             |         |         |
| {var2}   |             |         |         |

## Full Template

```

[Your final template]

```

## Usage Example

**Scenario:** [Brief description]
**Filled Variables:**
- var1 = value1
- var2 = value2

**Expected Output:** [Brief description of what you get]

## Tips
- [Tip 1 from your testing experience]
- [Tip 2]

## Changelog
- v2.0: [What you improved]
- v1.0: Initial version
```

---

## Deliverable

Submit a Markdown file `My_Template_{TemplateName}_{YourName}.md` containing:

1. **Template Metadata** (Part 2.1)
2. **Variable Definitions** (Part 2.2)
3. **Final Template** (after iteration from Part 4)
4. **Three Test Results** (Part 3, brief summary)
5. **Complete Documentation** (Part 5)

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Task selection justification | 10 |
| Template design quality | 25 |
| Variable clarity and usefulness | 15 |
| Testing thoroughness | 20 |
| Iteration based on feedback | 15 |
| Documentation completeness | 15 |
| **Total** | **100** |

---

## Bonus Challenge (+10 points)

Create a SECOND template for a different task type (e.g., if your first was for code generation, make one for documentation or testing).

---

## Template Ideas (If Stuck)

If you're having trouble identifying a task, consider:

- **Entity/Model generation** for a new database table
- **Test case generation** for a method
- **API documentation** for an endpoint
- **Commit message** formatting
- **Code review** feedback structure
- **Bug report** formatting
- **SQL query** generation
- **Regex pattern** creation

---

## Tips for Success

- Choose a task you **actually do repeatedly**
- Make variables **clear and descriptive**
- Test with **realistic scenarios**
- Include **enough context** but don't over-engineer
- Document **why** decisions were made, not just what
