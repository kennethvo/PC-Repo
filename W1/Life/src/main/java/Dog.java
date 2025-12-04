// Dog.java
public class Dog extends Animal implements IMammal {

    // Constructor that calls the parent (Animal) constructor
    public Dog(String name) {
        super(name);
    }

    // Implementing the abstract method from Animal
    @Override
    public void makeSound() {
        System.out.println(name + " says: Woof!");
    }

    // Implementing the required method from the Mammal interface
    @Override
    public void giveBirth() {
        System.out.println(name + " gives birth to live puppies.");
    }
}