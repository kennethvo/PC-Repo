package org.example.Repository;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.example.Expense;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class JSONRepository implements IRepository{
    // Fields
    private String filename = "expenses.json";
    private Gson gson = new Gson();

    // Constructor
    public JSONRepository() {}

    // Methods
    public void createExpense(Expense expense){
        List<Expense> expenses = loadExpenses();
        expenses.add(expense);
        saveExpenses(expenses);
    }

    public Expense readExpense(int id){
        return loadExpenses().stream()
                .filter(e -> e.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public void updateExpense(Expense expense){
        List<Expense> expenses = loadExpenses();
        List<Expense> updatedExpenses = expenses.stream()
                .map(e -> (e.getId() == expense.getId())? expense : e)
                .collect(Collectors.toList());
        saveExpenses(updatedExpenses);
    }

    public void deleteExpense(int id){
        List<Expense> expenses = loadExpenses();
        expenses.removeIf( e -> e.getId() == id);
        saveExpenses(expenses);
    }

    public List<Expense> loadExpenses() {
        try {
            FileReader reader = new FileReader(filename);
            Type listExpenseType = new TypeToken<List<Expense>>(){}.getType();
            List<Expense> expenses = gson.fromJson(reader, listExpenseType);
            return (expenses != null) ? expenses : new ArrayList<>();
        } catch ( IOException e ) {
            System.out.println("JSON file not found/unreadable!");
            return new ArrayList<>();
        }
    }

    public void saveExpenses(List<Expense> expenses) {
        try {
            FileWriter file = new FileWriter(filename, false);
            gson.toJson(expenses, file);
            file.close();
            System.out.println("File written successfully");
        } catch (Exception e){
            System.out.println("Error writing file.");
        }
    }
}
