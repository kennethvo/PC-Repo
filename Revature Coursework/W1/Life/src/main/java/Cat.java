// Cat.java
public class Cat extends Animal implements IMammal {

    // Constructor
    public Cat(String name) {
        super(name);
    }

    // Implementing the abstract method from Animal
    @Override
    public void makeSound() {
        System.out.println(name + " says: Meow!");
    }

    // Implementing the required method from the Mammal interface
    @Override
    public void giveBirth() {
        System.out.println(name + " gives birth to live kittens.");
    }
}