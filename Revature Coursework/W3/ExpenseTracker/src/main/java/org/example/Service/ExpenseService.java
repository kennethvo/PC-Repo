package org.example.Service;

import org.example.Expense;
import org.example.Repository.IRepository;

import java.util.Date;
import java.util.List;

public class ExpenseService {
    // Fields
    private IRepository repo;

    // Constructor
    public ExpenseService(IRepository repository) {
        this.repo = repository;
        this.seed();
    }

    // Methods
    public Expense createNewExpense(int id, double value, String merchant){
        if (repo.readExpense(id) != null){
            return null;
        }
        Expense newExpense = new Expense(id, new Date(), value, merchant);
        repo.createExpense(newExpense);
        return newExpense;
    }

    public Expense getExpense(int id){
       return repo.readExpense(id);
    }

    public boolean deleteExpense(int id){
        if (repo.readExpense(id) == null){
            return false;
        }
        repo.deleteExpense(id);
        return true;
    }

    public void printExpenses(){
        System.out.println(repo.loadExpenses());
    }

    public double sumExpenses(){
        List<Expense> expenses = repo.loadExpenses();
        double sum = 0;
        for (Expense e : expenses ){
            sum += e.getValue();
        }
        return sum;
    }

    public void seed(){
        List<Expense> expenses = repo.loadExpenses();
        if(expenses.isEmpty()) {
            System.out.println("No expenses found in repo. Generating expenses...");

            this.createNewExpense(1, 99.95, "Walmart");
            this.createNewExpense(2, 55.99, "Costco");
            this.createNewExpense(3, 29.99, "HEB");
            this.createNewExpense(4, 72.00, "Buffalo Wild Wings");

            System.out.println("Expenses loaded into repo.");
        } else {
            System.out.println("Expenses loaded from repo.");
        }
    }
}
