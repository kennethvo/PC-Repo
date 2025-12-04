package org.example;

public abstract class Animal {
    // Field
    private String name;

    // Constructor
    public Animal () {}

    public Animal( String name ) {
        this.name = name;
    }
    // Method
    public void eat() {
        System.out.println("Om nomnom!");
    }

    public abstract void makeSound();
}
