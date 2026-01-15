# LLM Overview

## Learning Objectives

- Define what Large Language Models are and how they work
- Understand the transformer architecture at a high level
- Recognize key terminology in the LLM space
- Appreciate the scale and capabilities of modern LLMs

## Why This Matters

Large Language Models are the engine behind the GenAI revolution we discussed yesterday. As we continue **"Empowering Developers with AI"**, understanding how LLMs work—even at a high level—helps you use them more effectively and understand their limitations. You'll make better decisions about when to trust their output and when to be skeptical.

## The Concept

### What is a Large Language Model?

A **Large Language Model (LLM)** is a type of AI model specifically designed to understand and generate human language. They are:

- **Large**: Billions of parameters (GPT-4 has over 1 trillion)
- **Language**: Specialized in text processing
- **Model**: A mathematical representation learned from data

```
LLM = Statistical Pattern Matcher + Massive Training Data + Deep Neural Network
```

### How LLMs Work (Simplified)

At their core, LLMs are next-token predictors:

```
Input:   "The capital of France is"
Process: Calculate probability of every possible next word
Output:  "Paris" (highest probability)
```

#### The Training Process

```
┌────────────────────────────────────────────────────────────────┐
│                     TRAINING PHASE                              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Collect MASSIVE text data                                  │
│     (Internet, books, code, articles)                          │
│                          ↓                                      │
│  2. Train neural network to PREDICT next word                  │
│     "The cat sat on the ___" → "mat"                           │
│                          ↓                                      │
│  3. Repeat BILLIONS of times                                   │
│     Adjust weights to improve predictions                      │
│                          ↓                                      │
│  4. Result: Model that "understands" language patterns         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### The Transformer Architecture

The breakthrough behind modern LLMs is the **Transformer** architecture (introduced in "Attention Is All You Need" paper, 2017).

#### Key Innovation: Self-Attention

The model can "pay attention" to different parts of the input when generating each output:

```
Input: "The bank by the river was beautiful"

Without attention: "bank" → financial institution? river bank?
With attention:    "bank" + "river" → definitely river bank!
```

The model learns to focus on relevant context.

#### Transformer Components

| Component | Purpose |
|-----------|---------|
| **Tokenizer** | Breaks text into tokens (subwords/words) |
| **Embedding Layer** | Converts tokens to numerical vectors |
| **Attention Layers** | Learn relationships between tokens |
| **Feed-Forward Layers** | Process attention outputs |
| **Output Layer** | Predicts probability of next token |

### Key LLM Terminology

| Term | Definition |
|------|------------|
| **Token** | A piece of text (word or subword). "Hello world" = 2 tokens |
| **Parameter** | A learnable value in the model (billions in modern LLMs) |
| **Context Window** | Maximum input size (measured in tokens) |
| **Temperature** | Controls randomness in output (0 = deterministic, 1 = creative) |
| **Inference** | Using the trained model to generate responses |
| **Fine-tuning** | Additional training on specific data |
| **Prompt** | The input text you provide to the model |
| **Completion** | The output text the model generates |

### Scale of Modern LLMs

| Model | Parameters | Training Data | Context Window |
|-------|------------|---------------|----------------|
| GPT-3 | 175 billion | 45 TB | 4K tokens |
| GPT-4 | ~1.7 trillion* | Unknown | 128K tokens |
| Claude 3 | Unknown | Unknown | 200K tokens |
| Llama 2 | 70 billion | 2 trillion tokens | 4K tokens |

*Estimated, not officially confirmed

### Pre-training vs Fine-tuning

```
┌─────────────────────────────────────────────────────────────┐
│  PRE-TRAINING (Expensive, done once)                        │
│  ─────────────────────────────────                          │
│  • Train on massive general text data                       │
│  • Learn language patterns, facts, reasoning                │
│  • Costs millions of dollars                                │
│  • Results in "base model"                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  FINE-TUNING (Cheaper, customizable)                        │
│  ───────────────────────────────────                        │
│  • Additional training on specific data                     │
│  • Specialize for tasks or domains                          │
│  • Much less expensive                                      │
│  • Can be done by anyone with data                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  RLHF (Reinforcement Learning from Human Feedback)          │
│  ─────────────────────────────────────────────────          │
│  • Humans rate model outputs                                │
│  • Model learns to produce preferred responses              │
│  • Makes models more helpful and safe                       │
│  • Used by ChatGPT, Claude, etc.                            │
└─────────────────────────────────────────────────────────────┘
```

### Why LLMs Seem "Intelligent"

LLMs are not truly intelligent—they're sophisticated pattern matchers. They appear intelligent because:

1. **Scale**: Trained on essentially all human text
2. **Compression**: Patterns compressed into parameters
3. **Generalization**: Can combine patterns in novel ways
4. **Fluency**: Extremely good at producing coherent text

But they:

- Don't truly "understand" meaning
- Can't reason like humans
- Have no memory between conversations (unless engineered in)
- Can confidently produce false information

## Summary

- LLMs are large neural networks trained to predict the next token in text
- The Transformer architecture with self-attention enables understanding of context
- Modern LLMs have billions of parameters and are trained on massive datasets
- Key concepts: tokens, parameters, context window, temperature
- LLMs are pattern matchers, not true reasoning systems

## Additional Resources

- [What Are Large Language Models? - NVIDIA](https://www.nvidia.com/en-us/glossary/large-language-models/)
- [How GPT Works - OpenAI](https://platform.openai.com/docs/introduction)
- [Attention Is All You Need (Original Paper)](https://arxiv.org/abs/1706.03762)
