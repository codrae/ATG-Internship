package org.atg.bems.postgresql.repository;

import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.postgresql.entity.ElectricityEnergyIntensity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface ElectricityEnergyIntensityRepository extends JpaRepository<ElectricityEnergyIntensity, Long> {
    ElectricityEnergyIntensity findByBuildingAndYearAndMonth(Building building, Integer year, Integer month);
//    TODO : update 기능은 사용될지 안될지 미정
//    @Modifying
//    ElectricityEnergyIntensity updateById(ElectricityEnergyIntensity electricityEnergyIntensity);
}
