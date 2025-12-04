package org.example;

import java.util.Scanner;
public class RichsSolution {
    public static void main(String[] args) {
        char[] colors = { 'R', 'G', 'B' };
        int Len = 2;

        Scanner scanner = new Scanner(System.in);
        String starting = scanner.next();
        int period = scanner.nextInt();

        for (int i = 0; i < starting.length(); i++) {
            for (int j = 0; j < 3; j++){
                if (starting.charAt(i) == colors[j]){
                    int pos = j + period;
                    if (pos > 2) { pos = pos % 3; }
                    System.out.print(colors[pos]);
                }
            }
        }
    }
}
