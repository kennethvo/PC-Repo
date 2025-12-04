/*
Signal Light:
    On a street, you notice that there was a light signal whose color changes from Red to Green in 1 minute, Green to Blue in 1 minute, and Blue to Red in 1 minute.
    Similarly, you are given a string S where each character denotes the initial color of the light signal and an integer K.
    You have to print the final states of all the light signals after K minutes.

Note:
    String S will contain only "R", "G", and "B" characters.
    R in string denotes Red Color.
    G in string denotes Green Color.
    B in string denotes Blue Color.

Function Description:
    In the provided code snippet, implement the provided method RGBLight() to print the final states of lights signals after K minutes. You can write your code in the space below the phrase “WRITE YOUR LOGIC HERE”.

    There will be multiple test cases running so the Input and Output should match exactly as provided.
    The base Output variable result is set to a default value of -404 which can be modified. Additionally, you can add or remove these output variables.

Input Format:
    The first line will contain String S.
    The second line will contain integer K.

Sample Input:
RBRG
2

Constraints:
1 <= length(S) <= 103
1 <= K <= 106

Output Format:
Print a String denoting the final state of all the light signals after K minutes.

Sample Output:
BGBR

Explanation:
    S = RBRG
    After 2 minutes, the light signals with color R will change to color B.
    Light signals with color G will change to color R.
    Light signals with color B will change to color G.
    Hence, the final state will be BGBR.
 */

package org.example;

public class Main {
    static void main(){

    }
}
