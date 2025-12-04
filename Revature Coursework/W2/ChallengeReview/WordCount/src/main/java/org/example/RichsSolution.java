package org.example;

import java.util.*;
public class RichsSolution {
    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        Set<Character> vowels = new HashSet<>();
        vowels.add('a');
        vowels.add('e');
        vowels.add('i');
        vowels.add('o');
        vowels.add('u');

        int vowelCount = 0;

        while (scanner.hasNext()) {
            String word = scanner.next().toLowerCase();
            if (vowels.contains(word.charAt(0))) {
                vowelCount++;
            }
        }

        scanner.close();

        System.out.println(vowelCount);
    }
}











