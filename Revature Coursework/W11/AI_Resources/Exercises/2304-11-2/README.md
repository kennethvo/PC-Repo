# Trainee Exercise: LLM Evaluation

## Overview

**Duration:** 2-3 hours  
**Type:** Individual Comparative Analysis  
**Mode:** Conceptual + Practical

## Learning Objectives

- Compare how different LLMs handle identical prompts
- Evaluate LLM responses for accuracy and usefulness
- Develop criteria for choosing the right LLM for different tasks
- Practice verification of AI-generated content

## Prerequisites

- Access to at least TWO of the following:
  - [ChatGPT](https://chat.openai.com)
  - [Claude](https://claude.ai)
  - [Google Gemini](https://gemini.google.com)
  - GitHub Copilot Chat (if available)

## Instructions

### Part 1: Code Generation Comparison (45 minutes)

Test each LLM with the same prompts and document the results.

#### Test 1.1: Simple Method

**Prompt to use (copy exactly to each LLM):**

```
Write a Java method called reverseWords that takes a String input 
and returns the string with the order of words reversed.
Example: "hello world" → "world hello"
Handle null input by returning null.
```

**For each LLM, document:**

- Response time (fast/medium/slow)
- Does the code compile?
- Does it pass these test cases?
  - `reverseWords("hello world")` → `"world hello"`
  - `reverseWords("one")` → `"one"`
  - `reverseWords(null)` → `null`
  - `reverseWords("")` → `""`

#### Test 1.2: Complex Method

**Prompt:**

```
Write a Java method called findSecondLargest that takes a List<Integer> 
and returns the second largest value. 
Requirements:
- Handle lists with duplicate values correctly
- Throw IllegalArgumentException if list has fewer than 2 unique values
- Do not modify the original list
```

**For each LLM, document:**

- Code quality (readability, efficiency)
- Does it handle duplicates correctly?
- Does it throw the correct exception?
- Would you use this code in production?

---

### Part 2: Explanation Quality (30 minutes)

#### Test 2.1: Technical Concept

**Prompt:**

```
Explain the difference between HashMap and ConcurrentHashMap in Java.
When should you use each? Keep the explanation under 200 words.
```

**For each LLM, rate (1-5):**

- Accuracy of information
- Clarity of explanation
- Appropriate length
- Practical usefulness

#### Test 2.2: Code Review

**Prompt:**

```
Review this code and identify any issues:

public class UserService {
    public User findUser(Long id) {
        User user = userRepository.findById(id).get();
        user.setLastAccessTime(new Date());
        userRepository.save(user);
        return user;
    }
}
```

**For each LLM, document:**

- What issues did it identify?
- Were there any issues it missed?
- How actionable was the feedback?

---

### Part 3: Hallucination Detection (30 minutes)

Test each LLM's tendency to hallucinate.

#### Test 3.1: Fake API

**Prompt:**

```
Show me how to use the StringHelper.sanitizeHTML() method in Java.
```

(This method doesn't exist in standard Java)

**Document for each LLM:**

- Did it admit the method doesn't exist?
- If not, what did it make up?
- How confident did it sound?

#### Test 3.2: Version Fact-Check

**Prompt:**

```
What version of Java introduced the var keyword for local variable 
type inference?
```

**Verify the answer** (correct answer: Java 10)

**Document for each LLM:**

- Was it correct?
- How confident was the response?

#### Test 3.3: Push the Limits

**Prompt:**

```
Explain the internal implementation of the private calculateHash() 
method in Java's HashMap class.
```

**Document for each LLM:**

- Did it acknowledge uncertainty about private implementation details?
- Did it make up specific implementation details?

---

### Part 4: Your Use Case (30 minutes)

Choose a real task from your development work or learning goals.

#### Your Custom Test

1. **Describe your task:** (1-2 sentences about what you need)
2. **Write a prompt:** (Be specific)
3. **Test with each LLM**
4. **Document:**
   - Which LLM gave the best response?
   - Why was it better?
   - Would you use the response as-is or modify it?

---

## Deliverable

Create a comparison report with these sections:

### 1. Summary Table

| Test | LLM 1 Winner | LLM 2 Winner | Notes |
|------|--------------|--------------|-------|
| Test 1.1 | | | |
| Test 1.2 | | | |
| Test 2.1 | | | |
| Test 2.2 | | | |
| Test 3.1 | | | |
| Test 3.2 | | | |
| Test 3.3 | | | |
| Custom | | | |

### 2. Detailed Findings

For each test, include:

- The prompt used
- Response from each LLM (or summary)
- Your evaluation

### 3. Recommendations

Answer these questions:

1. Which LLM would you use for code generation? Why?
2. Which LLM would you use for learning/explanations? Why?
3. Which LLM was most honest about limitations? Why does this matter?
4. What verification steps should you always take regardless of which LLM you use?

### 4. Lessons Learned

Write 3-5 bullet points about what you learned from this comparison.

---

## Submission Guidelines

- Submit as `LLM_Evaluation_{YourName}.md`
- Include specific examples and observations
- Be objective—this isn't about which LLM you "like" but which performs best

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Completed all comparison tests | 30 |
| Quality of documentation | 20 |
| Accuracy of evaluations | 25 |
| Thoughtful recommendations | 25 |
| **Total** | **100** |

---

## Tips for Success

- Run tests in fresh conversations (no prior context)
- Be consistent—use exact same prompts for fair comparison
- Actually verify code—don't just assume it works
- Note your LLM versions/models (e.g., GPT-4 vs GPT-3.5)
