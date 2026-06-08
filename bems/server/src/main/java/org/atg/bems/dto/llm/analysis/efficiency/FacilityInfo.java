package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class FacilityInfo {
    private double area;
    private String purpose;
    private int floors;
    private int constructionYear;
}