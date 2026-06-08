package org.atg.bems.mssql.repository;

import org.atg.bems.mssql.entity.ElectricityData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TechAllKwhRepository extends JpaRepository<ElectricityData, ElectricityData.CompositeId> {
    List<ElectricityData> findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(String compositeId_building, LocalDateTime compositeId_dateTime);
}
