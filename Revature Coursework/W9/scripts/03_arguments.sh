#!/bin/bash
# ===========================================
# 03_arguments.sh - Command-Line Arguments
# ===========================================

echo "=== Script Information ==="
echo "Script name: $0"
echo "Process ID: $$"

echo ""
echo "=== Positional Parameters ==="
echo "First argument:  \$1 = $1"
echo "Second argument: \$2 = $2"
echo "Third argument:  \$3 = $3"

echo ""
echo "=== Special Variables ==="
echo "Number of arguments: \$# = $#"
echo "All arguments (as separate words): \$@ = $@"
echo "All arguments (as single string): \$* = $*"

echo ""
echo "=== Looping Through Arguments ==="
echo "Using \$@:"
for arg in "$@"; do
    echo "  - $arg"
done

exit 0
