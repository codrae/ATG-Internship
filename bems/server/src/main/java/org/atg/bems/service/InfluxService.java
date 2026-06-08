package org.atg.bems.service;

import com.influxdb.client.*;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mapper.PointMapper;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.utils.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static org.atg.bems.BemsApplication.managingTargets;

@Service
@Slf4j
@Getter
public class InfluxService {

    private final InfluxDBClient influxDBClient;
    private final QueryApi queryApi;
    private final WriteApiBlocking writeApi;
    private final DeleteApi deleteApi;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
    private final RedisTemplate<String, Object> redisTemplate;
    private final ValueOperations<String, Object> valueOps;

    private static final Duration CACHE_TTL = Duration.ofMinutes(10); // 캐시 유효 시간
    private static final String CACHE_PREFIX = "bems:";

    @Autowired
    public InfluxService(InfluxDBClient influxDBClient, RedisTemplate<String, Object> redisTemplate) {
        this.influxDBClient = influxDBClient;
        this.queryApi = influxDBClient.getQueryApi();
        this.writeApi = influxDBClient.getWriteApiBlocking();
        this.deleteApi = influxDBClient.getDeleteApi();
        this.redisTemplate = redisTemplate;
        this.valueOps = redisTemplate.opsForValue();
    }

    private String generateCacheKey(LocalDateTime dateTime, String measurement, EnergyType energyType) {
        return CACHE_PREFIX + measurement + ":" + energyType + ":" + dateTime.toString();
    }

    private String generateListCacheKey(LocalDateTime startTime, LocalDateTime endTime,
                                        String measurement, EnergyType energyType) {
        return CACHE_PREFIX + measurement + ":" + energyType + ":" +
                startTime.toString() + ":" + endTime.toString();
    }

    // 단일 전기 데이터 생성
    public ElectricityData createElectricityData(ElectricityData electricityData) {
        Point point = PointMapper.toPoint(electricityData);
        writeApi.writePoint(point);

        // 관련된 캐시 키 삭제
        String cacheKey = generateCacheKey(
                electricityData.getDateTime(),
                electricityData.getBuilding(),
                electricityData.getEnergyType()
        );
        redisTemplate.delete(cacheKey);

        return electricityData;
    }

    // 다량 전기 데이터 생성
    public List<ElectricityData> createElectricityDataList(List<ElectricityData> electricityDataList) {
        List<Point> points = PointMapper.toPoints(electricityDataList);

        writeApi.writePoints(points);

        return electricityDataList;
    }

    // 단일 데이터 조회 (캐시 적용)
    public ElectricityData readData(LocalDateTime localDateTime, String measurement, EnergyType energyType) {
        String cacheKey = generateCacheKey(localDateTime, measurement, energyType);

        // 캐시에서 데이터 조회 시도
        ElectricityData cachedData = (ElectricityData) valueOps.get(cacheKey);
        if (cachedData != null) {
            log.debug("Cache hit for key: {}", cacheKey);
            return cachedData;
        }

        // 캐시에 없는 경우 InfluxDB에서 조회
        ElectricityData data = readDataFromInflux(localDateTime, measurement, energyType);
        if (data != null) {
            valueOps.set(cacheKey, data, CACHE_TTL);
            log.debug("Cached data for key: {}", cacheKey);
        }

        return data;
    }

    // 기존 InfluxDB 조회 메소드들은 private으로 변경하고 접미사 변경
    private ElectricityData readDataFromInflux(LocalDateTime localDateTime,
                                               String measurement, EnergyType energyType) {
        // 기존 readData 로직
        String endTimeBefore10mOff = localDateTime.minusMinutes(10).format(formatter);
        String endTimeOff = localDateTime.format(formatter);
        String sql = buildQueryWithTag(endTimeBefore10mOff, endTimeOff, measurement, energyType.toString());
        List<FluxTable> tables = queryApi.query(sql);
        return switch(energyType) {
            case POWER -> fluxToElectricityData(tables);
            case HEAT -> fluxToHeatData(tables);
            case GAS -> fluxToGasData(tables);
            default -> null;
        };
    }


    private ElectricityData fluxToGasData(List<FluxTable> tables) {
        return null;
    }

    private ElectricityData fluxToHeatData(List<FluxTable> tables) {
        return null;
    }

    public List<ElectricityData> readDataList(LocalDateTime startTime, LocalDateTime endTime,
                                              String measurement, EnergyType energyType) {
        String cacheKey = generateListCacheKey(startTime, endTime, measurement, energyType);

        // 캐시에서 데이터 조회 시도
        @SuppressWarnings("unchecked")
        List<ElectricityData> cachedList = (List<ElectricityData>) valueOps.get(cacheKey);
        if (cachedList != null) {
            log.debug("Cache hit for list key: {}", cacheKey);
            return cachedList;
        }

        // 캐시에 없는 경우 InfluxDB에서 조회
        List<ElectricityData> dataList = readDataListFromInflux(startTime, endTime, measurement, energyType);
        if (dataList != null && !dataList.isEmpty()) {
            valueOps.set(cacheKey, dataList, CACHE_TTL);
            log.debug("Cached list data for key: {}", cacheKey);
        }

        return dataList;
    }


    public List<ElectricityData> readPredictElectricityDataList(LocalDateTime startTime, LocalDateTime endTime, String building, EnergyType energyType) {

        String measurement = building.toString() + "_PREDICT";

        String predictCacheKey = generateListCacheKey(startTime, endTime, measurement, energyType);

        // 캐시에서 데이터 조회 시도
        @SuppressWarnings("unchecked")
        List<ElectricityData> cachedList = (List<ElectricityData>) valueOps.get(predictCacheKey);
        if (cachedList != null) {
            log.debug("Predict Cache hit for list key: {}", predictCacheKey);
            return cachedList;
        }

        // 캐시에 없는 경우 InfluxDB에서 조회
        List<ElectricityData> dataList = readDataListFromInflux(startTime, endTime, measurement, energyType);
        if (dataList != null && !dataList.isEmpty()) {
            valueOps.set(predictCacheKey, dataList, CACHE_TTL);
            log.debug("Predict Cached list data for key: {}", predictCacheKey);
        }

        return dataList;
    }


    // 특정 기간동안의 전기 데이터 조회
    private List<ElectricityData> readDataListFromInflux(LocalDateTime startTime, LocalDateTime endTime, String measurement, EnergyType energyType) {

        // localDataTime을 string 으로 변환
        String startTimeOff = startTime.format(formatter);
        String endTimeOff = endTime.format(formatter);

        String sql = buildQueryWithTag(startTimeOff, endTimeOff, measurement, energyType.toString());

        System.out.println("쿼리문: " + sql);

        List<FluxTable> tables = queryApi.query(sql);
        return switch(energyType){
            case POWER -> fluxToElectricityDataList(tables);
            case HEAT -> fluxToHeatDataList(tables);
            case GAS -> fluxToGasDataList(tables);
            default -> null;
        };
    }

    private List<ElectricityData> fluxToGasDataList(List<FluxTable> tables) {
        return null;
    }

    private List<ElectricityData> fluxToHeatDataList(List<FluxTable> tables) {
        return null;
    }
    // 최대값 조회 (캐시 적용)
    public Double maxValueByPeriod(LocalDateTime startTime, LocalDateTime endTime,
                                   String measurement, EnergyType energyType) {
        String cacheKey = CACHE_PREFIX + "max:" + generateListCacheKey(startTime, endTime, measurement, energyType);

        Double cachedMax = (Double) valueOps.get(cacheKey);
        if (cachedMax != null) {
            return cachedMax;
        }

        Double maxValue = maxValueFromInflux(startTime, endTime, measurement, energyType);
        if (maxValue != null) {
            valueOps.set(cacheKey, maxValue, CACHE_TTL);
        }

        return maxValue;
    }

    //  TODO : 아래의 함수와 중복되는 느낌이 있음 둘 중 하나로 대체하는게 좋을듯
    private Double maxValueFromInflux(LocalDateTime startTime, LocalDateTime endTime, String measurement, EnergyType energyType) {

        String startTimeOff = startTime.format(formatter);
        String endTimeOff = endTime.format(formatter);

        String maxSql = buildQueryWithTag(startTimeOff, endTimeOff, measurement, energyType.toString()) + "|> max(column: \"_value\") ";

        List<FluxTable> maxValueTables = queryApi.query(maxSql);

        return fluxToDouble(maxValueTables);
    }

    // 특정 기간동안의 최대 전력량 반환
    public List<ElectricityData> maxDataByPeriod(LocalDateTime startTime, LocalDateTime endTime, String measurement, EnergyType energyType) {

        String startTimeOff = startTime.format(formatter);
        String endTimeOff = endTime.format(formatter);
        String maxSql = buildQueryWithTag(startTimeOff, endTimeOff, measurement, energyType.toString()) + "|> max(column: \"_value\") ";

        List<FluxTable> maxValueTables = queryApi.query(maxSql);

        Double maxVal = fluxToDouble(maxValueTables);

        String allMaxSql = buildQueryWithTag(startTimeOff, endTimeOff, measurement, energyType.toString())
                + String.format("|> filter(fn: (r) => r[\"_value\"] == %f)", maxVal);

        List<FluxTable> maxTables = queryApi.query(allMaxSql);

        return switch(energyType) {
            case POWER -> {
                List<ElectricityData> electricityData = fluxToElectricityDataList(maxTables);
                electricityData.sort(
                    Comparator.<ElectricityData, LocalDateTime>comparing(e -> e.getDateTime(), LocalDateTime::compareTo).reversed()
            );
                yield electricityData;
            }
            case HEAT -> fluxToHeatDataList(maxTables);
            case GAS -> fluxToGasDataList(maxTables);
        };
    }

    // 합계 조회 (캐시 적용)
    public Double sumDataByPeriod(LocalDateTime startTime, LocalDateTime endTime,
                                  String measurement, EnergyType energyType) {
        String cacheKey = CACHE_PREFIX + "sum:" + generateListCacheKey(startTime, endTime, measurement, energyType);

        Double cachedSum = (Double) valueOps.get(cacheKey);
        if (cachedSum != null) {
            return cachedSum;
        }

        Double sum = sumDataFromInflux(startTime, endTime, measurement, energyType);
        if (sum != null) {
            valueOps.set(cacheKey, sum, CACHE_TTL);
        }

        return sum;
    }

    private Double sumDataFromInflux(LocalDateTime startTime, LocalDateTime endTime, String measurement, EnergyType energyType) {

        String startTimeOff = startTime.format(formatter);
        String endTimeOff = endTime.format(formatter);

        String sumSql = buildQueryWithTag(startTimeOff, endTimeOff, measurement, energyType.name()) + "\n|> sum(column: \"_value\")";

        List<FluxTable> sumTables = influxDBClient.getQueryApi().query(sumSql);

        return fluxToDouble(sumTables);

    }

    public Double sumTotalDataByPeriod(LocalDateTime startTime, LocalDateTime endTime, EnergyType energyType) {
        Double result = 0.0;
        for(CommonUtils.BuildingType building : managingTargets){
            Double value = sumDataByPeriod(startTime, endTime, building.name(), energyType);
            if(value <= 0) continue;
            result += value;
        }
        return result;
    }

    // 예측 데이터를 반환하는 함수
    public List<ElectricityData> readPredictElectricityData(LocalDateTime startTime, LocalDateTime endTime, CommonUtils.BuildingType building, EnergyType energyType) {

        String startTimeOff = startTime.format(formatter);
        String endTimeOff = endTime.format(formatter);

        String measurement = building.toString() + "_PREDICT";
        List<FluxTable> predictTable = influxDBClient.getQueryApi().query(
                buildQueryWithTag(startTimeOff, endTimeOff, measurement, energyType.toString()
                ));

        return fluxToElectricityDataList(predictTable);
    }

    // SQL 쿼리 생성
    private String buildQuery(String startTime, String endTime, String measurement) {
        return String.format("from(bucket: \"INHA_BEMS\") " +
                        "|> range(start: time(v:\"%s\"), stop: time(v:\"%s\")) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"%s\") " +
                        "|> filter(fn: (r) => r[\"_field\"] == \"value\")",
                startTime, endTime, measurement);
    }

    // SQL 쿼리 생성
    private String buildQueryWithTag(String startTime, String endTime, String measurement, String tag) {
        return String.format("from(bucket: \"INHA_BEMS\") " +
                        "|> range(start: time(v:\"%s\"), stop: time(v:\"%s\")) " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"%s\") " +
                        "|> filter(fn: (r) => r[\"energy_type\"] == \"%s\")" +
                        "|> filter(fn: (r) => r[\"_field\"] == \"value\" )",
                startTime, endTime, measurement, tag);
    }

    private Double fluxToDouble(List<FluxTable> tables) {
        return tables.stream()
                .flatMap(table -> table.getRecords().stream())
                .findFirst()
                .map(record -> (Double) record.getValueByKey("_value"))
                .orElse(null);
    }

    // LocalDateTime 객체를 OffsetDateTime 으로 변환
    private OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime){
        ZoneOffset offset = ZoneOffset.ofHours(9);
        return OffsetDateTime.of(localDateTime, offset);
    }


    // FluxTable -> ElectricityData
    private ElectricityData fluxToElectricityData(List<FluxTable> tables) {
        return tables.stream()
                .flatMap(table -> table.getRecords().stream())
                .findFirst() // 첫번째 record가 존재할 경우 ElectricityData 객체로 매핑
                .map(this::mapFluxToElectricityData)
                .orElse(null);

    }

    // FluxTable -> List<ElectricityData>
    private List<ElectricityData> fluxToElectricityDataList(List<FluxTable> tables) {

        return tables.stream()
                .flatMap(table -> table.getRecords().stream()) // fluxTable의 각 record에 대한 stream 생성
                .map(this::mapFluxToElectricityData)
                .collect(Collectors.toList());

    }

    private ElectricityData mapFluxToElectricityData(FluxRecord record) {
        String building = record.getValueByKey("_measurement").toString();
        Double value = Double.valueOf(record.getValueByKey("_value").toString());
        Instant time = record.getTime();
        LocalDateTime dateTime = LocalDateTime.ofInstant(time, ZoneOffset.ofHours(0));
        String type = record.getValueByKey("energy_type").toString();
//        String type = EnergyType.POWER.toString();

        return new ElectricityData(
                EnergyType.valueOf(type.toUpperCase()),
                new ElectricityData.CompositeId(
                        building,
                        value,
                        dateTime
                ));
    }

}
