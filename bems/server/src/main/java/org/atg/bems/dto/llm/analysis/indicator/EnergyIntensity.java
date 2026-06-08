package org.atg.bems.dto.llm.analysis.indicator;

import lombok.Data;

@Data
public class EnergyIntensity {
    private double currentMonth;
    private double previousMonth;
    private String unit;
}