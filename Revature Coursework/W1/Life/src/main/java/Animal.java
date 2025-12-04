// Animal.java
public abstract class Animal {
    // Shared field
    protected String name;

    // Constructor
    public Animal(String name) {
        this.name = name;
    }

    // A concrete method shared by all animals
    public void eat() {
        System.out.println(name + " is eating.");
    }

    // An abstract method that subclasses must define
    public abstract void makeSound();
}