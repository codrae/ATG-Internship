package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

import java.time.LocalDate;

@Data
class MonthlyUsage {
    private double totalUsage;
    private double averageDaily;
    private LocalDate peakDay;
}