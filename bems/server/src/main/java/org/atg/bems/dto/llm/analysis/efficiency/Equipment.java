package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class Equipment {
    private String id;
    private String name;
    private String type;
    private double ratedPower;
    private String location;
    private Integer operatingHours;
    private Integer quantity;
}