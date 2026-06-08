package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class HvacSchedule {
    private HvacDailySchedule weekday;
}