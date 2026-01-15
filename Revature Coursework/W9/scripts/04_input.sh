#!/bin/bash
# ===========================================
# 04_input.sh - Reading User Input
# ===========================================

# Simple read
echo "What is your name?"
read name
echo "Hello, $name!"

# Read with prompt on same line (-p)
read -p "Enter your age: " age
echo "You are $age years old."

# Read silently for passwords (-s)
read -sp "Enter your password: " password
echo ""  # New line after hidden input
echo "Password received (${#password} characters)"

# Read with default value
read -p "Enter your city [New York]: " city
city=${city:-"New York"}  # Use default if empty
echo "City: $city"

# Read with timeout (-t seconds)
echo ""
echo "Quick! Enter something in 5 seconds:"
if read -t 5 quick_input; then
    echo "You entered: $quick_input"
else
    echo ""
    echo "Too slow!"
fi

exit 0
