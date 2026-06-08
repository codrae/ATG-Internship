package org.atg.bems.service;

import org.atg.bems.postgresql.entity.AnomalyLog;
import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.postgresql.repository.AnomalyLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static org.atg.bems.utils.CommonUtils.fromUrlBuildingNameToEnglish;
import static org.atg.bems.utils.CommonUtils.fromUrlBuildingNameToKorean;

/**
 * 이상치 관련 비즈니스 로직을 처리하는 서비스 클래스
 */

@Service
public class AnomalyLogService {
    private final AnomalyLogRepository anomalyLogRepository;
    private final BuildingService buildingService;

    public AnomalyLogService(AnomalyLogRepository anomalyLogRepository, BuildingService buildingService) {
        this.anomalyLogRepository = anomalyLogRepository;
        this.buildingService = buildingService;
    }

    public List<AnomalyLog> saveAnomalyLogList(List<AnomalyLog> anomalyLogList){
        return anomalyLogRepository.saveAll(anomalyLogList);
    }

    public List<AnomalyLog> readAllByBuilding(Long buildingId){
        Building building = buildingService.readBuildingById(buildingId);
        return anomalyLogRepository.findByBuilding(building);
    }

    public Optional<AnomalyLog> readAnomalyLogById(Long id){
        return anomalyLogRepository.findById(id);
    }

    public List<AnomalyLog> readTopN(int count){
        PageRequest pageRequest = PageRequest.of(0, count);
        return anomalyLogRepository.findByOrderByCreatedAtDesc(pageRequest);
    }

    public List<AnomalyLog> readTopNByBuilding(Long buildingId, int count){
        Building building = buildingService.readBuildingById(buildingId);
        PageRequest pageRequest = PageRequest.of(0, count);
        return anomalyLogRepository.findByBuildingOrderByCreatedAtDesc(building, pageRequest);
    }

    public List<AnomalyLog> readAll(){
        return anomalyLogRepository.findAll();
    }
}
