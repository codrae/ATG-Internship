package org.atg.bems.service;

import jakarta.annotation.PreDestroy;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 각 건물마다 스레드를 할당하여 데이터를 주기적으로 읽어오기 위한 polling 비즈니스 로직이 구현된 서비스 클래스
 */

@Service
@Slf4j
public class DynamicSchedulerService {
    //각 건물별로 병렬 스레드로 동작하게 구현
    @Getter
    public final Map<String, BuildingScheduler> buildingSchedulers = new ConcurrentHashMap<>();
    private final PeriodicService periodicService;
    @Getter
    public static AtomicBoolean isStarted = new AtomicBoolean(false);

    //테스트를 위한 시간 설정
    @Getter @Setter
    private int normalInterval = 600; // 기본 10분
    @Getter @Setter
    private int pollingInterval = 10; // 폴링시 10초

    public DynamicSchedulerService(PeriodicService periodicService) {
        this.periodicService = periodicService;
    }



    public void initializeSchedulers(){
        isStarted.set(true);
        for(String building : PeriodicService.getMANAGING_BUILDING()){
            createSchedulerForBuilding(building);
        }
    }

    public void createSchedulerForBuilding(String building) {
        if (!buildingSchedulers.containsKey(building)) {
            BuildingScheduler scheduler = new BuildingScheduler(building, periodicService, this);
            buildingSchedulers.put(building, scheduler);
            scheduler.startSchedulingTask();
            log.info("새롭게 스케줄링 대상이된 건물: {}", building);
        }
    }

    public void removeSchedulerForBuilding(String building) {
        BuildingScheduler scheduler = buildingSchedulers.remove(building);
        if (scheduler != null) {
            scheduler.shutdown();
            log.info("Removed scheduler for building: {}", building);
        }
    }

    @PreDestroy
    public void shutdown() {
        buildingSchedulers.values().forEach(BuildingScheduler::shutdown);
        buildingSchedulers.clear();
        log.info("All building schedulers have been shut down");
    }


    @Getter
    private static class BuildingScheduler{
        private final String building;
        private final PeriodicService periodicService;
        private final ScheduledExecutorService scheduler;
        private final DynamicSchedulerService parentService;
        private ScheduledFuture<?> currentTask;
        private int currentInterval = 600;

        private BuildingScheduler(String building, PeriodicService periodicService, DynamicSchedulerService parentService) {
            this.building = building;
            this.periodicService = periodicService;
            this.parentService = parentService;

            this.scheduler = Executors.newSingleThreadScheduledExecutor(runnable -> {
                Thread thread = new Thread(runnable);
                thread.setName("BuildingScheduler-" + building);
                return thread;
            });
        }

        public synchronized void startSchedulingTask() {
            log.debug("현재 {} 초 주기로 동작 중", currentInterval);
            periodicService.periodicReadDataForBuilding(building);

            if (checkCondition()) {
                currentInterval = parentService.getPollingInterval(); // 폴링 조건에 맞으면 10초
            } else {
                currentInterval = parentService.getNormalInterval(); // 폴링 조건에 안 맞으면 10분 (600초)
            }


            rescheduleTask();
        }

        private void rescheduleTask() {
            scheduler.schedule(this::startSchedulingTask, currentInterval, TimeUnit.SECONDS);
        }
        private boolean checkCondition() {
            // Polling 여부를 판별
            return PeriodicService.getBUILDING_POLLING_STATUS().get(building);
        }

        // 자원 할당 해제
        public void shutdown() {
            if (currentTask != null) {
                currentTask.cancel(false);
            }
            scheduler.shutdown();
            try {
                if (!scheduler.awaitTermination(60, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
}
