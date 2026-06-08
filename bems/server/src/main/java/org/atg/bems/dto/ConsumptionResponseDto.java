package org.atg.bems.dto;

import lombok.Getter;
import lombok.Setter;
import org.atg.bems.postgresql.entity.ElectricalConsumption;

import java.time.LocalDateTime;

public record ConsumptionResponseDto(String buildingName, Double value, LocalDateTime updatedTime) {
    public static ConsumptionResponseDto toDto(ElectricalConsumption electricalConsumption){
        return new ConsumptionResponseDto(electricalConsumption.getBuilding().getName(),
                electricalConsumption.getElectricityUsage(), electricalConsumption.getUpdatedAt());
    }
}
