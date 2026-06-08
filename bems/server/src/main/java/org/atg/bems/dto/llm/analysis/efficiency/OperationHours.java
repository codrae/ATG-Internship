package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class OperationHours {
    private DailyHours weekday;
    private DailyHours weekend;
}