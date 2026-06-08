package org.atg.bems.dto.llm.analysis.indicator;

import lombok.Data;

@Data
public class PowerUsage {
    private double currentMonth;
    private double previousMonth;
    private double changeRate;
    private double peakDemand;
}