package com.revature.ExpenseReport.Model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "reports")
@Data
@AllArgsConstructor

public class Report {
    // fields

    @Id @GeneratedValue
    private String reportId;
    private String reportTitle;
    private String reportStatus;

    List<Expense> reportExpenses;

    // methods
    public Report(String title, String status) {
        this.reportTitle = title;
        this.reportStatus = status;
    }
    
}
