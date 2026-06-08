package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
class OperationData {
    private OperationHours operationHours;
    private Map<String, SeasonalUsage> seasonalUsagePattern;
    private Map<String, MonthlyUsage> monthlyUsagePattern;
    private Map<String, List<String>> peakLoadHours;
    private HvacSchedule hvacSchedule;
}