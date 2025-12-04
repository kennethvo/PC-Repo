package org.example;
import java.lang.*;
import java.io.*;
import java.util.*;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner=new Scanner(System.in);
        String sampleInput;
        sampleInput = scanner.nextLine();
        boolean result = true;
        for (int i = 0; i < sampleInput.length(); i++) {
            if (sampleInput.charAt(i) != sampleInput.charAt(sampleInput.length() - i)) {
                result = false;
                break;
            }
        }
        System.out.println(result);
    }
}