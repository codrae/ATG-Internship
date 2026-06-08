package org.atg.bems.dto.llm.analysis.indicator;


import lombok.Data;

@Data
public class IndicatorAnalysisDto {
    private BuildingInfo buildingInfo;
    private PowerUsage powerUsage;
    private EstimatedBill estimatedBill;
    private AnomalyAlerts anomalyAlerts;
    private EnergyIntensity energyIntensity;
}