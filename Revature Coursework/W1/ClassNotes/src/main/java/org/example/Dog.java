package org.example;

public class Dog {
    // fields
   private String name = "Rex";
    private String breed = "Irish Setter";
    private int age = 1;

    // constructors
    public Dog() {}

    public Dog(String name, String breed, int age){
        this.name = name;
        this.breed = breed;
        this.age = age;
    }

    // methods
    void Speak(){
        System.out.println("WoOOOOooooOOOOf!");
    }
    void Walk(){
        System.out.println("Go for a walk!");
    }
    private void GetOlder(){
        age += 7;
        //age = age + 7;
    }

    public String getName() {
        return name;
    }
    public String getBreed() {
        return breed;
    }
    public void setName(String name){
        this.name = name;
    }
}
