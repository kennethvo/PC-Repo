package org.example;

import java.util.Random;

public class Game {
    // Fields
    private int secretNumber;

    // Constructor
    public Game(){
        Random random = new Random();
        this.secretNumber = random.nextInt(100 ) + 1;
    }

    // Methods
    public int getSecretNumber() {
        return this.secretNumber;
    }
}
