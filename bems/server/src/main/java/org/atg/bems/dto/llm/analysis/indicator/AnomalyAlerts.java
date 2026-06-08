package org.atg.bems.dto.llm.analysis.indicator;


import java.util.List;

import lombok.Data;

@Data
public class AnomalyAlerts {
    private int count;
    private List<String> timeRanges;
    private double maxValue;
    private double minValue;
}