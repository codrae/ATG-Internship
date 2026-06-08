package org.atg.bems.dto.llm.analysis.indicator;

import lombok.Data;

@Data
public class EstimatedBill {
    private double basicCharge;
    private double usageCharge;
    private double totalEstimate;
}