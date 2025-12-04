
2025-11-10 09:45

Tags:

# Revature - Portfolios
- JDBC, H2, Postgres
	- H2 is just another database to work on, but it lives inside the application's memory
	- H2 lives as long as your app lives (if it turns off or restarts H2 gets wiped)
	- Lightweight method to add interaction to your Java app alongside SQL

Serialization: in the context of 3rd week Monday, put the H2 logic in the repository layer
The structure for interacting with a SQL database is by sending strings of SQL code through JDBC so from Java to the SQL database to interact directly with it


`sendevastand hand (right) sendevastand person (left) adam and god, portraits and figures behind. post it note text bubbles that overlap the portraits`

```java
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
    // you can only change final values in the constructor    public H2Repository() {  
  
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
```

What is SQL injection?
What is Remote Code Execution?
What is Parameterization?

week 4-6 project
- P0 is individual project. must present your own work.
- PRESENTATIONS on Friday, November 21st.
- if you want you can make a slidedeck idk

3:27 is project description
- persistence: basically the JSON stuff, data that remains

QC
- starts 9AM
- sit in the teams like a waiting room


### PROJECT 0
- DollyShot, Machina
# References