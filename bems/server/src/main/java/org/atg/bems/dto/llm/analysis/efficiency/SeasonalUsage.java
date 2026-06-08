package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class SeasonalUsage {
    private double averageDailyUsage;
    private String peakTime;
    private double peakUsage;
}