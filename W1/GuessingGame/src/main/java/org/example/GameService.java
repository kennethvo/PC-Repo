package org.example;

import java.util.InputMismatchException;
import java.util.Scanner;

public class GameService {
    // Fields
    private Game game;
    private Scanner scanner;

    // Constructor
    public GameService() {
        this.game = new Game();
        this.scanner = new Scanner(System.in);
    }
    // Methods
    public void start() {
        boolean gameWon;
        do {
            int guess = this.getPlayerGuess();
            gameWon = this.processGuess(guess);
        } while (!gameWon);
    }


    private int getPlayerGuess() {
        while(true) {
            System.out.print("Please enter a guess from 1 - 100: ");
            try {
                int guess = scanner.nextInt();
                if (guess >= 1 && guess <= 100) {
                    return guess;
                } else {
                    System.out.println("Input was out of bounds, try again.");
                }
            } catch (InputMismatchException e) {
                System.out.println("Bad Input Detected: please enter an int:");
                scanner.next();
            } catch (Exception e) {
                System.out.println("Bad Input Detected: please enter an int:");
                scanner.next();
            }
        }
    }

    private boolean processGuess(int guess) {
        if ( guess > game.getSecretNumber() ) {
            System.out.println("Too High!");
            return false;
        } else if ( guess < game.getSecretNumber() ) {
            System.out.println("Too Low!");
            return false;
        } else {
            System.out.println("You guessed the number! Woohoo!");
            return true;
        }
    }
}
