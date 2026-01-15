package com.revature.ExpenseReport.Service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;


import com.revature.ExpenseReport.Controller.ReportDTO;
import com.revature.ExpenseReport.Model.Report;
import com.revature.ExpenseReport.Repository.ReportRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.revature.ExpenseReport.Repository.ReportRepository;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTests {

    @Mock
    private ReportRepository repo;

    @InjectMocks
    private ReportService service;


    @Test
    public void testGetReportByIdInvalidId() {
        String id = "1";
        when(repo.findById(id)).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid ID"));

        var exception = assertThrows(
            ResponseStatusException.class, 
            () -> service.getById(id)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());

    }
  
    // Test for service.create()
    @Test
    public void happyPath_createReport_returnsReportDTO() {

        String reportId = "thisisthetestid";

        Report savedReport = new Report("TestReport", "DRAFT");
        savedReport.setReportId(reportId);

        ReportDTO expected = new ReportDTO(reportId, "TestReport", "DRAFT", List.of());

        when(repo.save(any())).thenReturn(savedReport);

        ReportDTO actual = service.create(expected);

        assertThat(actual).isEqualTo(expected);

        verify(repo, times(1)).save(any());
    }

}
