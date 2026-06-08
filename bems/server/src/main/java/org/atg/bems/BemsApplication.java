package org.atg.bems;

import jakarta.transaction.Transactional;
import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.mssql.repository.TechAllKwhRepository;
import org.atg.bems.service.*;
import org.atg.bems.utils.CommonUtils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing
@EnableCaching
public class BemsApplication implements CommandLineRunner {
    private final DynamicSchedulerService dynamicSchedulerService;
    private final InfluxService service;
    private final TechAllKwhRepository repository;
    private final ElectricityConsumptionService electricityConsumptionService;
    private final ElectricityIntensityService electricityIntensityService;
    public final static Set<CommonUtils.BuildingType> managingTargets  = new HashSet<>();
    public BemsApplication(TechAllKwhRepository repository, DynamicSchedulerService dynamicSchedulerService, InfluxService service, ElectricityConsumptionService electricityConsumptionService, ElectricityIntensityService electricityIntensityService) {

        this.repository = repository;
        this.dynamicSchedulerService = dynamicSchedulerService;
        this.service = service;
        this.electricityConsumptionService = electricityConsumptionService;
        this.electricityIntensityService = electricityIntensityService;
    }

    static {
        managingTargets.add(CommonUtils.BuildingType.LAW_SCHOOL_BUILDING);
        managingTargets.add(CommonUtils.BuildingType.HIGH_TECH_CENTER);
        managingTargets.add(CommonUtils.BuildingType.BUILDING_1);
        managingTargets.add(CommonUtils.BuildingType.ANNIVERSARY_MEMORIAL_HALL);
        managingTargets.add(CommonUtils.BuildingType.INHA_DREAM_CENTER_2_3);
    }

    public static void main(String[] args) {
        SpringApplication.run(BemsApplication.class, args);
    }

    /*
     * 서버가 처음 시작될 때, context가 전부 준비된 후 최초로 단 한번 실행되는 메서드
     * Microsoft SQL Server에 존재하는 모든 데이터를 내려 받은 뒤 InfluxDB에 넣어준다.
     * */
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        //TODO : 해당 코드는 실행되면 10000개 이상의 데이터가 들어와 클라우드가 터짐. 실행 시킬 경우 반드시 로컬에서 돌릴것
        HashMap<String, List<ElectricityData>> map = new HashMap<>();
        HashSet<YearMonth> yearMonthMap = new HashSet<>();
        List<ElectricityData> result = repository.findAll();
        result.stream().filter(
                elec -> managingTargets.contains(CommonUtils.BuildingType.valueOf(CommonUtils.fromKoreanToEnglish(elec.getBuilding())))
        ).forEach(
                elec -> {
                    //TODO : 추후에는 에너지 종류가 늘어날 것이기 때문에 반드시 수정해줘야함.
                    elec.setEnergyType(EnergyType.POWER);
                    elec.setBuilding(CommonUtils.toEnglishBuildingName(elec));
                    if(!map.containsKey(elec.getBuilding())){
                        map.put(elec.getBuilding(), new ArrayList<>());
                        PeriodicService.getMANAGING_BUILDING().add(elec.getBuilding());
                    }
                    map.get(elec.getBuilding()).add(elec);
                    yearMonthMap.add(YearMonth.from(elec.getDateTime()));
                }
        );

        for(Map.Entry<String, List<ElectricityData>> entry : map.entrySet()) {
            List<ElectricityData> list = entry.getValue();
            list.sort(Comparator.comparing(ElectricityData::getDateTime));

            // 마지막 값 저장
            ElectricityData lastElec = list.getLast();
            lastElec.setEnergyType(EnergyType.POWER);
            PeriodicService.getLATEST_ELECTRICITY_DATA().put(lastElec.getBuilding(), lastElec);

            list = CommonUtils.calculateDiff(list);
            service.createElectricityDataList(list);
        }

        for(String building : map.keySet()){
            for(YearMonth yearMonth : yearMonthMap) {
                if(YearMonth.now().equals(yearMonth)) continue;
                electricityConsumptionService.createElectricalConsumption(building, yearMonth.getYear(), yearMonth.getMonthValue());
                electricityIntensityService.createElectricityEnergyIntensity(building, yearMonth.getYear(), yearMonth.getMonthValue());
            }
            PeriodicService.getBUILDING_LAST_UPDATED_DATE().put(building, LocalDateTime.now());
        }
    }
    // TODO : Request
}