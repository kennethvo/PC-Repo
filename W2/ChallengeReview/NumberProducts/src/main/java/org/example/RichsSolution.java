package org.example;

import java.util.Scanner;
public class RichsSolution {
    public static void main (String[] args) {
        Scanner scanner = new Scanner(System.in);
        int N = scanner.nextInt();
        int[] vals = new int[N];

        for (int i = 0; i < N; i++){
            vals[i] = scanner.nextInt();
        }

        for (int i = 1; i < N; i++) {
            for (int j = 0; j < i; j++) {
                if (vals[i] == vals[j]) {
                    vals[i] = 1;
                }
            }
        }

        int oddProd = 1;
        int evenProd = 1;

        for (int v : vals) {
            if( v % 2 == 0) {
               evenProd *= v;
            }
            else {
               oddProd *= v;
            }
        }

        if (evenProd - oddProd >= 0) {
            System.out.println(evenProd - oddProd);
        }
        else {
            System.out.println(oddProd - evenProd);
        }
    }
}
