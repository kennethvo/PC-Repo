package org.example.Repository;

import org.example.Expense;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class TextRepository implements IRepository{
    // Fields
    private String filename = "expenses.txt";

    // Constructor
    public TextRepository() {}

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
                .map(e -> (e.getId() == expense.getId()) ? expense : e)
                .collect(Collectors.toList());
        saveExpenses(updatedExpenses);
    }

    public void deleteExpense(int id){
        List<Expense> expenses = loadExpenses();
        expenses.removeIf(e -> e.getId() == id);
        saveExpenses(expenses);
    }

    public List<Expense> loadExpenses() {
        List<Expense> expenses = new ArrayList<>();

        try {
            FileReader reader = new FileReader(filename);
            String text = reader.readAllAsString();

            // split the expenses on "],"
            String[] lines = text.split("],");

            for (String line : lines) {
                line = line.replace("]]","");
                String[] element = line.split(",|="); // each element is one serialized expense

                int id = Integer.parseInt(element[1]);
                Date date = new Date(element[3]);
                double value = Double.parseDouble(element[5]);
                String merchant = element[7];

                expenses.add(new Expense(id, date, value, merchant));
            }
        } catch (IOException e) {
            System.out.println("Error reading text file!");
        }

        return expenses;
    }

    public void saveExpenses(List<Expense> expenses){
        try {
            FileWriter file = new FileWriter(filename, false);
            PrintWriter writer = new PrintWriter(file, true);
            writer.println(expenses);
            file.close();
            System.out.println("File written successfully");
        } catch (Exception e){
            System.out.println("Error writing file.");
        }
    }
}
