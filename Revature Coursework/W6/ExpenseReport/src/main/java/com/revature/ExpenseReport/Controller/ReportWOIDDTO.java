package com.revature.ExpenseReport.Controller;

import com.revature.ExpenseReport.Model.Expense;

import java.util.List;

public record ReportWOIDDTO(String reportTitle, String reportStatus,
                        List<Expense> reportExpenses) {}