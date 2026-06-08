package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
class PowerBill {
    private String month;
    private double amount;
    private double usage;
}