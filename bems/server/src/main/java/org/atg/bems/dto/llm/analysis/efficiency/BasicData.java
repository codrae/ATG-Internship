package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
class BasicData {
    private Map<LocalDate, Map<LocalTime, Double>> hourlyPowerUsage;
    private PowerRatePlan powerRatePlan;
    private List<PowerBill> powerBillHistory;
    private FacilityInfo facilityInfo;
    private List<Equipment> equipmentList;
}