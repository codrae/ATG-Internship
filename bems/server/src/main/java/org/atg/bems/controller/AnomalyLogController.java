package org.atg.bems.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.atg.bems.postgresql.entity.AnomalyLog;
import org.atg.bems.service.AnomalyLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/anomaly")
@CrossOrigin(origins = "http://localhost:3000")
public class AnomalyLogController {
    private final AnomalyLogService anomalyLogService;
    public AnomalyLogController(AnomalyLogService anomalyLogService) {
        this.anomalyLogService = anomalyLogService;
    }

    @GetMapping(value = "/total")
    @Operation(summary = "N개의 비정상 로그 가져오기")
    public List<AnomalyLog> getAnomalyLogTotal(@RequestParam(name = "count") int count){
        return anomalyLogService.readTopN(count);
    }

    @GetMapping(value = "/total/all")
    @Operation(summary = "모든 비정상 로그 가져오기")
    public List<AnomalyLog> getAnomalyLogTotal(){
        return anomalyLogService.readAll();
    }

    @GetMapping(value = "/total/{building-id}")
    @Operation(summary = "각 건물별 N개의 비정상 로그 가져오기")
    public List<AnomalyLog> getAnomalyLogTopN(@PathVariable(name = "building-id") Long buildingId, @RequestParam(name = "count") int count){
        return anomalyLogService.readTopNByBuilding(buildingId, count);
    }

    @GetMapping(value = "/{building-id}/all")
    @Operation(summary = "각 건물별 모든 비정상 로그 가져오기")
    public List<AnomalyLog> getAnomalyLogList(@PathVariable(name = "building-id") Long buildingId){
        return anomalyLogService.readAllByBuilding(buildingId);
    }

    @GetMapping(value = "/{anomaly-log-id}")
    @Operation(summary = "id를 통한 특정 비정상 로그 조회")
    public AnomalyLog getAnomalyLog(@PathVariable(name = "anomaly-log-id") Long id){
        Optional<AnomalyLog> anomalyLog = anomalyLogService.readAnomalyLogById(id);
        return anomalyLog.orElse(null);
    }

}
