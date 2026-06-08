package org.atg.bems.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.service.DynamicSchedulerService;
import org.atg.bems.service.InfluxService;
import org.atg.bems.service.LstmService;
import org.atg.bems.service.WebSocketService;
import org.atg.bems.utils.CommonUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.atg.bems.service.LstmService.isRetraining;
import static org.atg.bems.utils.CommonUtils.fromUrlBuildingNameToEnglish;

@RestController
@RequestMapping("/lstm")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class LstmController {
    private final LstmService lstmService;
    private final InfluxService influxService;
    private final DynamicSchedulerService dynamicSchedulerService;
    private final WebSocketService webSocketService;
    public LstmController(LstmService lstmService, InfluxService influxService, DynamicSchedulerService dynamicSchedulerService, WebSocketService webSocketService) {
        this.lstmService = lstmService;
        this.influxService = influxService;
        this.dynamicSchedulerService = dynamicSchedulerService;
        this.webSocketService = webSocketService;
    }

    @GetMapping("/{building}/{energy-type}")
    @Operation(summary = "재학습 요청 경로")
    public ResponseEntity<List<ElectricityData>> triggerEvent(@PathVariable(name = "building") String building, @PathVariable(name = "energy-type") String energyType) {

        if(isRetraining.get()) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .build();
        }else {
            lstmService.sendEvent(building, energyType);
            List<ElectricityData> electricityData = influxService.readPredictElectricityData(LocalDateTime.now().minusHours(9), LocalDateTime.now().plusHours(5), CommonUtils.BuildingType.valueOf(fromUrlBuildingNameToEnglish(building)), EnergyType.valueOf(energyType));

            return ResponseEntity.ok(electricityData);
        }
    }

    @GetMapping("/learning-status")
    @Operation(summary = "FastAPI 서버의 상태를 조회")
    public ResponseEntity<Boolean> getLearningStatus(){
        return ResponseEntity.ok(isRetraining.get());
    }

    @GetMapping("/complete/{building_id}/{energy_type}")
    @Operation(summary = "Fast API 서버가 학습을 완료했을 때 신호를 보낼 url")
    public ResponseEntity<List<ElectricityData>> successPredict(@PathVariable(name = "building_id") String building, @PathVariable(name = "energy_type") String energyType) throws JsonProcessingException {
        List<ElectricityData> electricityData = influxService.readPredictElectricityData(LocalDateTime.now().minusHours(9), LocalDateTime.now().plusHours(5), CommonUtils.BuildingType.valueOf(fromUrlBuildingNameToEnglish(building)), EnergyType.valueOf(energyType));
        log.info("총 {}개의 예측 값을 influxDB로부터 읽어왔습니다.", electricityData.size());

        if (!DynamicSchedulerService.isStarted.get()) {
            dynamicSchedulerService.initializeSchedulers();
            log.info("FAST API 서버 학습 완료, polling 시작");
        }
        webSocketService.sendPredictMessageByBuilding(building, electricityData);
        return ResponseEntity.ok(electricityData);
    }
}
