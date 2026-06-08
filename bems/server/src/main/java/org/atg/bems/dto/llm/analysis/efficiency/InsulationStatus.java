package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

import java.time.LocalDate;

@Data
class InsulationStatus {
    private String walls;
    private String windows;
    private String roof;
    private LocalDate lastInspectionDate;
    private ThermalTransmittance thermalTransmittance;
}