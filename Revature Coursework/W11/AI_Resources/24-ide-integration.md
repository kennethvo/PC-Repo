# IDE Integration

## Learning Objectives

- Set up AI coding assistants in popular IDEs
- Configure AI tools for optimal performance
- Understand integration options and settings
- Troubleshoot common integration issues

## Why This Matters

Getting your AI tools properly integrated into your IDE is the difference between a helpful assistant and a frustrating distraction. A well-configured setup makes AI assistance feel natural.

## The Concept

### Supported IDEs

| AI Tool | VS Code | IntelliJ | WebStorm | Eclipse | Vim/Neovim |
|---------|---------|----------|----------|---------|------------|
| Copilot | ✅ | ✅ | ✅ | ❌ | ✅ |
| Codeium | ✅ | ✅ | ✅ | ✅ | ✅ |
| CodeWhisperer | ✅ | ✅ | ✅ | ❌ | ❌ |

### VS Code Setup

#### Installing Copilot

```bash
# Option 1: Via VS Code Extensions Panel
# Search for "GitHub Copilot" and install

# Option 2: Via Command Line
code --install-extension GitHub.copilot
```

**Post-installation:**

1. Click "Sign in to GitHub" in the status bar
2. Authorize the extension
3. Reload VS Code

#### Installing Codeium

1. Open Extensions (Ctrl+Shift+X)
2. Search "Codeium"
3. Install "Codeium: Free AI Code Completion"
4. Sign up/sign in when prompted

### IntelliJ/JetBrains Setup

**For Copilot:**

1. Open Settings/Preferences (Ctrl+Alt+S)
2. Navigate to Plugins → Marketplace
3. Search "GitHub Copilot"
4. Install and restart IDE
5. Go to Tools → GitHub Copilot → Login

**For Codeium:**

1. Open Settings/Preferences
2. Navigate to Plugins → Marketplace
3. Search "Codeium"
4. Install and restart IDE
5. Complete authentication

### Key Settings to Configure

#### Suggestion Behavior

**VS Code (settings.json):**

```json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "markdown": true,
    "plaintext": false
  },
  "editor.inlineSuggest.enabled": true,
  "editor.inlineSuggest.showToolbar": "onHover"
}
```

**IntelliJ:**

- Settings → Tools → GitHub Copilot
- Enable/disable for specific file types
- Configure suggestion delay

#### Keyboard Shortcuts

| Action | VS Code | IntelliJ |
|--------|---------|----------|
| Accept suggestion | Tab | Tab |
| Next suggestion | Alt+] | Alt+] |
| Previous suggestion | Alt+[ | Alt+[ |
| Dismiss suggestion | Esc | Esc |
| Open Copilot Chat | Ctrl+I | Ctrl+Shift+I |

### Optimizing Your Setup

#### 1. Enable Ghost Text Properly

Ghost text (inline suggestions) should be visible but not intrusive.

#### 2. Configure File Type Settings

Disable for config files you edit rarely:

- `.env` files (security)
- `package-lock.json`
- Generated files

#### 3. Set Up Keyboard Shortcuts

Customize shortcuts that work with your muscle memory.

#### 4. Configure Chat Integration

- Bind Copilot Chat to a quick key (e.g., Ctrl+I)
- Position the chat panel conveniently

### Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| No suggestions appearing | Check authentication, restart IDE |
| Slow suggestions | Check internet connection, disable other extensions |
| Suggestions for wrong language | Verify file extension is correct |
| Extension not loading | Update IDE and extension, check compatibility |
| Rate limiting | Wait, use alternative tool temporarily |

### Working Efficiently

#### Multi-Cursor Support

AI suggestions work with multi-cursor editing—select multiple locations.

#### Using Comment Prompts

```java
// TODO: add email validation using regex
// Copilot will suggest validation code
```

#### Tab Completion Flow

1. Start typing method signature
2. Wait for suggestion
3. Tab to accept
4. Continue typing to see next suggestion

## Summary

- VS Code and JetBrains have the best AI tool support
- Proper setup includes authentication, keyboard shortcuts, and file type configuration
- Enable ghost text for inline suggestions
- Configure shortcuts that match your workflow
- Troubleshoot by checking auth, restarting, and verifying file types

## Additional Resources

- [VS Code Copilot Setup](https://docs.github.com/en/copilot/getting-started-with-github-copilot)
- [IntelliJ Copilot Setup](https://docs.github.com/en/copilot/getting-started-with-github-copilot/getting-started-with-github-copilot-in-a-jetbrains-ide)
- [Codeium Installation Guide](https://codeium.com/download)
