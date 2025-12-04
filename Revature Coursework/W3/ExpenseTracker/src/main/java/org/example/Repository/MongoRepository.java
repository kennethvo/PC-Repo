package org.example.Repository;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.example.Expense;
import org.bson.Document;
import com.mongodb.client.MongoCollection;

import java.util.ArrayList;
import java.util.List;

public class MongoRepository implements IRepository{
    // Fields
            //  "[language]://[username]:[password]@[host]/[database]?[options]
    private final String connectionString = "mongodb://mongoadmin:secret@localhost:27017/";

    private final MongoCollection<Document> expensesCollection;

    // Constructor
    public MongoRepository() {
        MongoClient mongoclient = MongoClients.create(connectionString);
        MongoDatabase database = mongoclient.getDatabase("expensesdb");
        this.expensesCollection = database.getCollection("expenses");
        System.out.println("Connected to MongoDb!");
    }

    // Methods
    private Expense documentToExpense(Document doc) {
        return new Expense( doc.getInteger("_id"),
                            doc.getDate("date"),
                            doc.getDouble("value"),
                            doc.getString("merchant"));
    }

    private Document expenseToDocument(Expense expense) {
        return new Document("_id", expense.getId())
                .append("date", expense.getDate())
                .append("value", expense.getValue())
                .append("merchant", expense.getMerchant());
    }

    @Override
    public void createExpense(Expense expense) {
        Document expenseDoc = expenseToDocument(expense);
        expensesCollection.insertOne(expenseDoc);
    }

    @Override
    public Expense readExpense(int id) {
        Document doc = expensesCollection.find(Filters.eq("_id", id)).first();
        return (doc != null) ? documentToExpense(doc) : null;
    }

    @Override
    public void updateExpense(Expense expense) {
        Document doc = expenseToDocument(expense);
        if( this.readExpense(expense.getId()) == null) {
            this.createExpense(expense);
        } else {
            expensesCollection.updateOne(Filters.eq("_id", expense.getId()), doc);
        }
    }

    @Override
    public void deleteExpense(int id) {
        expensesCollection.deleteOne(Filters.eq("_id", id));

    }

    @Override
    public List<Expense> loadExpenses() {
        List<Expense> expenses = new ArrayList<>();
        for (Document doc : expensesCollection.find()) {
            expenses.add(documentToExpense(doc));
        }
        return expenses;
    }

    @Override
    public void saveExpenses(List<Expense> expenses) {
        for ( Expense e : expenses ){
            this.updateExpense(e);
        }
    }
}
