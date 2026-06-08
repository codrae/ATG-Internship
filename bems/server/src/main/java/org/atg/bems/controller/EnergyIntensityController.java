package org.atg.bems.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.atg.bems.postgresql.entity.ElectricityEnergyIntensity;
import org.atg.bems.service.ElectricityIntensityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/energy-intensity")
@CrossOrigin(origins = "http://localhost:3000")
public class EnergyIntensityController {
    private final ElectricityIntensityService electricityIntensityService;

    public EnergyIntensityController(ElectricityIntensityService electricityIntensityService) {
        this.electricityIntensityService = electricityIntensityService;
    }

    @GetMapping(value = "/electricity/{energyIntensityId}")
    @Operation(summary = "id를 활용한 원단위 사용량 조회")
    public ElectricityEnergyIntensity getElectricityConsumptionById(@PathVariable(name = "energyIntensityId") Long energyIntensityId){
        return electricityIntensityService.readElectricityConsumptionById(energyIntensityId);
    }

    @GetMapping(value = "/electricity/all")
    @Operation(summary = "모든 원단위 사용량 조회")
    public List<ElectricityEnergyIntensity> getElectricityConsumption(){
        return electricityIntensityService.readAll();
    }

    // TODO : 현재는 읽어오는 것 밖에 생각이 나지 않지만 추가적인 요구사항이 있을 때 마다 추가할 예정
}
