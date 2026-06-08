package org.atg.bems.postgresql.repository;

import org.atg.bems.postgresql.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    Optional<Building> findByName(String buildingName);
//    TODO : 업데이트 기능은 사용될지 안될지 미정
//    @Modifying
//    Optional<Building> updateBuildingById(Building building);
}
