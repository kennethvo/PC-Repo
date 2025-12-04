package org.example;

import org.example.Repository.*;
import org.example.Service.ExpenseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

// As a user, I want to track my expenses so that i can build/submit an expense report at the end of the week.
// As a user, I need to include the date, value, and merchant to include on my expense report.

public class Main {
    // fields
    private static final Logger log = LoggerFactory.getLogger(Main.class);

    // methods
    static void main() {
        System.out.println("Expense Tracker Starting...");
        log.info("Starting the Expense Tracker.");

//        List<Expense> expenses = new ArrayList<Expense>();
//        THIS is where we switch our repository from one to another
//        IRepository repo = new TextRepository();
//        IRepository repo = new CSVRepository();
//        IRepository repo = new JSONRepository();
//        IRepository repo = new H2Repository();
//        IRepository repo = new PostgreSQLRepository();
        IRepository repo = new MongoRepository();
        log.info("Repository created.");

//        System.out.println("Creating a test expense:");
//        expenses.add(new Expense(1, new Date(), 99.95, "Walmart"));
//        expenses.add(new Expense(2, new Date(), 85.75, "Costco"));
//        expenses.add(new Expense(3, new Date(), 10000, "Private Jet"));
//        repo.saveExpenses(expenses);

//        System.out.println("Loading saved expenses...");
//        expenses = repo.loadExpenses();
//        System.out.println(expenses);

        ExpenseService service = new ExpenseService(repo);
        log.info("Service created.");

        System.out.println("Printing Expenses: ");
        service.printExpenses();
        log.debug("ran print expenses");

        System.out.println("Summing Expenses: ");
        System.out.println(service.sumExpenses());

        System.out.println("Expense Tracker Closing...");
        log.info("Expense Tracker Closing.");
    }
}
