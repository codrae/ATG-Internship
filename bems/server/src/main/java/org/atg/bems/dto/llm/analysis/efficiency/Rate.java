package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class Rate {
    private double peak;
    private double middleLoad;
    private double offPeak;
}