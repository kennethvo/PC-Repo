package com.revature.ExpenseReport;

import com.revature.ExpenseReport.Model.Expense;
import com.revature.ExpenseReport.Repository.ExpenseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class ExpenseReportApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExpenseReportApplication.class, args);
	}

    @Bean // Bean is a single method that is run after the application is started
    CommandLineRunner seedData (ExpenseRepository repository) {
        return args -> {
            var e1 = new Expense(LocalDate.now(), new BigDecimal(59.99), "Walmart");
            var e2 = new Expense(LocalDate.now().minusDays(1), new BigDecimal(14.75), "Starbucks");
            var e3 = new Expense(LocalDate.now().minusDays(2), new BigDecimal(99.88), "Buffalo Wild Wings");

            repository.saveAll(List.of(e1, e2, e3));
        };
    }
}