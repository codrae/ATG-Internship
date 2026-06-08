package org.atg.bems.service;

import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.postgresql.entity.ElectricalConsumption;
import org.atg.bems.postgresql.entity.ElectricityEnergyIntensity;
import org.atg.bems.postgresql.repository.ElectricalConsumptionRepository;
import org.atg.bems.postgresql.repository.ElectricityEnergyIntensityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ElectricityIntensityService {

    private final ElectricityEnergyIntensityRepository electricityEnergyIntensityRepository;
    private final ElectricalConsumptionRepository electricalConsumptionRepository;
    private final BuildingService buildingService;

    public ElectricityIntensityService(ElectricityEnergyIntensityRepository electricityEnergyIntensityRepository, ElectricalConsumptionRepository electricalConsumptionRepository, BuildingService buildingService) {
        this.electricityEnergyIntensityRepository = electricityEnergyIntensityRepository;
        this.electricalConsumptionRepository = electricalConsumptionRepository;
        this.buildingService = buildingService;
    }

    public ElectricityEnergyIntensity createElectricityEnergyIntensity(String buildingName, Integer year, Integer month){
        Building building = buildingService.readBuildingByName(buildingName);
        ElectricalConsumption electricalConsumption = electricalConsumptionRepository.findByBuildingAndYearAndMonth(building, year, month);

        Double result = electricalConsumption.getElectricityUsage() / building.getTotalArea();

        ElectricityEnergyIntensity electricityEnergyIntensity = ElectricityEnergyIntensity.builder()
                .building(building)
                .year(year)
                .month(month)
                .energyIntensityMonthly(result)
                .build();
        return electricityEnergyIntensityRepository.save(electricityEnergyIntensity);
    }

    public ElectricityEnergyIntensity readElectricityEnergyIntensity(String buildingName, Integer year, Integer month){
        Building building = buildingService.readBuildingByName(buildingName);
        return electricityEnergyIntensityRepository.findByBuildingAndYearAndMonth(building, year, month);
    }

//    public ElectricityEnergyIntensity updateElectricityEnergyIntensity(ElectricityEnergyIntensity electricityEnergyIntensity){
//        return electricityEnergyIntensityRepository.updateById(electricityEnergyIntensity);
//    }

    public void deleteElectricityEnergyIntensity(Long id){
        electricityEnergyIntensityRepository.deleteById(id);
    }

    public List<ElectricityEnergyIntensity> readAll() {
        return electricityEnergyIntensityRepository.findAll();
    }

    public ElectricityEnergyIntensity readElectricityConsumptionById(Long energyIntensityId) {
        return electricityEnergyIntensityRepository.findById(energyIntensityId).get();
    }
}
