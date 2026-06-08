package org.atg.bems.postgresql.repository;

import org.atg.bems.postgresql.entity.AnomalyLog;
import org.atg.bems.postgresql.entity.Building;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnomalyLogRepository extends JpaRepository<AnomalyLog, Long> {
    List<AnomalyLog> findByBuilding(Building building);

    List<AnomalyLog> findByOrderByCreatedAtDesc(Pageable pageable);
    List<AnomalyLog> findByBuildingOrderByCreatedAtDesc(Building building, Pageable pageable);
}
