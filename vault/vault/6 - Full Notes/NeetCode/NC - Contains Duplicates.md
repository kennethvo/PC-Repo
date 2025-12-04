
2025-10-01 19:15

Tags: [[Leetcode]], [[Neetcode]], [[Java]], [[Python]]

# NC - Contains Duplicates
Given an integer array `nums`, return `true` if any value appears **more than once** in the array, otherwise return `false`.
```
class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
```

## Approach
To avoid O(n^2) time complexity, you can sort the array so that duplicates are next to each other, reducing the time to O(n log n)

BEST approach is using a hashset. no sorting needing!
- allows us to insert elements into the set at O(1) and check if the value is already in hashset

```
class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        hashset = set()

        for n in nums:
            if n in hashset:
                return True
            hashset.add(n)
        return False
```

Solution in java:
```
public class Solution {
    public boolean hasDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (seen.contains(num)) {
                return true;
            }
            seen.add(num);
        }
        return false;
    }
}
```
# References
https://www.youtube.com/watch?v=3OamzN90kPg - Explanation