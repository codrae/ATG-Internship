package org.atg.bems.service;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.repository.TechAllKwhRepository;
import org.atg.bems.utils.CommonUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@Transactional
public class PeriodicService {
    @Setter
    @Getter
    public static Map<String, LocalDateTime> BUILDING_LAST_UPDATED_DATE = new ConcurrentHashMap<>();

    @Getter
    private static final HashSet<String> MANAGING_BUILDING = new HashSet<>();

    //건물별 폴링 상태를 관리하기 위한 Map 추가
    @Getter @Setter
    public static Map<String, Boolean> BUILDING_POLLING_STATUS = new ConcurrentHashMap<>();

    @Getter
    @Setter
    private static Map<String, ElectricityData> LATEST_ELECTRICITY_DATA = new ConcurrentHashMap<>(); // 마지막 값을 저장할 building-data map

    private final TechAllKwhRepository techAllKwhRepository;
    private final InfluxService influxService;
    private final WebSocketService webSocketService;
    private final ElectricityConsumptionService electricityConsumptionService;
    private final ElectricityIntensityService electricityIntensityService;

    public PeriodicService(InfluxService influxService, TechAllKwhRepository techAllKwhRepository, WebSocketService webSocketService, ElectricityConsumptionService electricityConsumptionService, ElectricityIntensityService electricityIntensityService) {
        this.techAllKwhRepository = techAllKwhRepository;
        this.influxService = influxService;

        this.webSocketService = webSocketService;
        this.electricityConsumptionService = electricityConsumptionService;
        this.electricityIntensityService = electricityIntensityService;
    }

    synchronized public void periodicReadDataForBuilding(String building) {

        List<ElectricityData> list = techAllKwhRepository.findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(
                CommonUtils.toKoreanBuildingName(building), BUILDING_LAST_UPDATED_DATE.get(building));
        if (list.isEmpty()) {

            webSocketService.sendEmptyMessage(building);
            if (!BUILDING_POLLING_STATUS.getOrDefault(building, false)) {
                log.info("{} : 10분 데이터를 받아오지 못함 Polling 시작", building);
                BUILDING_POLLING_STATUS.put(building, true);
                return;
            }
            log.info("{} : Polling 중 이지만 아직 데이터를 받아오지 못함", building);
            return;
        }

        if (!list.isEmpty() && BUILDING_POLLING_STATUS.getOrDefault(building, false)) {
            log.info("{} : 최신 10분 데이터를 받아옴 Polling 종료", building);
            BUILDING_POLLING_STATUS.put(building, false);
        }

        log.info("{} : 최신 10분 데이터를 받아옴", building);

        ElectricityData lastData = LATEST_ELECTRICITY_DATA.get(building);
        if (lastData != null) {
            list.addFirst(lastData);
        }

        LATEST_ELECTRICITY_DATA.put(building, list.getLast()); // 가장 마지막 누적값을 갱신

        List<ElectricityData> diffList = CommonUtils.calculateDiff(list);

        // db에 차분값 저장
        influxService.createElectricityDataList(diffList);

        LocalDateTime localDateTime = BUILDING_LAST_UPDATED_DATE.get(building);
        if (localDateTime == null) {
            log.info("{} : 해당 건물에 대한 최신 업데이트 내역이 없습니다", building);
        }
        //YYYY-MM이 달라졌다는 것은 시간이 다음 달로 넘어갔다는 의미이기 때문에 전월의 전력 소비량을 계산한다.
        if (!YearMonth.from(localDateTime).equals(YearMonth.now())) {
            log.info("{} : 다음 달이 됐기 때문에 지난 달의 월간 전력 사용량과 원단위 소비량을 집계 및 저장", building);
            electricityConsumptionService.createElectricalConsumption(building, localDateTime.getYear(), localDateTime.getMonthValue());
            electricityIntensityService.createElectricityEnergyIntensity(building, localDateTime.getYear(), localDateTime.getMonthValue());
        }

        log.info("{} 데이터 전송 시도", building);
        try {
            webSocketService.sendMessageByBuilding(building, diffList);
            log.info("{} 데이터 전송 완료", building);
        } catch (Exception e) {
            log.error("{} 데이터 전송 과정에서 문제 발생", building, e);
        }

        BUILDING_LAST_UPDATED_DATE.put(building, LocalDateTime.now());
    }

}