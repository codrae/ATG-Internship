package org.atg.bems.dto.llm.analysis.efficiency;

import lombok.Data;

@Data
public class EnergyDataDTO {
    private BasicData basicData;
    private OperationData operationData;
    private EnvironmentData environmentData;
}