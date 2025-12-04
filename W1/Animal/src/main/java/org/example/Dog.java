package org.example;

public class Dog extends Animal implements IMammal{
    // Fields

    // Methods
    public Dog (String name){
        super(name);
    }

    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }

    @Override
    public void giveBirth() {
        System.out.println("Gives live birth to puppies!");
    }

    @Override
    public void eat() {
        System.out.println("Woff Nom Nom!");
    }
}
