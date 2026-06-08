package org.atg.bems.postgresql.repository;

import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.postgresql.entity.ElectricalConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ElectricalConsumptionRepository extends JpaRepository<ElectricalConsumption, Long> {
    ElectricalConsumption findByBuildingAndYearAndMonth(Building building, Integer year, Integer month);
//    TODO : update 기능은 사용될지 안될지 미정
//    @Modifying
//    ElectricalConsumption updateById(ElectricalConsumption electricalConsumption);

    @Query("SELECT SUM(e.electricityUsage) FROM ElectricalConsumption e WHERE e.year = :year AND e.month = :month AND e.electricityUsage > 0")
    Double sumElectricityUsageByYearAndMonth(@Param("year") Integer year, @Param("month") Integer month);
}
