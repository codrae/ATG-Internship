package org.atg.bems.service;

import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.postgresql.entity.ElectricalConsumption;
import org.atg.bems.postgresql.repository.ElectricalConsumptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

/**
 * 월별 에너지 사용량 집계와 관련된 비즈니스 로직이 구현된 서비스 클래스
 */

@Service
@Transactional
public class ElectricityConsumptionService {
    private final ElectricalConsumptionRepository electricalConsumptionRepository;
    private final InfluxService influxService;
    private final BuildingService buildingService;

    public ElectricityConsumptionService(ElectricalConsumptionRepository electricalConsumptionRepository, InfluxService influxService, BuildingService buildingService) {
        this.electricalConsumptionRepository = electricalConsumptionRepository;
        this.influxService = influxService;
        this.buildingService = buildingService;
    }

    public List<ElectricalConsumption> readAll(){
        return electricalConsumptionRepository.findAll();
    }

    public ElectricalConsumption readElectricityConsumptionByBuildingIdAndYearMonth(Long buildingId, Integer year, Integer month){
        Building building = buildingService.readBuildingById(buildingId);
        return electricalConsumptionRepository.findByBuildingAndYearAndMonth(building, year, month);
    }

    public ElectricalConsumption readElectricityConsumptionById(Long id){
        // TODO : 이미 삭제된 것에 대한 예외 처리 필요
        return electricalConsumptionRepository.findById(id).get();
    }

    public ElectricalConsumption createElectricalConsumption(String buildingName, Integer year, Integer month) {
        double sum = influxService.sumDataByPeriod(LocalDateTime.of(year, month, 1, 0, 0), LocalDateTime.of(year, month, YearMonth.of(year, month).lengthOfMonth(), 23, 59), buildingName, EnergyType.POWER);
        Building building = buildingService.readBuildingByName(buildingName);

        ElectricalConsumption electricalConsumption = ElectricalConsumption.builder()
                .building(building)
                .year(year)
                .month(month)
                .electricityUsage(sum)
                .peekDemand(influxService.maxValueByPeriod(LocalDateTime.of(year, month, 1, 0, 0), LocalDateTime.of(year, month, YearMonth.of(year, month).lengthOfMonth(), 23, 59), buildingName, EnergyType.POWER))
                .build();
        return electricalConsumptionRepository.save(electricalConsumption);
    }

    public ElectricalConsumption readElectricityConsumptionByDetails(String buildingName, Integer year, Integer month){
        Building building = buildingService.readBuildingByName(buildingName);
        return electricalConsumptionRepository.findByBuildingAndYearAndMonth(building, year, month);
    }

    public Double readElectricityUsageByYearAndMonth(Integer year, Integer month){
        return electricalConsumptionRepository.sumElectricityUsageByYearAndMonth(year, month);
    }

//    public ElectricalConsumption updateElectricityConsumption(ElectricalConsumption electricalConsumption){
//        return electricalConsumptionRepository.updateById(electricalConsumption);
//    }

    public void deleteElectricityConsumption(Long id){
        electricalConsumptionRepository.deleteById(id);
    }
}
