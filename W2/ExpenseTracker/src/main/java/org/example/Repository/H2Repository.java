package org.example.Repository;

import org.example.Expense;
import org.example.Repository.IRepository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

public class H2Repository implements IRepository {
    // fields
    private static final String H2_URL = "jdbc:h2:mm:expenses;" +
            "DB_CLOSE_DELAY=-1"; // talk directory to database connection. usually use a builder to create the string for us
    private Connection connection;

    // constructor
    // you can only change final values in the constructor
    public H2Repository() {

        try {
            connection = DriverManager.getConnection(H2_URL); // managing diff connections require diff versions of the JDBC
            String sql =
                    "CREATE SCHEMA IF NOT EXISTS ExpenseReport;" +
                    "CREATE TABLE IF NOT EXISTS ExpenseReport.Expenses (" +
                    "id INTEGER PRIMARY KEY," +
                    "date TIMESTAMP NOT NULL," +
                    "price FLOAT CHECK (price > 0)," +
                    "merchant VARCHAR(50) NOT NULL" +
                    ");";

            Statement stmt = connection.createStatement();
            stmt.execute(sql); // represents real world interactions through this code
            System.out.println("Successfully Created Expense Report Database!");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    // methods
    @Override
    public void createExpense(Expense expense) {
        String sql = String.format("INSERT INTO ExpenseReport.Expenses (id, date, price, merchant) VALUES (%d, ?, ?, ?);", expense.getID());
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, expense.getID());
            stmt.setDate(2, expensegetDate());
            stmt.setFloat(3, expense.getValue());
            setmt.setString(4, expense.getMerchant());
        }
    }

    @Override
    public Expense readExpense(int id) {
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

}
