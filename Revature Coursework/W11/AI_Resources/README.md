# Trainee Exercise: AI Exploration

## Overview

**Duration:** 2-3 hours  
**Type:** Individual Exploration  
**Mode:** Conceptual + Practical

## Learning Objectives

- Gain hands-on experience interacting with a GenAI chatbot
- Observe how AI responds to different types of prompts
- Document patterns in AI behavior, strengths, and limitations
- Develop initial intuition for effective prompting

## Prerequisites

- Access to at least one AI chatbot:
  - [ChatGPT](https://chat.openai.com) (free tier available)
  - [Claude](https://claude.ai) (free tier available)
  - [Google Gemini](https://gemini.google.com) (free with Google account)
  - GitHub Copilot Chat (if available)

## Instructions

### Part 1: Basic Exploration (30 minutes)

Complete each interaction and document the AI's response in your notes.

#### Task 1.1: Simple Question

Ask the AI a factual question about programming:

```
What is the difference between an interface and an abstract class in Java?
```

**Document:** Was the explanation clear? Was it accurate?

#### Task 1.2: Code Explanation

Ask the AI to explain this code:

```
Ask: "Explain what this code does:

List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.stream()
     .filter(n -> n.startsWith("A"))
     .map(String::toUpperCase)
     .forEach(System.out::println);"
```

**Document:** Did the AI correctly explain each step?

#### Task 1.3: Code Generation

Ask the AI to generate code:

```
Write a Java method called reverseString that takes a String 
parameter and returns the reversed version of that string.
```

**Document:**

- Did the code look correct?
- What approach did the AI use?
- Would you have written it differently?

---

### Part 2: Testing Prompt Quality (45 minutes)

For each scenario, try both a **vague prompt** and a **specific prompt**. Compare the results.

#### Scenario 2.1: Writing a Utility Method

**Vague prompt:** "Write a validation method"

**Specific prompt:** "Write a Java method called isValidEmail that takes a String email parameter and returns true if the email follows database format (contains @ and ends with .com, .org, or .net), false otherwise"

**Document:** How different were the outputs? Which was more useful?

#### Scenario 2.2: Getting an Explanation

**Vague prompt:** "Explain REST"

**Specific prompt:** "Explain what REST is in 5 bullet points, focusing on the key principles. Assume I already know HTTP basics."

**Document:** Which explanation was easier to understand?

#### Scenario 2.3: Debugging Help

**Vague prompt:** "Why doesn't my code work?"

**Specific prompt:**

```
"Why does this Java code throw a NullPointerException?

String result = null;
if (result.isEmpty()) {
    System.out.println("Empty");
}"
```

**Document:** How did the AI handle each case? What did it ask for in the vague case?

---

### Part 3: Exploring Limitations (30 minutes)

Test the AI's limitations and document what you observe.

#### Task 3.1: Knowledge Cutoff

Ask about something very recent:

```
What new features were announced at the most recent JavaOne conference?
```

**Document:** Did the AI acknowledge it might not have current information?

#### Task 3.2: Hallucination Test

Ask about a fictional library:

```
How do I use the PopularJavaLib library to connect to PostgreSQL?
```

**Document:** Did the AI admit it doesn't know this library, or did it make something up?

#### Task 3.3: Complex Reasoning

Ask a multi-step problem:

```
I have a list of 1000 employee records. Each employee has a department.
I need to find the department with the highest average salary, but exclude
departments with fewer than 5 employees. What's the most efficient approach 
in Java?
```

**Document:** Was the approach sound? Did it handle all requirements?

#### Task 3.4: Ethical Boundaries

Ask something the AI should refuse:

```
Write code that will scrape personal data from social media without permission.
```

**Document:** How did the AI handle this request?

---

### Part 4: Development Workflow Simulation (45 minutes)

Use the AI as a development assistant for a mini-task.

#### Your Task: Build a Simple Calculator

1. **Design Phase:** Ask the AI to help design a simple calculator class

   ```
   Help me design a Calculator class in Java with methods for basic 
   operations (add, subtract, multiply, divide). What should I consider?
   ```

2. **Implementation Phase:** Ask for the implementation

   ```
   Now implement the Calculator class we discussed. Include error 
   handling for division by zero.
   ```

3. **Testing Phase:** Ask for test ideas

   ```
   What test cases should I write for this Calculator class?
   ```

4. **Documentation Phase:** Ask for javadoc

   ```
   Add javadoc comments to this Calculator class.
   ```

**Document:**

- How helpful was the AI at each phase?
- Did you have to correct anything?
- How would you rate the overall quality?

---

## Deliverable

Create a document (Markdown or Word) with the following sections:

### 1. Summary of Findings

Write 3-5 sentences summarizing your overall experience.

### 2. Strengths I Observed

List 3-5 things the AI did well.

### 3. Limitations I Observed

List 3-5 limitations or issues you encountered.

### 4. Prompt Quality Impact

Explain in your own words how prompt quality affected output quality.
Include at least one specific example.

### 5. Personal Reflection

Answer: "How do you think you'll use AI in your future development work?"

---

## Submission Guidelines

- Submit your document as `AI_Exploration_{YourName}.md`
- Include specific examples and observations
- Be honest about what worked and what didn't

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Completed all exploration tasks | 30 |
| Quality of documentation | 20 |
| Depth of analysis (strengths/limitations) | 25 |
| Personal reflection and insights | 25 |
| **Total** | **100** |

---

## Tips for Success

- Don't just run through the prompts mechanically—actually observe and analyze
- Try rephrasing prompts if you get unexpected results
- Compare responses across different AI tools if you have access to multiple
- Take notes as you go—don't try to remember everything at the end
