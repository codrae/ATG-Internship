package org.atg.bems.period;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.mssql.repository.TechAllKwhRepository;
import org.atg.bems.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PeriodicFeatureTest {
    private static final String TEST_BUILDING = "TestBuilding";
    private static final int TEST_NORMAL_INTERVAL = 2; // 테스트용 일반 간격: 2초
    private static final int TEST_POLLING_INTERVAL = 1; // 테스트용 폴링 간격: 1초

    @Mock
    private TechAllKwhRepository techAllKwhRepository;

    @Mock
    private InfluxService influxService;

    @Mock
    private WebSocketService webSocketService;

    @Mock
    private ElectricityConsumptionService electricityConsumptionService;

    @Mock
    private ElectricityIntensityService electricityIntensityService;

    @InjectMocks
    private PeriodicService periodicService;

    @InjectMocks
    private DynamicSchedulerService dynamicSchedulerService;

    @BeforeEach
    void setUp() {
        periodicService = new PeriodicService(influxService, techAllKwhRepository, webSocketService, electricityConsumptionService, electricityIntensityService);
        dynamicSchedulerService = new DynamicSchedulerService(periodicService);
        dynamicSchedulerService.setNormalInterval(TEST_NORMAL_INTERVAL);
        dynamicSchedulerService.setPollingInterval(TEST_POLLING_INTERVAL);
        // 테스트용 건물 데이터 초기화
        PeriodicService.getMANAGING_BUILDING().clear();
        PeriodicService.getMANAGING_BUILDING().add(TEST_BUILDING);
        PeriodicService.setBUILDING_LAST_UPDATED_DATE(new HashMap<>());
        PeriodicService.getBUILDING_LAST_UPDATED_DATE().put(TEST_BUILDING, LocalDateTime.now());
        PeriodicService.setLATEST_ELECTRICITY_DATA(new HashMap<>());
        PeriodicService.setBUILDING_POLLING_STATUS(new HashMap<>());
        PeriodicService.getBUILDING_POLLING_STATUS().clear();
    }

    @Test
    @DisplayName("새로 읽어들인 데이터가 없을 경우 해당 건물의 Polling 시작 테스트")
    void whenNoNewData_shouldStartPolling() {
        // Given
        doReturn(Collections.emptyList())
                .when(techAllKwhRepository)
                .findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(
                        eq(TEST_BUILDING),
                        any(LocalDateTime.class)
                );

        // When
        dynamicSchedulerService.createSchedulerForBuilding(TEST_BUILDING);

        // Then
        verify(techAllKwhRepository, timeout(2000).times(1))
                .findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(
                        any(), any(LocalDateTime.class));
        assertTrue(PeriodicService.getBUILDING_POLLING_STATUS().get(TEST_BUILDING));

        // Cleanup
        dynamicSchedulerService.removeSchedulerForBuilding(TEST_BUILDING);
    }

    @Test
    @DisplayName("Polling 중이 아닐 때 새로 읽어들인 데이터가 존재할 경우 10분 단위로 기존과 같이 유지 테스트")
    void whenNewDataReceived_shouldStopPolling() {
        // Given
        ElectricityData before = createTestElectricityData(TEST_BUILDING, 80.0);
        ElectricityData testData = createTestElectricityData(TEST_BUILDING, 100.0);

        when(techAllKwhRepository.findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(
                anyString(), any(LocalDateTime.class)))
                .thenReturn(new ArrayList<>(List.of(testData)));

        PeriodicService.getLATEST_ELECTRICITY_DATA().put(TEST_BUILDING, before);
        PeriodicService.getBUILDING_POLLING_STATUS().put(TEST_BUILDING, false);

        // When
        dynamicSchedulerService.createSchedulerForBuilding(TEST_BUILDING);

        // Then
        verify(techAllKwhRepository, timeout(2000))
                .findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(
                        eq(TEST_BUILDING), any(LocalDateTime.class));
        assertFalse(PeriodicService.BUILDING_POLLING_STATUS.get(TEST_BUILDING));
        verify(influxService, timeout(2000)).createElectricityDataList(anyList());

        // Cleanup
        dynamicSchedulerService.removeSchedulerForBuilding(TEST_BUILDING);
    }

    @Test
    @DisplayName("새로 읽어들인 데이터에 이상치가 존재할 경우 알림 테스트")
    void whenHighEnergyUsage_shouldSendAlert() throws JsonProcessingException {
        // Given
        ElectricityData previousData = createTestElectricityData(TEST_BUILDING, 0.0);
        ElectricityData newData = createTestElectricityData(TEST_BUILDING, 50.0);

        PeriodicService.getLATEST_ELECTRICITY_DATA().put(TEST_BUILDING, previousData);

        when(techAllKwhRepository.findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(
                anyString(), any(LocalDateTime.class)))
                .thenReturn(new ArrayList<>(List.of(newData)));
        PeriodicService.getBUILDING_POLLING_STATUS().put(TEST_BUILDING, false);
        // When
        dynamicSchedulerService.createSchedulerForBuilding(TEST_BUILDING);

        // Then
        verify(webSocketService, timeout(2000)).sendMessageByBuilding(eq(TEST_BUILDING), anyList());

        // Cleanup
        dynamicSchedulerService.removeSchedulerForBuilding(TEST_BUILDING);
    }

    @Test
    @DisplayName("Polling 중에 새로 읽어들인 데이터가 있을 때 해당 건물의 Polling 종료 테스트")
    void schedulingInterval_shouldChangeBasedOnPollingStatus() throws InterruptedException {
        // Given
        when(techAllKwhRepository.findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(
                anyString(), any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList()) // 첫번째 읽기 호출 (폴링 시작용)
                .thenReturn(new ArrayList<>(Arrays.asList(createTestElectricityData(TEST_BUILDING, 100.0)))); // 두번째 읽기 호출 (폴링 종료용)

        ElectricityData previousData = createTestElectricityData(TEST_BUILDING, 0.0);
        PeriodicService.getLATEST_ELECTRICITY_DATA().put(TEST_BUILDING, previousData);
        // When
        dynamicSchedulerService.createSchedulerForBuilding(TEST_BUILDING);

        // Then - First execution
        verify(techAllKwhRepository, timeout(1000))
                .findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc(
                        eq(TEST_BUILDING), any(LocalDateTime.class));
        assertTrue(PeriodicService.BUILDING_POLLING_STATUS.get(TEST_BUILDING));

        // When - Second execution with data
        periodicService.periodicReadDataForBuilding(TEST_BUILDING);

        // Then - Second execution
        assertFalse(PeriodicService.BUILDING_POLLING_STATUS.get(TEST_BUILDING));

        // Cleanup
        dynamicSchedulerService.removeSchedulerForBuilding(TEST_BUILDING);
    }

    @Test
    @DisplayName("건물별 스케줄러 생성 및 제거 테스트")
    void schedulerLifecycleTest() {
        // When - Create scheduler
        dynamicSchedulerService.createSchedulerForBuilding(TEST_BUILDING);

        // Then
        assertTrue(dynamicSchedulerService.getBuildingSchedulers().containsKey(TEST_BUILDING));

        // When - Remove scheduler
        dynamicSchedulerService.removeSchedulerForBuilding(TEST_BUILDING);

        // Then
        assertFalse(dynamicSchedulerService.getBuildingSchedulers().containsKey(TEST_BUILDING));
    }

    private ElectricityData createTestElectricityData(String building, double value) {
        ElectricityData data = new ElectricityData(EnergyType.POWER, new ElectricityData.CompositeId());
        data.setBuilding(building);
        data.setValue(value);
        data.setDateTime(LocalDateTime.now());
        return data;
    }
}