package org.atg.bems.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.service.BuildingService;
import org.atg.bems.service.InfluxService;
import org.atg.bems.utils.CommonUtils;
import org.atg.bems.utils.EnergyTransformer;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

import static org.atg.bems.BemsApplication.managingTargets;
import static org.atg.bems.utils.CommonUtils.fromKoreanToEnglish;
import static org.atg.bems.utils.CommonUtils.fromUrlBuildingNameToEnglish;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class InfluxController {

    private final Logger logger = Logger.getLogger(InfluxController.class.getName());


    private final InfluxService influxService;
    private final BuildingService buildingService;

    // 생성자를 통한 의존성 주입
    public InfluxController(InfluxService influxService, BuildingService buildingService) {
        this.influxService = influxService;
        this.buildingService = buildingService;
    }

    @GetMapping("/enegry-types")
    @Operation(summary = "에너지 종류 조회")
    public List<String> getEnergyTypes() {
        return Arrays.stream(EnergyType.values())
                .map(Enum::name)
                .toList();
    }

    // 특정 시간의 전력 데이터 조회
    @GetMapping("/{energy-type}/get")
    @Operation(summary = "특정 시간의 에너지 데이터 조회")
    public ElectricityData getData(
            @PathVariable(name = "energy-type") EnergyType energyType,
            @RequestParam LocalDateTime time,
            @RequestParam String measurement) {

        logger.info("Fetching electricity data at time: " + time + " for measurement: " + measurement + " and tag: " + energyType.name());
        return influxService.readData(time, measurement, energyType);
    }


    // 특정 기간 동안의 전력 데이터 조회

    @GetMapping("/{energy-type}/getList")
    @Operation(summary = "특정 기간의 에너지 데이터 조회")
    public List<ElectricityData> getDataList(
            @PathVariable(name = "energy-type") EnergyType energyType,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end,
            @RequestParam String measurement) { // TODO : 다른 api들과 같이 에너지 변환 공식 적용 필요
        logger.info("Fetching electricity data between: " + start + " and " + end + " for measurement: " + measurement + " and tag: " + energyType.name());
        return influxService.readDataList(start, end, fromUrlBuildingNameToEnglish(measurement), energyType);
    }

    @GetMapping("/{energy-type}/getList/predict")
    @Operation(summary = "특정 기간의 예측 에너지 데이터 조회")
    public List<ElectricityData> getPredictDataList(
            @PathVariable(name = "energy-type") EnergyType energyType,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end,
            @RequestParam String measurement) { // TODO : 다른 api들과 같이 에너지 변환 공식 적용 필요
        logger.info("Fetching predict electricity data between: " + start + " and " + end + " for measurement: " + measurement + " and tag: " + energyType.name());
        return influxService.readPredictElectricityDataList(start, end, fromUrlBuildingNameToEnglish(measurement), energyType);
    }

    @GetMapping("/{energy-type}/total")
    @Operation(summary = "특정 기간 동안의 에너지 사용량 합계 반환")
    public Double getTotalUsage(
            @PathVariable(name = "energy-type") EnergyType energyType,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end,
            @RequestParam(defaultValue = "false") Boolean isTransform) {

        return isTransform ? EnergyTransformer.kwhToMj(influxService.sumTotalDataByPeriod(start, end, energyType)) : influxService.sumTotalDataByPeriod(start, end, energyType);
    }

    @GetMapping("/{energy-type}/month/today")
    @Operation(summary = "전체 건물 대상 - 금월 현재까지의 에너지 사용량 합계 반환")
    public Double getTotalUsageUntilNowForMonth(@PathVariable(name = "energy-type") EnergyType energyType, @RequestParam(defaultValue = "false") Boolean isTransform) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentMonth = LocalDateTime.of(now.getYear(), now.getMonth(), 1, 0, 0);
        return isTransform ? EnergyTransformer.kwhToMj(influxService.sumTotalDataByPeriod(currentMonth, now, energyType)) : influxService.sumTotalDataByPeriod(currentMonth, now, energyType);
    }

    @GetMapping("/{energy-type}/date/today")
    @Operation(summary = "전체 건물 대상 - 금일 에너지 사용량 합계 반환")
    public Double getTotalUsageUntilNowForDate(@PathVariable(name = "energy-type") EnergyType energyType, @RequestParam(defaultValue = "false") Boolean isTransform){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentMonth = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), 0, 0);
        return isTransform ? EnergyTransformer.kwhToMj(influxService.sumTotalDataByPeriod(currentMonth, now, energyType)) : influxService.sumTotalDataByPeriod(currentMonth, now, energyType);
    }

    @GetMapping("/{building-id}/{energy-type}/month/today")
    @Operation(summary = "특정 건물 대상 - 금월 현재까지의 에너지 사용량 합계 반환")
    public Double getTotalUsageUntilNowForMonth(@PathVariable(name = "building-id") Long buildingId, @PathVariable(name = "energy-type") EnergyType energyType, @RequestParam(defaultValue = "false") Boolean isTransform) {
        Building building = buildingService.readBuildingById(buildingId);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentMonth = LocalDateTime.of(now.getYear(), now.getMonth(), 1, 0, 0);
        return isTransform ? EnergyTransformer.kwhToMj(influxService.sumDataByPeriod(currentMonth, now, fromKoreanToEnglish(building.getName()),energyType)) : influxService.sumDataByPeriod(currentMonth, now, fromKoreanToEnglish(building.getName()),energyType);
    }

    @GetMapping("/{building-id}/{energy-type}/date/today")
    @Operation(summary = "특정 건물 대상 - 금일 에너지 사용량 합계 반환")
    public Double getTotalUsageUntilNowForDate(@PathVariable(name = "building-id") Long buildingId, @PathVariable(name = "energy-type") EnergyType energyType, @RequestParam(defaultValue = "false") Boolean isTransform){
        Building building = buildingService.readBuildingById(buildingId);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentMonth = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), 0, 0);
        return isTransform ? EnergyTransformer.kwhToMj(influxService.sumDataByPeriod(currentMonth, now, fromKoreanToEnglish(building.getName()),energyType)) : influxService.sumDataByPeriod(currentMonth, now, fromKoreanToEnglish(building.getName()),energyType);
    }

    @GetMapping("/max-usage/date/total")
    @Operation(summary = "전체 건물 대상 - 당일 최대 에너지 사용 시점 반환")
    public ElectricityData getMaxUsageFromTotalBuildingInDate(EnergyType energyType) {
        LocalDateTime now = LocalDateTime.now();
        Double max = 0.0;
        ElectricityData data = null;
        for (CommonUtils.BuildingType buildingType : managingTargets) {
            ElectricityData electricityData = influxService.maxDataByPeriod(LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), 0, 0), LocalDateTime.now(), buildingType.name(), energyType).getFirst();
            if (data == null || max < electricityData.getValue()) {
                max = electricityData.getValue();
                data = electricityData;
            } else if (max.equals(electricityData.getValue())) {
                if (electricityData.getDateTime().isAfter(data.getDateTime())) {
                    data = electricityData;
                }
            }
        }
        return data;
    }

    @GetMapping("/max-usage/month/total")
    @Operation(summary = "전체 건물 대상 - 당월 최대 에너지 사용 시점 반환")
    public ElectricityData getMaxUsageFromTotalBuildingInMonth(EnergyType energyType) {
        LocalDateTime now = LocalDateTime.now();
        Double max = 0.0;
        ElectricityData data = null;
        for (CommonUtils.BuildingType buildingType : managingTargets) {
            ElectricityData electricityData = influxService.maxDataByPeriod(LocalDateTime.of(now.getYear(), now.getMonth(), 1, 0, 0), LocalDateTime.now(), buildingType.name(), energyType).getFirst();
            if (data == null || max < electricityData.getValue()) {
                max = electricityData.getValue();
                data = electricityData;
            } else if (max.equals(electricityData.getValue())) {
                if (electricityData.getDateTime().isAfter(data.getDateTime())) {
                    data = electricityData;
                }
            }
        }
        return data;
    }

    @GetMapping("/max-usage/date/{building-id}")
    @Operation(summary = "특정 건물 대상 - 당일 최대 에너지 사용 시점 반환")
    public ElectricityData getMaxUsageFromBuildingInDate(@PathVariable(name = "building-id") Long buildingId, EnergyType energyType) {
        Building building = buildingService.readBuildingById(buildingId);

        LocalDateTime now = LocalDateTime.now();

        return influxService.maxDataByPeriod(
                LocalDateTime.of(
                        now.getYear(),
                        now.getMonth(),
                        now.getDayOfMonth(), 0, 0),
                LocalDateTime.now(),
                fromKoreanToEnglish(building.getName()),
                energyType).getFirst();
    }

    @GetMapping("/max-usage/month/{building-id}")
    @Operation(summary = "특정 건물 대상 - 당월 최대 에너지 사용 시점 반환")
    public ElectricityData getMaxUsageFromBuildingInMonth(@PathVariable(name = "building-id") Long buildingId, EnergyType energyType) {
        Building building = buildingService.readBuildingById(buildingId);

        LocalDateTime now = LocalDateTime.now();

        return influxService.maxDataByPeriod(
                LocalDateTime.of(
                        now.getYear(),
                        now.getMonth(),
                        1, 0, 0),
                LocalDateTime.now(),
                fromKoreanToEnglish(building.getName()),
                energyType).getFirst();
    }

    @GetMapping("/mean-usage/{building-id}")
    @Operation(summary = "특정 건물 대상 - 시간당 평균 에너지 사용량 반환")
    public Double getMeanUsageFromBuildingInHour(@PathVariable(name = "building-id") Long buildingId, EnergyType energyType, @RequestParam(defaultValue = "false") Boolean isTransform) {
        Building building = buildingService.readBuildingById(buildingId);
        LocalDateTime now = LocalDateTime.now();
        Double meanValue = 0.0;
        int count = 0;
        List<ElectricityData> electricityDataList = influxService.readDataList(now.minusHours(1), LocalDateTime.now(), fromKoreanToEnglish(building.getName()), energyType);
        for (ElectricityData electricityData : electricityDataList) {
            meanValue += electricityData.getValue();
            count += electricityDataList.size();
        }
        return isTransform ? EnergyTransformer.kwhToMj(meanValue / count) : meanValue / count;
    }

    @GetMapping("/mean-usage/total")
    @Operation(summary = "전체 건물 대상 - 시간당 평균 에너지 사용량 반환")
    public Double getMeanUsageFromTotalBuildingInHour(EnergyType energyType, @RequestParam(defaultValue = "false") Boolean isTransform) {
        LocalDateTime now = LocalDateTime.now();
        Double meanValue = 0.0;
        int count = 0;
        for (CommonUtils.BuildingType buildingType : managingTargets) {
            List<ElectricityData> electricityDataList = influxService.readDataList(now.minusHours(1), LocalDateTime.now(), buildingType.name(), energyType);
            for (ElectricityData electricityData : electricityDataList) {
                meanValue += electricityData.getValue();
            }
            count += electricityDataList.size();
        }
        return isTransform ? EnergyTransformer.kwhToMj(meanValue / count) : meanValue / count;
    }

    @GetMapping("/compare-usage/total/yesterday")
    @Operation(summary = "전체 건물 대상 - 직전날 동일시간대 값 대비 현재 사용량 변동폭 퍼센트 반환")
    public Double getPercentageAboutUsageGapBetweenYesterday(EnergyType energyType){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentDate = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), 0, 0);
        Double todayValue = influxService.sumTotalDataByPeriod(currentDate, now, energyType);

        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        LocalDateTime yesterdayDate = LocalDateTime.of(yesterday.getYear(), yesterday.getMonth(), yesterday.getDayOfMonth(), 0, 0);
        Double yesterdayValue = influxService.sumTotalDataByPeriod(yesterdayDate, yesterday, energyType);
        return todayValue / yesterdayValue * 100;
    }

    @GetMapping("/compare-usage/{building-id}/yesterday")
    @Operation(summary = "특정 건물 대상 - 직전날 동일시간대 값 대비 현재 사용량 변동폭 퍼센트 반환")
    public Double getPercentageAboutUsageGapBetweenYesterday(@PathVariable(name = "building-id") Long buildingId, EnergyType energyType){
        Building building = buildingService.readBuildingById(buildingId);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentDate = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), 0, 0);
        Double todayValue = influxService.sumDataByPeriod(currentDate, now, fromKoreanToEnglish(building.getName()), energyType);

        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        LocalDateTime yesterdayDate = LocalDateTime.of(yesterday.getYear(), yesterday.getMonth(), yesterday.getDayOfMonth(), 0, 0);
        Double yesterdayValue = influxService.sumDataByPeriod(yesterdayDate, yesterday, fromKoreanToEnglish(building.getName()), energyType);
        return todayValue / yesterdayValue * 100;
    }

}
