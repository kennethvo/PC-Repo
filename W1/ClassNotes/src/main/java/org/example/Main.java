package org.example;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    static void main() {
        Dog pupper = new Dog();
        pupper.Speak();
        pupper.Walk();
        IO.println(pupper.getName());

        Dog minnie = new Dog("Minnie", "Maltize", 5);
        minnie.Speak();
        minnie.Walk();
        IO.println(minnie.getName());
        minnie.setName("Maxi");
        IO.println(minnie.getName());
    }
}
