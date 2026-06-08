package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class HvacDailySchedule {
    private TemperatureSchedule cooling;
    private TemperatureSchedule heating;
}