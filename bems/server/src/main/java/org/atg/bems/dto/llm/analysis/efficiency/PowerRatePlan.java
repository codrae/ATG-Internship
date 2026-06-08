package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class PowerRatePlan {
    private String planName;
    private double basicRate;
    private SeasonalRates usageRates;
}