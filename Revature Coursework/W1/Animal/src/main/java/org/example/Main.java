package org.example;

public class Main {
    static void main() {
        Dog dog = new Dog("Rex");
        Cat cat = new Cat();
        Bird birb = new Bird();

        dog.makeSound();
        cat.makeSound();
        birb.makeSound();

        cat.eat();
        dog.eat();

    }
}
