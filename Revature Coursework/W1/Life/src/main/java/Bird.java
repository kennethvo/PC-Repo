// Bird.java
public class Bird extends Animal {

    // Constructor that calls the parent (Animal) constructor
    public Bird(String name) {
        super(name);
    }

    // Implementing the abstract method from Animal
    @Override
    public void makeSound() {
        System.out.println(name + " says: Chirp!");
    }

    // A method specific to Bird, contrasting the Mammal interface
    public void layEgg() {
        System.out.println(name + " lays an egg.");
    }
}