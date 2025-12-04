
2025-10-04 16:09

Tags: [[Leetcode]], [[Neetcode]], [[Java]], [[Python]]

# NC - Valid Anagram
Given two strings `s` and `t`, return `true` if the two strings are anagrams of each other, otherwise return `false`.

```
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
```

## Approach
Using hashmaps for both strings, you can compare each hashmaps keys and check for the same amount for each keys to match the anagrams

Time complexity will be O(s + t) because you have to go loop through both hashmaps

```
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        countS, countT = {}, {}

        for i in range(len(s)):
            countS[s[i]] = 1 + countS.get(s[i], 0)
            countT[t[i]] = 1 + countT.get(t[i], 0)
        for j in countS:
            if countS[j] != countT.get(j, 0):
                return False

        return True
```

## Approach 2
If an interviewer asks "How can you make a solution with O(1) memory instead of O(s + t)"
- you could sort the strings and return the result of if the two strings match after they're both sorted

```
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
		return sorted(s) == sorted(t)
```

# References
https://youtu.be/9UtInBqnCgA?si=bfkApsMGCXyDubPq - Explanation