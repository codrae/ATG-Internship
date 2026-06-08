package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

import java.time.LocalTime;

@Data
class TemperatureSchedule {
    private LocalTime start;
    private LocalTime end;
    private double targetTemp;
}