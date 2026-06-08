package org.atg.bems.service;

import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.postgresql.entity.SeasonType;
import org.atg.bems.postgresql.repository.UsageRateRepository;
import org.atg.bems.utils.CommonUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

import static org.atg.bems.BemsApplication.managingTargets;

@Service
public class ChargeService {
    private static final int BASE_CHARGE = 6980 * 6090;

    private final ElectricityConsumptionService electricityConsumptionService;
    private final InfluxService influxService;
    private final UsageRateRepository usageRateRepository;

    // 적용 금액에 따른 시간대 구분 enum
    private enum TimeSlot {
        LIGHT_LOAD(0, 8), // 00:00-07:59
        MEDIUM_LOAD_1(8, 9), // 08:00-08:59
        MAXIMUM_LOAD_1(9, 12), // 09:00-11:59
        MEDIUM_LOAD_2(12, 16), // 12:00-15:59
        MAXIMUM_LOAD_2(16, 19), // 16:00-18:59
        MEDIUM_LOAD_3(19, 22), // 19:00-21:59
        LIGHT_LOAD_2(22, 24); // 22:00-23:59

        final int startHour;
        final int endHour;

        TimeSlot(int startHour, int endHour) {
            this.startHour = startHour;
            this.endHour = endHour;
        }
    }

    public ChargeService(ElectricityConsumptionService electricityConsumptionService,
                         InfluxService influxService,
                         UsageRateRepository usageRateRepository) {
        this.electricityConsumptionService = electricityConsumptionService;
        this.influxService = influxService;
        this.usageRateRepository = usageRateRepository;
    }

    public Double calculateChargePerMonth(String building, int year, int month, int day) {
        day = (day == 0) ? YearMonth.of(year, month).lengthOfMonth() : day;

        double lightLoad = calculateLoadForPeriod(building, year, month, day, TimeSlot.LIGHT_LOAD, TimeSlot.LIGHT_LOAD_2);
        double mediumLoad = calculateLoadForPeriod(building, year, month, day, TimeSlot.MEDIUM_LOAD_1, TimeSlot.MEDIUM_LOAD_2, TimeSlot.MEDIUM_LOAD_3);
        double maximumLoad = calculateLoadForPeriod(building, year, month, day, TimeSlot.MAXIMUM_LOAD_1, TimeSlot.MAXIMUM_LOAD_2);

        return calculateTotalCharge(lightLoad, mediumLoad, maximumLoad);
    }

    private double calculateLoadForPeriod(String building, int year, int month, int day, TimeSlot... slots) {
        double totalLoad = 0;
        for (int date = 1; date <= day; date++) {
            for (TimeSlot slot : slots) {
                Double value = influxService.sumDataByPeriod(
                        LocalDateTime.of(year, month, date, slot.startHour, 0),
                        LocalDateTime.of(year, month, date, slot.endHour - 1, 59),
                        building,
                        EnergyType.POWER
                );
                if (Objects.nonNull(value)) {
                    totalLoad += value;
                }
            }
        }
        return totalLoad;
    }

    public Double calculateTotalCharge(int year, int month, int day) {
        return Arrays.stream(CommonUtils.BuildingType.values())
                .mapToDouble(building -> calculateChargePerMonth(building.description, year, month, day))
                .sum();
    }

    public Double calculateChargePerDate(LocalDateTime dateTime, String building) {
        LoadCalculator calculator = new LoadCalculator(dateTime, building);
        return calculateTotalCharge(
                calculator.calculateLightLoad(),
                calculator.calculateMediumLoad(),
                calculator.calculateMaximumLoad()
        );
    }

    public Double calculateChargePerDate(LocalDateTime dateTime) {
        AtomicReference<Double> result = new AtomicReference<>(0.0);
        managingTargets.forEach(buildingType -> {
            LoadCalculator calculator = new LoadCalculator(dateTime, buildingType.name());
            result.updateAndGet(v -> v + calculateTotalCharge(
                    calculator.calculateLightLoad(),
                    calculator.calculateMediumLoad(),
                    calculator.calculateMaximumLoad()
            ));
        });
        return result.get();
    }

    private Double calculateTotalCharge(double lightLoad, double mediumLoad, double maximumLoad) {
        var rates = usageRateRepository.findAllBySeason(SeasonType.WINTER);
        return lightLoad * rates.get(0).getRatePerKwh() +
                mediumLoad * rates.get(1).getRatePerKwh() +
                maximumLoad * rates.get(2).getRatePerKwh() +
                BASE_CHARGE;
    }

    // 시간대별 요금을 계산하기 위한 inner 클래스
    private class LoadCalculator {
        private final LocalDateTime dateTime;
        private final String building;
        private final int year, month, day, hour;

        LoadCalculator(LocalDateTime dateTime, String building) {
            this.dateTime = dateTime;
            this.building = building;
            this.year = dateTime.getYear();
            this.month = dateTime.getMonth().getValue();
            this.day = dateTime.getDayOfMonth();
            this.hour = dateTime.getHour();
        }

        double calculateLightLoad() {
            double load = 0;
            if (hour < TimeSlot.MEDIUM_LOAD_1.startHour) {
                load += sumPowerUntilHour(0, hour);
            } else {
                load += sumPowerForPeriod(TimeSlot.LIGHT_LOAD);
            }

            if (hour >= TimeSlot.LIGHT_LOAD_2.startHour) {
                load += sumPowerFromHourToMinute(TimeSlot.LIGHT_LOAD_2.startHour, hour, dateTime.getMinute());
            }

            return load;
        }

        double calculateMediumLoad() {
            double load = 0;
            for (TimeSlot slot : new TimeSlot[]{TimeSlot.MEDIUM_LOAD_1, TimeSlot.MEDIUM_LOAD_2, TimeSlot.MEDIUM_LOAD_3}) {
                if (hour >= slot.endHour) {
                    load += sumPowerForPeriod(slot);
                } else if (hour >= slot.startHour) {
                    load += sumPowerFromHourToMinute(slot.startHour, hour, dateTime.getMinute());
                    break;
                }
            }
            return load;
        }

        double calculateMaximumLoad() {
            double load = 0;
            for (TimeSlot slot : new TimeSlot[]{TimeSlot.MAXIMUM_LOAD_1, TimeSlot.MAXIMUM_LOAD_2}) {
                if (hour >= slot.endHour) {
                    load += sumPowerForPeriod(slot);
                } else if (hour >= slot.startHour) {
                    load += sumPowerFromHourToMinute(slot.startHour, hour, dateTime.getMinute());
                    break;
                }
            }
            return load;
        }

        private Double sumPowerUntilHour(int startHour, int endHour) {
            return influxService.sumDataByPeriod(
                    LocalDateTime.of(year, month, day, startHour, 0),
                    LocalDateTime.of(year, month, day, endHour, dateTime.getMinute()),
                    building,
                    EnergyType.POWER
            );
        }

        private Double sumPowerForPeriod(TimeSlot slot) {
            return influxService.sumDataByPeriod(
                    LocalDateTime.of(year, month, day, slot.startHour, 0),
                    LocalDateTime.of(year, month, day, slot.endHour - 1, 59),
                    building,
                    EnergyType.POWER
            );
        }

        private Double sumPowerFromHourToMinute(int startHour, int endHour, int minute) {
            return influxService.sumDataByPeriod(
                    LocalDateTime.of(year, month, day, startHour, 0),
                    LocalDateTime.of(year, month, day, endHour, minute),
                    building,
                    EnergyType.POWER
            );
        }
    }
}