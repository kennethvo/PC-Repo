package org.example;

public class Main {
    static void main() {
        IO.println("Hello and welcome!");

        GameService gameService = new GameService();
        gameService.start();

        IO.println("Thanks for playing!");
    }
}
