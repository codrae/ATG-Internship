package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class SeasonalRates {
    private Rate summer;
    private Rate winter;
}