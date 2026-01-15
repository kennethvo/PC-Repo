# Trainee Exercise: AI Tools Setup

## Overview

**Duration:** 1-2 hours  
**Type:** Individual Setup  
**Mode:** Practical Configuration

## Learning Objectives

- Install and configure an AI coding assistant in your IDE
- Verify the installation works correctly
- Customize settings for your preferences
- Troubleshoot common setup issues

## Prerequisites

- VS Code or IntelliJ IDEA installed
- GitHub account (for Copilot) or email (for Codeium)
- Internet connection

## Instructions

### Part 1: Choose Your Tool (10 minutes)

Select ONE of the following based on your situation:

| Tool | Best For | Cost |
|------|----------|------|
| GitHub Copilot | Full-featured, best context | $10/mo (free for students) |
| Codeium | Free, good quality | Free |
| CodeWhisperer | AWS projects | Free tier available |

**If you're a student:** Apply for GitHub Student Developer Pack for free Copilot.

**If not a student and budget-conscious:** Use Codeium (completely free).

---

### Part 2: Installation (20 minutes)

#### For VS Code

**GitHub Copilot:**

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "GitHub Copilot"
4. Click Install
5. Click "Sign in to GitHub" in the popup
6. Complete browser authentication
7. Return to VS Code

**Codeium:**

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "Codeium"
4. Click Install
5. Click "Sign up" or "Log in" when prompted
6. Create account or sign in via browser
7. Return to VS Code

#### For IntelliJ

**GitHub Copilot:**

1. File → Settings → Plugins → Marketplace
2. Search "GitHub Copilot"
3. Install and Restart IDE
4. Tools → GitHub Copilot → Login
5. Complete browser authentication

**Codeium:**

1. File → Settings → Plugins → Marketplace
2. Search "Codeium"
3. Install and Restart IDE
4. Complete authentication when prompted

---

### Part 3: Verification (20 minutes)

Complete these tests to verify your installation works.

#### Test 1: Inline Suggestions

Create a new Java file and type:

```java
public class Calculator {
    
    public int add(
```

**Expected:** Ghost text appears suggesting parameters and method body.  
**Action:** Press Tab to accept.

**Did it work?** ☐ Yes ☐ No

If no, check:

- Is the AI icon visible in status bar?
- Are you authenticated?
- Try restarting IDE

#### Test 2: Comment-Driven Generation

Type this comment, then press Enter:

```java
// method that calculates the factorial of a number using recursion
public
```

**Expected:** AI suggests `int factorial(int n)` with implementation.

**Did it work?** ☐ Yes ☐ No

#### Test 3: Multi-Line Completion

Type:

```java
public List<String> sortAlphabetically(List<String> items) {
    if (items == null) {
```

**Expected:** AI suggests null handling and sort logic.

**Did it work?** ☐ Yes ☐ No

#### Test 4: Chat (if available)

Open the AI chat panel and ask:

```
Write a Java method that validates an email address using regex.
```

**Expected:** A complete method with regex pattern.

**Did it work?** ☐ Yes ☐ No

---

### Part 4: Configuration (20 minutes)

Customize your setup for comfort and efficiency.

#### Keyboard Shortcuts

Learn and practice these shortcuts:

| Action | Shortcut | Practice (try 3 times) |
|--------|----------|------------------------|
| Accept suggestion | Tab | ☐ ☐ ☐ |
| Dismiss suggestion | Esc | ☐ ☐ ☐ |
| Next suggestion | Alt+] | ☐ ☐ ☐ |
| Previous suggestion | Alt+[ | ☐ ☐ ☐ |
| Open chat | Ctrl+I (varies) | ☐ ☐ ☐ |

#### Enable/Disable for File Types

**VS Code (settings.json):**

```json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "markdown": false,
    "plaintext": false
  }
}
```

**Document your settings:**

- What file types did you keep enabled?
- What did you disable? Why?

---

### Part 5: Troubleshooting Exercise (If Needed)

If you encountered issues, document them here:

**Issue 1:**

- Description:
- Error message (if any):
- Solution tried:
- Result:

**Issue 2:**

- Description:
- Error message (if any):
- Solution tried:
- Result:

---

## Deliverable

Create a document `AI_Setup_Report_{YourName}.md` with:

### 1. Tool Selection

- Which tool did you install?
- Why did you choose it?

### 2. Installation Verification

- Test 1 result: ☐ Pass ☐ Fail
- Test 2 result: ☐ Pass ☐ Fail
- Test 3 result: ☐ Pass ☐ Fail
- Test 4 result: ☐ Pass ☐ Fail

### 3. Configuration

- Screenshot of your AI extension installed
- List of settings you customized

### 4. Issues and Resolutions

- Any problems encountered?
- How did you solve them?

### 5. First Impressions

- What's your initial reaction to the tool?
- What feature are you most excited about?

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Successful installation | 30 |
| All verification tests passing | 30 |
| Configuration customization | 20 |
| Documentation quality | 20 |
| **Total** | **100** |

---

## Tips for Success

- Restart your IDE if things don't work initially
- Check that you're logged in (visible in status bar)
- Make sure you're in a supported file type (.java, .py, etc.)
- If one tool doesn't work, try an alternative
