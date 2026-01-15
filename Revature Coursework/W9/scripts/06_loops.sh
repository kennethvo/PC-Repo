#!/bin/bash
# ===========================================
# 06_loops.sh - For and While Loops
# ===========================================

echo "=== For Loop: List of Items ==="
for fruit in apple banana cherry; do
    echo "I like $fruit"
done

echo ""
echo "=== For Loop: Range (Bash 4+) ==="
for i in {1..5}; do
    echo "Count: $i"
done

echo ""
echo "=== For Loop: C-style ==="
for ((i=0; i<3; i++)); do
    echo "Index: $i"
done

echo ""
echo "=== For Loop: Files in Directory ==="
for file in *.sh; do
    echo "Found script: $file"
done

echo ""
echo "=== For Loop: Command-line Arguments ==="
echo "You passed $# arguments:"
for arg in "$@"; do
    echo "  → $arg"
done

echo ""
echo "=== While Loop: Countdown ==="
count=5
while [ $count -gt 0 ]; do
    echo "T-minus $count..."
    count=$((count - 1))
    sleep 0.5
done
echo "Liftoff! 🚀"

exit 0
