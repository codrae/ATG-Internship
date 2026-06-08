package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class ThermalTransmittance {
    private double walls;
    private double windows;
    private double roof;
}