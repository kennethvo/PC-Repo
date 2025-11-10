public class HelloJava {


    // fields / properties

    // methods / behaviors


    // main method
    public static void main(String[] args) {
        // comment :)
        System.out.println("Hello World");
        IO.println("Hello Again!");

        // numerical types
        int myInt = 24; // integer
        double myDouble; // decimal
        myDouble = 2.5;
        myInt = 61;

        // mathematical operators ( - + * / %)
        myInt = 67 - 41;

        // comparisons operators ( > < == <= >= !=)

        /* control flow covers all keywords and functionality that allow an app to
           make a decision, and act on it without us providing added input

           if, else if, else
           switch, case
           for, while, do-while
           exception handling w/ try, catch
         */

        // pseudo-code - describes logic of plan

        // initialize a bool
        myBool = false;

        // make a choice based on bool

        // if true do A
        if (myBool == true) {
            IO.println("true!");
        }
        // if false do B
        else {
            IO.println("false!");
        }
    }
}
