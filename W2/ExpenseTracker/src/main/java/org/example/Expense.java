package org.example;

import java.util.Date;

public class Expense {
    // Fields
    private int id;
    private Date date;
    private double value;
    private String merchant;

    // Constructor
    public Expense(int id, Date date, double value, String merchant) {
        this.id = id;
        this.date = date;
        this.value = value;
        this.merchant = merchant;
    }

    public int getId() { return this.id; }
    public double getValue() { return this.value; }
    public Date getDate() { return this.date; }
    public String getMerchant() { return this.merchant; }

    // Methods
    @Override
    public String toString() {
        return "Expense [id=" + this.id + ", date=" + this.date + ", value=" + this.value + ", merchant=" + this.merchant + "]";
    }

    public String toCSV() {
        return this.id + ", " + this.date + ", " + this.value + ", " + this.merchant;
    }

    public String toJSON(){
        return "{\"id\":" + this.id + ", \"date\":\"" + this.date + "\", \"value\":" + this.value + ", \"merchant\":\"" + this.merchant + "\"}";
    }
}
