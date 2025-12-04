package org.example;
import java.util.*;

public class RichsSolution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int N = scanner.nextInt();

        int[] isbns = new int[N];

        for ( int i = 0; i < N; i++) {
            isbns[i] = scanner.nextInt();
        }

        int target_ISBN = scanner.nextInt();

        if ( target_ISBN > isbns[N-1] ) {
            System.out.println(N);
            return;
        }

        for ( int i = 0; i < N; i++ ) {
            if (target_ISBN <= isbns[i]) {
                System.out.println(i);
                return;
            }
        }
    }
}











