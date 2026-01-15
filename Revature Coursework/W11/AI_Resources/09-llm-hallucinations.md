# LLM Hallucinations

## Learning Objectives

- Define what hallucinations are in the context of LLMs
- Understand why hallucinations occur
- Recognize common hallucination patterns
- Apply strategies to detect and mitigate hallucinations

## Why This Matters

Hallucinations are one of the most significant limitations of LLMs. As an **AI-empowered developer**, you must know how to identify when an LLM is confidently wrong—because it will sound just as confident when it's making things up.

## The Concept

### What Are Hallucinations?

**LLM hallucinations** are responses that appear plausible and confident but are factually incorrect, fabricated, or nonsensical. The model generates content that sounds right but isn't grounded in reality.

```
You:   "What parameters does the Java String.formatDate() method accept?"
LLM:   "The String.formatDate() method accepts a Date object and a 
        pattern String..."

Reality: There is no String.formatDate() method in Java. The LLM 
         invented it.
```

### Why Hallucinations Happen

LLMs are **pattern completion engines**, not knowledge databases:

```
┌────────────────────────────────────────────────────────────┐
│  LLM Training: Predict the next token based on patterns   │
│                                                            │
│  Input:  "The capital of France is"                       │
│  Model:  Calculates probability distribution              │
│  Output: "Paris" (highest probability)                     │
│                                                            │
│  This works for known patterns. But for unknown patterns: │
│                                                            │
│  Input:  "The formatDate method in Java String class"     │
│  Model:  No direct knowledge, but "format" patterns exist │
│  Output: Generates plausible-sounding (but wrong) details │
└────────────────────────────────────────────────────────────┘
```

**Key reasons:**

| Reason | Explanation |
|--------|-------------|
| Pattern matching | Generates what "looks right" statistically |
| No true knowledge | Doesn't "know" facts, just patterns |
| Training gaps | Rare or niche topics have less training data |
| Confident by design | Trained to give helpful, complete answers |
| No self-doubt | Cannot recognize its own uncertainty |

---

### Common Hallucination Types

#### 1. Fabricated APIs/Methods

```
❌ "Use the HttpClient.sendAsync() method with the timeout parameter..."
   Reality: The method exists, but parameters or behavior may be wrong

❌ "StringUtils.isEmpty() from java.lang.String..."
   Reality: StringUtils is from Apache Commons, not java.lang
```

#### 2. Invented Libraries

```
❌ "Install the spring-boot-validator package for validation..."
   Reality: The actual package name might be different
```

#### 3. Wrong Version Information

```
❌ "This feature was added in Java 8..."
   Reality: It might have been Java 11 or 17
```

#### 4. Fabricated Facts

```
❌ "Martin Fowler introduced the Repository pattern in 1999..."
   Reality: Dates, attributions, and historical facts can be wrong
```

#### 5. Logical Errors

```
❌ "This algorithm runs in O(n) time..."
   Reality: It might actually be O(n²)
```

---

### How to Detect Hallucinations

#### Red Flags to Watch For

| Signal | Example |
|--------|---------|
| Unfamiliar API names | "Use the Stream.mapToString() method" |
| Overly specific details | Exact dates, version numbers, statistics |
| Too-perfect answers | Answers complex questions instantly |
| Inconsistency | Contradicts itself within the response |
| Unusual method signatures | Parameters that seem off |

#### Verification Strategies

```
┌────────────────────────────────────────────────────────────┐
│            HALLUCINATION DETECTION WORKFLOW                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. SUSPECT                                                │
│     "This seems too specific/confident"                    │
│                          ↓                                 │
│  2. VERIFY with official documentation                     │
│     Check: docs.oracle.com, spring.io, etc.               │
│                          ↓                                 │
│  3. TEST in your IDE                                       │
│     Does the code compile? Does it work?                   │
│                          ↓                                 │
│  4. CROSS-REFERENCE                                        │
│     Stack Overflow, GitHub examples, other sources         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### Mitigation Strategies

#### 1. Always Verify Critical Information

```
AI says: "The @Transactional annotation uses REQUIRED propagation by default"

You do:
1. Check Spring documentation
2. Confirm: Yes, REQUIRED is the default ✓
```

#### 2. Ask for Sources

```
"Explain how Spring Security handles CSRF protection. 
Include references to documentation I can verify."
```

Note: The LLM may still hallucinate sources, but this encourages more careful responses.

#### 3. Test Everything

```java
// AI generated this
String result = String.join("-", list);  // Verify this compiles and works

// Don't just trust it—run it
```

#### 4. Use Multiple Prompts

```
First:  "How do I use Optional.orElseThrow() in Java?"
Second: "Show me the method signature for Optional.orElseThrow()"
Third:  "What happens if orElseThrow() is called on an empty Optional?"

Compare answers for consistency.
```

#### 5. Prefer Broad Concepts Over Specifics

```
❌ "What exact version introduced this feature?"
   High hallucination risk

✅ "Explain how this feature works conceptually"
   Lower hallucination risk
```

---

### Working With Hallucinations

#### Accept That They Will Happen

- Not a bug—it's how LLMs work
- Build verification into your workflow
- Don't blame the tool; adapt your process

#### Use LLMs for What They're Good At

| Lower Risk | Higher Risk |
|------------|-------------|
| Explaining concepts | Specific API details |
| Code structure | Version numbers |
| General patterns | Historical facts |
| Brainstorming | Statistics/metrics |
| First drafts | Production-critical code |

## Summary

- Hallucinations are plausible but false LLM outputs
- They occur because LLMs predict patterns, not retrieve facts
- Common types: fabricated APIs, wrong versions, logical errors
- Always verify: check documentation, test code, cross-reference
- Accept hallucinations as part of the tool—build verification habits

## Additional Resources

- [Understanding AI Hallucinations - MIT](https://news.mit.edu/2023/large-language-models-are-biased-0117)
- [Reducing Hallucinations - Anthropic](https://www.anthropic.com/index/claudes-character)
- [LLM Hallucination Research - Stanford](https://hai.stanford.edu/)
