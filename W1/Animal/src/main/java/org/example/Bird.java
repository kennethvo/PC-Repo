package org.example;

public class Bird extends Animal {
    // Fields

    // Methods
    public void layEgg() {
        System.out.println("It's an EGG!!!");
    }

    @Override
    public void makeSound() {
        System.out.println("Tweet Tweet!");
    }
}
