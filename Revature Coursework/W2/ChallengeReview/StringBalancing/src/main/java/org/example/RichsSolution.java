package org.example;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class RichsSolution {
    public static void main(String[] args) {
        List<Character> letters = new ArrayList<Character> ();
        Scanner scanner = new Scanner(System.in);
        scanner.next();
        String in = scanner.next();

        for (int i = 0; i < in.length(); i++) {
            System.out.println(letters);
            if (letters.contains(in.charAt(i))){
                int ltrpos = letters.indexOf(in.charAt(i));
                letters.remove(ltrpos);
            }
            else {
                letters.add(in.charAt(i));
            }
        }

        System.out.println(letters.size());
        for (char l : letters ){
            System.out.println( l + " " + in.length());
        }
    }
}
