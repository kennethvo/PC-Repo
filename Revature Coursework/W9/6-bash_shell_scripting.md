# Week 9 - Bash Shell Scripting Fundamentals

## 1. Introduction to Shell Scripting

### What is a Shell?

A **shell** is a command-line interpreter that provides a user interface for the Unix/Linux operating system. It takes commands from the user and passes them to the kernel for execution.

### What is Bash?

**Bash** (Bourne Again Shell) is:

- The default shell on most Linux distributions and macOS (prior to Catalina)
- A superset of the original Bourne shell (sh)
- Released in 1989 by Brian Fox for the GNU Project
- POSIX-compliant with many extensions

### Why Learn Shell Scripting?

| Use Case | Example |
|----------|---------|
| **Automation** | Automate repetitive tasks like backups, deployments |
| **DevOps/CI/CD** | Jenkins, GitHub Actions, and most CI/CD tools use shell scripts |
| **System Administration** | Configure servers, manage users, monitor resources |
| **Development** | Build scripts, setup scripts, utility scripts |
| **Data Processing** | Parse logs, transform files, batch operations |

### Shell vs. Scripting Language

| Feature | Shell Scripts | Python/Ruby |
|---------|---------------|-------------|
| **System commands** | Native, easy | Requires subprocess |
| **Text processing** | grep, awk, sed | Built-in string methods |
| **Portability** | Available on all Unix systems | Requires installation |
| **Complexity** | Best for simple tasks | Better for complex logic |
| **Speed** | Fast startup | Slower startup |

---

## 2. The Shebang

### What is a Shebang?

The **shebang** (also called hashbang, sha-bang, or pound-bang) is the first line of a script that tells the system which interpreter to use.

```bash
#!/bin/bash
```

### Anatomy of the Shebang

```
#!/bin/bash
│└─────────── Path to the interpreter
└──────────── The shebang characters (# + !)
```

### Common Shebangs

| Shebang | Interpreter | Use Case |
|---------|-------------|----------|
| `#!/bin/bash` | Bash shell | Most Linux scripts |
| `#!/bin/sh` | POSIX shell | Maximum portability |
| `#!/usr/bin/env bash` | Find bash in PATH | Cross-platform compatibility |
| `#!/usr/bin/env python3` | Python 3 | Python scripts |
| `#!/usr/bin/env node` | Node.js | JavaScript scripts |

### Why Use `#!/usr/bin/env bash`?

The `env` command searches the `PATH` for the interpreter. This is more portable because:

- Bash might be in `/bin/bash` on Linux
- Bash might be in `/usr/local/bin/bash` on macOS (via Homebrew)

### Making Scripts Executable

```bash
# Add execute permission
chmod +x myscript.sh

# Run the script
./myscript.sh

# Alternative: Run with explicit interpreter (no chmod needed)
bash myscript.sh
```

---

## 3. Variables

### Declaring Variables

Variables in Bash have no data types. All values are stored as strings.

```bash
# Correct syntax - NO SPACES around the equals sign
name="Alice"
age=25
is_active=true

# WRONG - spaces cause errors
name = "Alice"   # Error: "name: command not found"
```

### Using Variables

```bash
# Access with $
echo $name

# Better: Use curly braces for clarity
echo ${name}

# Required when concatenating
echo "${name}Smith"    # AliceSmith
echo "$nameSmith"      # Empty (trying to access variable "nameSmith")
```

### Variable Types

#### String Variables

```bash
greeting="Hello, World!"
path="/home/user/documents"

# String length
echo ${#greeting}      # 13

# Substring (offset, length)
echo ${greeting:0:5}   # Hello
```

#### Numeric Variables

```bash
count=10
result=$((count + 5))  # Arithmetic expansion
echo $result           # 15

# Increment
count=$((count + 1))
((count++))            # Also works
```

#### Arrays

```bash
# Indexed array
fruits=("apple" "banana" "cherry")
echo ${fruits[0]}      # apple
echo ${fruits[@]}      # all elements
echo ${#fruits[@]}     # length: 3

# Add element
fruits+=("date")

# Associative array (Bash 4+)
declare -A user
user[name]="Alice"
user[age]=25
echo ${user[name]}     # Alice
```

### Special Variables

| Variable | Meaning | Example |
|----------|---------|---------|
| `$0` | Script name | `./myscript.sh` |
| `$1`, `$2`, ... | Positional parameters | First arg, second arg, etc. |
| `$#` | Number of arguments | `3` |
| `$@` | All arguments as separate words | `"arg1" "arg2" "arg3"` |
| `$*` | All arguments as a single string | `"arg1 arg2 arg3"` |
| `$$` | Process ID of the script | `12345` |
| `$?` | Exit status of last command | `0` (success) or non-zero |
| `$!` | PID of last background command | `12346` |

### Read-Only Variables

```bash
readonly PI=3.14159
PI=3.14  # Error: PI: readonly variable
```

### Environment Variables

```bash
# Export to make available to child processes
export MY_VAR="value"

# View all environment variables
env

# Common environment variables
echo $HOME      # /home/username
echo $PATH      # /usr/bin:/usr/local/bin:...
echo $USER      # current username
echo $PWD       # current directory
```

### Command Substitution

```bash
# Capture command output in a variable
current_date=$(date +%Y-%m-%d)
file_count=$(ls | wc -l)

# Old syntax (backticks) - deprecated
current_date=`date +%Y-%m-%d`
```

---

## 4. Command-Line Arguments

### Positional Parameters

```bash
#!/bin/bash
echo "Script name: $0"
echo "First argument: $1"
echo "Second argument: $2"
echo "Number of arguments: $#"
echo "All arguments: $@"
```

### Example Invocation

```bash
./script.sh hello world 42

# Output:
# Script name: ./script.sh
# First argument: hello
# Second argument: world
# Number of arguments: 3
# All arguments: hello world 42
```

### `$@` vs `$*`

The difference matters when arguments contain spaces:

```bash
# Given: ./script.sh "hello world" "foo bar"

for arg in "$@"; do
    echo "[$arg]"
done
# Output:
# [hello world]
# [foo bar]

for arg in "$*"; do
    echo "[$arg]"
done
# Output:
# [hello world foo bar]
```

### Default Values

```bash
# Use default if variable is empty or unset
name=${1:-"Guest"}

# Use default only if variable is unset
name=${1-"Guest"}

# Assign default if variable is empty or unset
: ${name:="Guest"}
```

### Shift Command

```bash
#!/bin/bash
echo "Before shift: $1 $2 $3"
shift
echo "After shift: $1 $2 $3"

# ./script.sh a b c
# Before shift: a b c
# After shift: b c
```

---

## 5. User Input

### The `read` Command

```bash
# Basic read
echo "Enter your name:"
read name
echo "Hello, $name!"

# Read with prompt (-p)
read -p "Enter your age: " age

# Read silently (-s) for passwords
read -sp "Enter password: " password
echo ""  # Newline after hidden input

# Read with timeout (-t seconds)
read -t 10 -p "Quick! Enter something: " quick

# Read into array (-a)
read -a fruits -p "Enter fruits (space-separated): "
echo "First fruit: ${fruits[0]}"
```

### Read Options

| Option | Description |
|--------|-------------|
| `-p "prompt"` | Display prompt before reading |
| `-s` | Silent mode (hide input) |
| `-t N` | Timeout after N seconds |
| `-n N` | Read only N characters |
| `-a array` | Read into an array |
| `-r` | Raw input (don't interpret backslashes) |

---

## 6. Conditionals

### if/else Syntax

```bash
if [ condition ]; then
    # commands
elif [ another_condition ]; then
    # commands
else
    # commands
fi
```

### Test Operators

#### Numeric Comparisons

| Operator | Meaning |
|----------|---------|
| `-eq` | Equal |
| `-ne` | Not equal |
| `-lt` | Less than |
| `-le` | Less than or equal |
| `-gt` | Greater than |
| `-ge` | Greater than or equal |

```bash
if [ $age -ge 18 ]; then
    echo "Adult"
fi
```

#### String Comparisons

| Operator | Meaning |
|----------|---------|
| `=` or `==` | Equal |
| `!=` | Not equal |
| `-z` | String is empty |
| `-n` | String is not empty |
| `<` | Less than (alphabetically) |
| `>` | Greater than (alphabetically) |

```bash
if [ "$name" = "admin" ]; then
    echo "Welcome, administrator!"
fi

if [ -z "$input" ]; then
    echo "Input is empty"
fi
```

#### File Tests

| Operator | Meaning |
|----------|---------|
| `-e file` | File exists |
| `-f file` | Is a regular file |
| `-d file` | Is a directory |
| `-r file` | Is readable |
| `-w file` | Is writable |
| `-x file` | Is executable |
| `-s file` | Has size > 0 |
| `-L file` | Is a symbolic link |

```bash
if [ -f "/etc/passwd" ]; then
    echo "File exists"
fi

if [ -d "$HOME/Documents" ]; then
    echo "Directory exists"
fi
```

### Logical Operators

```bash
# AND
if [ $a -gt 0 ] && [ $b -gt 0 ]; then
    echo "Both positive"
fi

# OR
if [ $a -eq 0 ] || [ $b -eq 0 ]; then
    echo "At least one is zero"
fi

# NOT
if [ ! -f "$file" ]; then
    echo "File does not exist"
fi
```

### The `[[` Double Bracket

The `[[` syntax is a Bash extension with more features:

```bash
# Pattern matching
if [[ $name == A* ]]; then
    echo "Name starts with A"
fi

# Regex matching
if [[ $email =~ ^[a-z]+@[a-z]+\.[a-z]+$ ]]; then
    echo "Valid email format"
fi

# No need to quote variables
if [[ $string = "hello" ]]; then
    echo "Match"
fi
```

### Case Statement

```bash
case $option in
    1|one)
        echo "You chose one"
        ;;
    2|two)
        echo "You chose two"
        ;;
    *)
        echo "Unknown option"
        ;;
esac
```

---

## 7. Loops

### For Loop

```bash
# Loop over list of items
for fruit in apple banana cherry; do
    echo "I like $fruit"
done

# Loop over range (Bash 4+)
for i in {1..5}; do
    echo "Count: $i"
done

# C-style for loop
for ((i=0; i<5; i++)); do
    echo "Index: $i"
done

# Loop over files
for file in *.txt; do
    echo "Processing: $file"
done

# Loop over command output
for user in $(cat users.txt); do
    echo "User: $user"
done

# Loop over arguments
for arg in "$@"; do
    echo "Argument: $arg"
done
```

### While Loop

```bash
# Basic while
count=5
while [ $count -gt 0 ]; do
    echo "Count: $count"
    ((count--))
done

# Read file line by line
while IFS= read -r line; do
    echo "Line: $line"
done < file.txt

# Infinite loop
while true; do
    echo "Press Ctrl+C to stop"
    sleep 1
done
```

### Until Loop

```bash
# Opposite of while - runs until condition is true
count=0
until [ $count -ge 5 ]; do
    echo "Count: $count"
    ((count++))
done
```

### Loop Control

```bash
# break - exit the loop
for i in {1..10}; do
    if [ $i -eq 5 ]; then
        break
    fi
    echo $i
done
# Output: 1 2 3 4

# continue - skip to next iteration
for i in {1..5}; do
    if [ $i -eq 3 ]; then
        continue
    fi
    echo $i
done
# Output: 1 2 4 5
```

---

## 8. Functions

### Defining Functions

```bash
# Syntax 1
function greet {
    echo "Hello!"
}

# Syntax 2 (POSIX-compliant)
greet() {
    echo "Hello!"
}
```

### Function Parameters

```bash
greet_user() {
    local name=$1    # $1 inside function refers to function argument
    local time=$2
    echo "Good $time, $name!"
}

greet_user "Alice" "morning"   # Good morning, Alice!
```

### Local Variables

```bash
my_function() {
    local local_var="I'm local"
    global_var="I'm global"
}

my_function
echo $local_var    # Empty (not accessible)
echo $global_var   # I'm global
```

### Return Values

Bash functions can only return numeric exit codes (0-255).

```bash
is_even() {
    local num=$1
    if [ $((num % 2)) -eq 0 ]; then
        return 0    # Success (true)
    else
        return 1    # Failure (false)
    fi
}

if is_even 42; then
    echo "42 is even"
fi
```

### Returning Strings

Use command substitution to capture function output:

```bash
get_greeting() {
    local name=$1
    echo "Welcome, $name!"   # Output is "returned"
}

message=$(get_greeting "Alice")
echo "$message"   # Welcome, Alice!
```

---

## 9. Exit Codes

### Understanding Exit Codes

Every command returns an exit code:

- **0**: Success
- **1-255**: Failure (different codes for different errors)

```bash
# Check exit code of last command
ls /tmp
echo $?    # 0 (success)

ls /nonexistent
echo $?    # 2 (no such file or directory)
```

### Setting Exit Codes

```bash
#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Error: No arguments provided"
    exit 1
fi

# Rest of script...
exit 0    # Explicit success
```

### Common Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Misuse of shell command |
| 126 | Command not executable |
| 127 | Command not found |
| 128+N | Fatal error signal N |
| 130 | Ctrl+C (SIGINT) |

---

## 10. Input/Output Redirection

### Standard Streams

| Stream | Number | Default |
|--------|--------|---------|
| stdin | 0 | Keyboard |
| stdout | 1 | Terminal |
| stderr | 2 | Terminal |

### Output Redirection

```bash
# Redirect stdout to file (overwrite)
echo "Hello" > output.txt

# Redirect stdout to file (append)
echo "World" >> output.txt

# Redirect stderr to file
command 2> error.log

# Redirect both stdout and stderr
command > output.txt 2>&1
# Or (Bash 4+)
command &> output.txt

# Discard output
command > /dev/null 2>&1
```

### Input Redirection

```bash
# Read from file
while read line; do
    echo "$line"
done < input.txt

# Here document
cat << EOF
This is a multi-line
string that will be
passed as input.
EOF

# Here string
grep "pattern" <<< "search in this string"
```

### Pipes

```bash
# Pass output of one command to another
ls -la | grep ".txt"

# Chain multiple commands
cat file.txt | sort | uniq | wc -l
```

---

## 11. Best Practices

### Script Template

```bash
#!/usr/bin/env bash
#
# Script: myscript.sh
# Description: Brief description of what this script does
# Author: Your Name
# Date: 2024-01-15
#

set -euo pipefail    # Exit on error, undefined vars, pipe failures

# Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
log_info() {
    echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_error() {
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') $1" >&2
}

show_usage() {
    echo "Usage: $0 <arg1> <arg2>"
    echo "  arg1: Description of first argument"
    echo "  arg2: Description of second argument"
}

# Main
main() {
    if [ $# -lt 2 ]; then
        show_usage
        exit 1
    fi
    
    log_info "Starting script..."
    # Your code here
    log_info "Script completed successfully"
}

main "$@"
```

### The `set` Command

```bash
set -e    # Exit immediately if a command fails
set -u    # Treat unset variables as errors
set -o pipefail    # Return exit code of failed pipe command
set -x    # Print commands before execution (debugging)

# Combine them
set -euo pipefail
```

### Quoting Best Practices

```bash
# Always quote variables to handle spaces
file="my file.txt"
rm "$file"        # Correct
rm $file          # Wrong! Tries to delete "my" and "file.txt"

# Use "$@" not $@ to preserve argument boundaries
for arg in "$@"; do
    echo "$arg"
done
```

### Error Handling

```bash
# Check command success
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed"
    exit 1
fi

# Trap for cleanup
cleanup() {
    rm -f /tmp/mytemp$$
}
trap cleanup EXIT

# Handle errors
handle_error() {
    echo "Error on line $1"
    exit 1
}
trap 'handle_error $LINENO' ERR
```

---

## 12. Useful Commands for Scripts

### Text Processing

```bash
# grep - search patterns
grep "error" logfile.log
grep -i "error" file          # Case insensitive
grep -r "pattern" directory/  # Recursive

# sed - stream editor
sed 's/old/new/g' file.txt    # Replace all occurrences
sed -i 's/old/new/g' file.txt # In-place edit

# awk - pattern scanning
awk '{print $1}' file.txt     # Print first column
awk -F: '{print $1}' /etc/passwd  # Custom delimiter

# cut - extract columns
cut -d: -f1 /etc/passwd       # First field, colon delimiter

# sort, uniq, wc
cat file | sort | uniq | wc -l  # Count unique lines
```

### File Operations

```bash
# Find files
find . -name "*.sh" -type f

# Check if file/directory exists
test -f file.txt && echo "File exists"
[ -d /tmp ] && echo "Directory exists"

# Create temporary file
tmpfile=$(mktemp)
echo "Data" > "$tmpfile"
```

---

## 13. Resources

### Online Tools

- [ShellCheck](https://www.shellcheck.net/) - Linter for shell scripts
- [Explain Shell](https://explainshell.com/) - Explain command line arguments

### Documentation

- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/)
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- [Bash Pitfalls](https://mywiki.wooledge.org/BashPitfalls)
