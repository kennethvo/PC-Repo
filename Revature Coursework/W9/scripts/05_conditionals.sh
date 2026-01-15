#!/bin/bash
# ===========================================
# 05_conditionals.sh - If/Else and Comparisons
# ===========================================

# Get an argument or use default
number=${1:-10}

echo "Checking number: $number"
echo ""

# Basic if/else
if [ $number -gt 0 ]; then
    echo "$number is positive"
elif [ $number -lt 0 ]; then
    echo "$number is negative"
else
    echo "$number is zero"
fi

echo ""

# String comparisons
name=${2:-"guest"}
echo "Checking name: $name"

if [ "$name" = "admin" ]; then
    echo "Welcome, administrator!"
elif [ "$name" = "guest" ]; then
    echo "Welcome, guest. Please log in."
else
    echo "Welcome, $name!"
fi

echo ""

# File checks
filename=${3:-"./05_conditionals.sh"}
echo "Checking file: $filename"

if [ -f "$filename" ]; then
    echo "  ✓ File exists"
elif [ -d "$filename" ]; then
    echo "  → It's a directory, not a file"
else
    echo "  ✗ File does not exist"
fi

if [ -r "$filename" ]; then
    echo "  ✓ File is readable"
fi

if [ -x "$filename" ]; then
    echo "  ✓ File is executable"
fi

exit 0
