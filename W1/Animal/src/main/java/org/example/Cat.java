package org.example;

public class Cat extends Animal implements IMammal{
    // Fields

    // Methods


    @Override
    public void makeSound() {
        System.out.println("Meowwwwwwwwww!");
    }

    @Override
    public void giveBirth() {
        System.out.println("Gives live birth to kittens!");
    }
}
