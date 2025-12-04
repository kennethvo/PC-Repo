/*
Write a program to get the difference between the product of odd and even numbers of an array after removing duplicates from it. Note: if the difference between even and odd numbers is negative, then make it positive before printing/ returning the result.

Input Format:
    The first line contains an integer, which denotes the size of the array
    The second line contains the elements of an array.

Sample Input:
7
6 3 4 6 1 3 2

Sample Output:
45

Explanation"
    Here in this array, the repeated elements are 6 and 3. So, after removing all the duplicates (6 and 3), we were left with the elements (6, 3, 4, 1, 2). Out of these numbers, (3, 1) are the odd numbers, and (6, 4, 2) are the even numbers. Hence,
    product of even numbers = 6*4*2 = 48
    product of odd numbers = 3*1 = 3
    therefore difference = 48 - 3 = 45 (difference b/w even and odd)
 */
package org.example;

public class Main {
    static void main() {
    }
}
