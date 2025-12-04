package org.example.Repository;

import org.example.Expense;

import java.io.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class CSVRepository implements IRepository{
    // Fields
    private String filename = "expenses.csv";

    // Constructor
    public CSVRepository() {}

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
        String line;
        List<Expense> expenses = new ArrayList<>();

        try {
            BufferedReader reader = new BufferedReader(new FileReader(filename));
            line = reader.readLine();

            while ((line = reader.readLine()) != null) { //read in the line from the file
                String[] parts = line.split(","); //split the line on the commas

                //assign the individual values back to types/variables
                int id = Integer.parseInt(parts[0]);
                Date date = new Date(parts[1]);
                double value = Double.parseDouble(parts[2]);
                String merchant = parts[3];

                //create an object/expense from the individual variables add the new expense to a collection/list of expenses
                expenses.add(new Expense(id, date, value, merchant));
            }
        } catch (IOException e) {
            System.out.println("Error reading from CSV file!");
        }
        return expenses;
    }

    public void saveExpenses(List<Expense> expenses){
        try {
            BufferedWriter writer = new BufferedWriter( new FileWriter(filename));

            writer.write("id, date, value, merchant");
            writer.newLine();

            for( Expense ex : expenses ) {
                writer.write(ex.toCSV());
                writer.newLine();
            }
            writer.flush();
            writer.close();
            System.out.println("File written successfully");
        } catch (Exception e){
            System.out.println("Error writing file.");
        }
    }
}
