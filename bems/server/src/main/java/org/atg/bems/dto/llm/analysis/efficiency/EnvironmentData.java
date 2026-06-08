package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@Data
class EnvironmentData {
    private Map<LocalDate, Map<LocalTime, Double>> indoorTemp;
    private Map<LocalDate, Map<LocalTime, Double>> outdoorTemp;
    private Map<LocalDate, Map<LocalTime, Integer>> humidity;
    private InsulationStatus insulationStatus;
}