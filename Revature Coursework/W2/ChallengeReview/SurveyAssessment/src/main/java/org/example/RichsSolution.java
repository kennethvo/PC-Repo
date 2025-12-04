package org.example;
import java.util.Scanner;

public class RichsSolution {
    public static void main(String[] args) {
        int[] results = new int[5];

        Scanner scanner = new Scanner(System.in);

        while (scanner.hasNext()) {
            int val = scanner.nextInt();
            results[val-1]++;
        }

        for (int i = 0; i < 4; i++) {
            System.out.print(results[i] + " ");
        }
        System.out.print(results[4]);
    }
}
