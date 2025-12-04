package org.example;

import org.example.Repository.IRepository;
import org.example.Repository.CSVRepository;
import org.example.Repository.JSONRepository;
import org.example.Repository.TextRepository;
import org.example.Repository.H2Repository;

import org.example.Service.ExpenseService;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

// As a user, I want to track my expenses so that i can build/submit an expense report at the end of the week.
// As a user, I need to include the date, value, and merchant to include on my expense report.

public class Main {
    // fields

    // methods
    static void main() {
        System.out.println("Expense Tracker Starting...");
//        List<Expense> expenses = new ArrayList<Expense>();
//        THIS is where we switch our repository from one to another
//        IRepository repo = new TextRepository();
//        IRepository repo = new CSVRepository();
//        IRepository repo = new JSONRepository();
        IRepository repo = new H2Repository();

//        System.out.println("Creating a test expense:");
//        expenses.add(new Expense(1, new Date(), 99.95, "Walmart"));
//        expenses.add(new Expense(2, new Date(), 85.75, "Costco"));
//        expenses.add(new Expense(3, new Date(), 10000, "Private Jet"));
//        repo.saveExpenses(expenses);

//        System.out.println("Loading saved expenses...");
//        expenses = repo.loadExpenses();
//        System.out.println(expenses);

        ExpenseService service = new ExpenseService(repo);
        service.createNewExpense(1, 99.95, "Walmart");
//        service.sumExpenses();
//        service.printExpenses();

        System.out.println("Expense Tracker Closing...");
    }
}
