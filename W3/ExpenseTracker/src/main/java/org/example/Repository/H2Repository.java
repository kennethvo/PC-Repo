package org.example.Repository;

import org.example.Expense;
import org.example.Repository.IRepository;

import java.sql.*;

import java.util.List;
import java.util.ArrayList;

public class H2Repository implements IRepository {
    // Fields
    private static final String H2_URL = "jdbc:h2:mem:expenses;DB_CLOSE_DELAY=-1";
    private Connection connection;

    // Constructor
    public H2Repository() {
        try{
            connection = DriverManager.getConnection(H2_URL);
            try (Statement stmt = connection.createStatement()) {
                String sql = "CREATE SCHEMA IF NOT EXISTS ExpenseReport;" +
                        "CREATE TABLE IF NOT EXISTS ExpenseReport.Expenses (" +
                        "id INT PRIMARY KEY," +
                        "date TIMESTAMP NOT NULL," +
                        "price FLOAT CHECK (price > 0)," +
                        "merchant VARCHAR(50) NOT NULL" +
                        ");";

                stmt.execute(sql);
                System.out.println("Successful creation of H2 database!");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void createExpense(Expense expense) {
        String sql = "INSERT INTO ExpenseReport.Expenses (id , date, price, merchant) VALUES ( ?, ?, ?, ?);";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, expense.getId());
            stmt.setDate(2, new java.sql.Date(expense.getDate().getTime()));
            stmt.setDouble(3, expense.getValue());
            stmt.setString(4, expense.getMerchant());
            stmt.executeUpdate();
            System.out.println("Expense created successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Expense readExpense(int id) {
//        String sql = "SELECT * FROM EspenseReport.Expenses WHERE id = ?";
//        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
//            stmt.setInt(1, id);
//            Expense expense = stmt.executeQuery();
//            return expense;
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
        return null;
    }

    @Override
    public void updateExpense(Expense expense) {

    }

    @Override
    public void deleteExpense(int id) {

    }

    @Override
    public List<Expense> loadExpenses() {
        return List.of();
    }

    @Override
    public void saveExpenses(List<Expense> expenses) {

    }

    // Methods
}