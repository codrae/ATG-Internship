package org.atg.bems.dto.llm.analysis.indicator;

import lombok.Data;

@Data
public class BuildingInfo {
    private String name;
    private String type;
    private double area;
    private String address;
}