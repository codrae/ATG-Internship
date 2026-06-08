package org.atg.bems.service;

import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.postgresql.repository.BuildingRepository;
import org.atg.bems.utils.CommonUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 건물 등록과 관련된 비즈니스 로직을 처리하기 위한 서비스 클래스
 */
@Service
@Transactional
public class BuildingService {
    private final BuildingRepository buildingRepository;

    public BuildingService(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    public Building createBuilding(String buildingName, Building.BuildingType buildingType, String address, LocalDate completionDate, Long totalArea){
        return buildingRepository.save(
                Building.builder()
                        .name(buildingName)
                        .buildingType(buildingType)
                        .address(address)
                        .completionDate(completionDate)
                        .totalArea(totalArea)
                        .build()
        );
    }

    public Building readBuildingById(Long id){
        return buildingRepository.findById(id).get();
    }

    public List<Building> readAll(){
        return buildingRepository.findAll();
    }

    public Building readBuildingByName(String buildingName){

        // TODO: INSERT도 한국어->영어로 변경해야함
        Optional<Building> result = buildingRepository.findByName(CommonUtils.toKoreanBuildingName(buildingName));
        return result.orElseGet(() -> new Building(-1L, "찾을 수 없음", null, null, null, null, null, null, null));
    }

//    public Building updateBuilding(Long id, Building building){
//        return buildingRepository.updateBuildingById(building).orElseGet(() -> new Building(-1L, "찾을 수 없음", null, null, null, null, null, null));
//    }

    public void deleteBuilding(Long id){
        buildingRepository.deleteById(id);
    }
}
