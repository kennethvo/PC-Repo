import java.util.Scanner;
public class grader {

    public static void main(String[] args) {
        System.out.print("Print your grade:");

        while(true) {
            Scanner input = new Scanner(System.in);
            double grade;

            try {
                grade = input.nextDouble();
            } catch (Exception e) {
                System.out.println("That wasn't a number try again.");
                continue;
            }

            if (grade > 100 || grade < 0) {
                System.out.println("Grade given is out of scope try again.");
                continue;
            }

            if (grade >= 90) { System.out.println("You got an A");
            } else if (grade >= 80) {  System.out.println("You got a B");
            } else if (grade >= 70) {  System.out.println("You got a C");
            } else if (grade >= 60) { System.out.println("You got a D");
            } else { System.out.println("You got an F");
            }

            input.close();
            break;
        }
    }
}