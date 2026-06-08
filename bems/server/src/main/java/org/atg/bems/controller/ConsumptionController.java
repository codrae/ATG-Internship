package org.atg.bems.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.atg.bems.dto.ConsumptionResponseDto;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.postgresql.entity.ElectricalConsumption;
import org.atg.bems.service.ElectricityConsumptionService;
import org.atg.bems.service.InfluxService;
import org.atg.bems.utils.CommonUtils;
import org.atg.bems.utils.EnergyTransformer;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.atg.bems.BemsApplication.managingTargets;
import static org.atg.bems.service.PeriodicService.BUILDING_LAST_UPDATED_DATE;
import static org.atg.bems.utils.CommonUtils.fromKoreanToEnglish;

@RestController
@RequestMapping("/consumption")
@CrossOrigin(origins = "http://localhost:3000")
public class ConsumptionController {
    private final ElectricityConsumptionService electricityConsumptionService;
    private final InfluxService influxService;

    public ConsumptionController(ElectricityConsumptionService electricityConsumptionService, InfluxService influxService) {
        this.electricityConsumptionService = electricityConsumptionService;
        this.influxService = influxService;
    }

    @GetMapping(value = "/{energy-type}")
    @Operation(summary = "월 단위 에너지 소비량 조회")
    public Double getConsumptionAtMonth(@PathVariable(name = "energy-type") EnergyType energyType, @RequestParam(name = "year") Integer year, @RequestParam(name = "month") Integer month, @RequestParam(defaultValue = "false") Boolean isTransform) {
        if (energyType.equals(EnergyType.POWER)) {
            LocalDateTime now = LocalDateTime.now();
            if (now.getYear() == year && now.getMonth().getValue() == month) {
                LocalDateTime currentMonth = LocalDateTime.of(now.getYear(), now.getMonth(), 1, 0, 0);
                return influxService.sumTotalDataByPeriod(currentMonth, now, energyType);
            }
            return isTransform ? EnergyTransformer.kwhToMj(electricityConsumptionService.readElectricityUsageByYearAndMonth(year, month)) : electricityConsumptionService.readElectricityUsageByYearAndMonth(year, month);
        }
        return null;
    }

    @GetMapping(value = "/{energy-type}/all")
    @Operation(summary = "모든 월 단위 에너지 소비량 조회")
    public List<ConsumptionResponseDto> getElectricityConsumption(@PathVariable(name = "energy-type") EnergyType energyType, @RequestParam(defaultValue = "false") Boolean isTransform) {
        return electricityConsumptionService.readAll().stream().map(
                entity -> {
                    if (isTransform) {
                        return new ConsumptionResponseDto(entity.getBuilding().getName(), EnergyTransformer.kwhToMj(entity.getElectricityUsage()), entity.getUpdatedAt());
                    } else {
                        return ConsumptionResponseDto.toDto(entity);
                    }
                }).toList();
    }

    @GetMapping(value = "/{energy-type}/all/separate")
    @Operation(summary = "모든 월 단위 에너지 소비량을 건물별로 분리시켜서 반환")
    public List<ConsumptionResponseDto> getElectricityConsumptionSeparate(@PathVariable(name = "energy-type") EnergyType energyType, @RequestParam(name = "year") Integer year, @RequestParam(name = "month") Integer month, @RequestParam(defaultValue = "false") Boolean isTransform) {
        List<ConsumptionResponseDto> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        if(now.getYear() == year && now.getMonth().getValue() == month){
            LocalDateTime currentMonth = LocalDateTime.of(now.getYear(), now.getMonth(), 1, 0, 0);
            for(CommonUtils.BuildingType buildingType : managingTargets) {
                double value = isTransform ? EnergyTransformer.kwhToMj(influxService.sumDataByPeriod(currentMonth, now, buildingType.name(), energyType)) : influxService.sumDataByPeriod(currentMonth, now, buildingType.name(), energyType);
                if(isTransform) {
                    value = EnergyTransformer.kwhToMj(value);
                }

                result.add(new ConsumptionResponseDto(buildingType.getKoreanName(), value, now));
            }

        }else {

            for (CommonUtils.BuildingType buildingType : managingTargets) {
                ElectricalConsumption electricalConsumption = electricityConsumptionService.readElectricityConsumptionByDetails(buildingType.name(), year, month);
                LocalDateTime updatedTime = BUILDING_LAST_UPDATED_DATE.get(buildingType.getKoreanName());
                if (Objects.isNull(updatedTime)) updatedTime = LocalDateTime.now();

                ConsumptionResponseDto responseDto;
                if (isTransform) {
                    responseDto = new ConsumptionResponseDto(buildingType.getKoreanName(), EnergyTransformer.kwhToMj(electricalConsumption.getElectricityUsage()), updatedTime);
                } else {
                    responseDto = new ConsumptionResponseDto(buildingType.getKoreanName(), electricalConsumption.getElectricityUsage(), updatedTime);
                }
                result.add(responseDto);
            }
        }
        return result;
    }

    @GetMapping(value = "/{energy-type}/{electricityConsumptionId}")
    @Operation(summary = "id로 특정 월 단위 에너지 소비량 조회")
    public ConsumptionResponseDto getBuilding(@PathVariable(name = "energy-type") EnergyType energyType, @PathVariable(name = "electricityConsumptionId") Long electricityConsumptionId, @RequestParam(defaultValue = "false") Boolean isTransform) {
        ElectricalConsumption electricalConsumption = electricityConsumptionService.readElectricityConsumptionById(electricityConsumptionId);
        if(isTransform){
            return new ConsumptionResponseDto(electricalConsumption.getBuilding().getName(), EnergyTransformer.kwhToMj(electricalConsumption.getElectricityUsage()), electricalConsumption.getUpdatedAt());
        }else{
            return ConsumptionResponseDto.toDto(electricalConsumption);
        }
    }
    // TODO : 현재는 읽어오는 것 밖에 생각이 나지 않지만 추가적인 요구사항이 있을 때 마다 추가할 예정
}
