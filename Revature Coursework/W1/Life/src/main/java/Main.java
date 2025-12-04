
public class Main {
    public static void main(String[] args) {
        // Create a Dog object
        Dog myDog = new Dog("Buddy");
        System.out.println("--- Dog Demo (Animal, Mammal) ---");
        myDog.makeSound(); // From Animal
        myDog.eat();       // From Animal
        myDog.giveBirth(); // From Mammal

        System.out.println(); // Adding a space

        // Create a Cat object
        Cat myCat = new Cat("Whiskers");
        System.out.println("--- Cat Demo (Animal, Mammal) ---");
        myCat.makeSound(); // From Animal
        myCat.eat();       // From Animal
        myCat.giveBirth(); // From Mammal

        System.out.println(); // Adding a space

        // Create a Bird object
        Bird myBird = new Bird("Tweety");
        System.out.println("--- Bird Demo (Animal only) ---");
        myBird.makeSound(); // From Animal
        myBird.eat();       // From Animal
        myBird.layEgg();    // Specific to Bird

        // --- DEMONSTRATION OF THE DIFFERENCE ---
        // The following line will cause a compile-time error
        // because the Bird class does not implement the Mammal interface.
        // myBird.giveBirth(); 
    }
}