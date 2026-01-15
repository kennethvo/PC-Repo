#!/bin/bash
# ===========================================
# 02_variables.sh - Working with Variables
# ===========================================

# Defining variables (NO SPACES around the equals sign!)
name="Alice"
age=25
language="Bash"

# Using variables with $
echo "Name: $name"
echo "Age: $age"
echo "Learning: $language"

# Curly braces for clarity (especially when concatenating)
echo ""
echo "With curly braces:"
echo "Hello, ${name}!"
echo "${name} is learning ${language}"

# Read-only variables
readonly PI=3.14159
echo ""
echo "Pi is approximately $PI"
# PI=3.14  # Uncommenting this would cause an error!

# Command substitution - capture command output in a variable
current_date=$(date +%Y-%m-%d)
current_user=$(whoami)
echo ""
echo "Today is $current_date"
echo "Current user: $current_user"

exit 0
