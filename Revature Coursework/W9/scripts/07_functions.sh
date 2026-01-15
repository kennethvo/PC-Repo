#!/bin/bash
# ===========================================
# 07_functions.sh - Defining and Using Functions
# ===========================================

# Simple function with no parameters
greet() {
    echo "Hello from a function!"
}

# Function with parameters
greet_user() {
    local name=$1  # local variable
    local time=$2
    echo "Good $time, $name!"
}

# Function with return value (exit code)
is_even() {
    local num=$1
    if [ $((num % 2)) -eq 0 ]; then
        return 0  # True (success) in Bash
    else
        return 1  # False (failure) in Bash
    fi
}

# Function that outputs a value (use command substitution)
get_greeting() {
    local name=$1
    echo "Welcome, $name!"  # Output is "returned"
}

# ===========================================
# CALLING FUNCTIONS
# ===========================================

echo "=== Simple Function ==="
greet

echo ""
echo "=== Function with Parameters ==="
greet_user "Alice" "morning"
greet_user "Bob" "evening"

echo ""
echo "=== Function with Return Value ==="
number=42
if is_even $number; then
    echo "$number is even"
else
    echo "$number is odd"
fi

number=7
if is_even $number; then
    echo "$number is even"
else
    echo "$number is odd"
fi

echo ""
echo "=== Function Returning Output ==="
message=$(get_greeting "Charlie")
echo "Received: $message"

exit 0
