package org.atg.bems.utils;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.atg.bems.message.BuildingMessage;
import org.atg.bems.message.DataPoint;
import org.atg.bems.mssql.entity.ElectricityData;

import java.util.*;

import static org.atg.bems.service.LstmService.isRetraining;

@Slf4j
public class CommonUtils {
    static public HashMap<String, String> KR_TO_EN = new HashMap<>();
    static public HashMap<String, String> KR_TO_URL = new HashMap<>();
    static public HashMap<String, String> EN_TO_KR = new HashMap<>();
    static public HashMap<String, String> URL_TO_EN = new HashMap<>();
    static public HashMap<String, String> URL_TO_KR = new HashMap<>();
    static public Double THRESHOLD = 30.0; //TODO : 통상적인 MAPE 30%으로 우선 지정
    static {

        for(BuildingType type : BuildingType.values()) {
            KR_TO_EN.put(type.getKoreanName(), type.name());
            KR_TO_URL.put(type.getKoreanName(), type.description);
            EN_TO_KR.put(type.name(), type.koreanName);
            URL_TO_EN.put(type.description, type.name());
            URL_TO_KR.put(type.description, type.getKoreanName());
        }

    }

    // todo: 학교DB에서 데이터를 가져올때 사용하기 때문에 입력 데이터를 ElectricityData로 설정함
    public static String toEnglishBuildingName(ElectricityData korName) {
        return KR_TO_EN.get(korName.getBuilding());
    }

    public static String fromKoreanToEnglish(String korName) {return KR_TO_EN.get(korName);}

    public static String toUrlBuildingName(String engName) {
        return KR_TO_URL.get(engName);
    }

    public static String toKoreanBuildingName(String engName) {
        return  EN_TO_KR.get(engName);
    }


    public static String fromUrlBuildingNameToEnglish(String engName) {
        return  URL_TO_EN.get(engName);
    }

    public static String fromUrlBuildingNameToKorean(String engName) {
        return  URL_TO_KR.get(engName);
    }


    /*
     * 차분 값을 구해주는 함수 입니다.
     */
    public static List<ElectricityData> calculateDiff(List<ElectricityData> data) {
        List<ElectricityData> diff = new ArrayList<ElectricityData>();
        for (int i = 1; i < data.size(); i++) { // index == 0 은 제외
            ElectricityData beforeData = data.get(i - 1);
            ElectricityData currentData = data.get(i);
            diff.add(calculateDiff(beforeData, currentData));
        }
        return diff;
    }

    public static ElectricityData calculateDiff(ElectricityData beforeData, ElectricityData currentData) {
        return new ElectricityData(
                currentData.getEnergyType(),
                new ElectricityData.CompositeId(
                        currentData.getBuilding(),
                        currentData.getValue() - beforeData.getValue(),
                        currentData.getDateTime()));
    }
    public static BuildingMessage toBuildingMessage(String building, List<ElectricityData> dataList){
        List<DataPoint> pointList = new ArrayList<>();

        for(ElectricityData data : dataList){
            pointList.add(DataPoint.builder()
                    .datetime(data.getDateTime())
                    .value(data.getValue())
                    .energyType(dataList.getFirst().getEnergyType())
                    .isAnomaly(false)
                    .build());
        }

        return BuildingMessage.builder()
                .building(building)
                .dataList(pointList)
                .build();
    }

    public static BuildingMessage toBuildingMessage(String building, List<ElectricityData> dataList, List<ElectricityData> predictDataList) {
        List<DataPoint> pointList = new ArrayList<>();

        Iterator<ElectricityData> iterator = dataList.iterator();
        Iterator<ElectricityData> predictIterator = predictDataList.iterator();



        while(iterator.hasNext()){
            ElectricityData real = iterator.next();
            DataPoint.DataPointBuilder builder = DataPoint.builder()
                    .datetime(real.getDateTime())
                    .value(real.getValue());

            if(!isRetraining.get()) {
                if (predictIterator.hasNext()) {

                    ElectricityData predict = predictIterator.next();
                    builder.isAnomaly(Math.abs((real.getValue() - predict.getValue()) / real.getValue()) * 100 > THRESHOLD);
                } else {
                    log.info("{}에 대한 예측 값이 현재 influxDB에 없어 {} 데이터에 대한 이상치 검증을 하지 못하였습니다.", building, real.getDateTime());

                }
            }else{
                log.info("모델이 재학습 중이기 때문에 이상치 탐지를 하지 않습니다.");
            }
            pointList.add(builder.build());
        }

        return BuildingMessage.builder()
                .building(building)
                .dataList(pointList)
                .build();
    }


    @Getter
    public enum BuildingType {
        BUILDING_1("building-1", "1호관(본관)"),
        BUILDING_2_SOUTH_4("building-2-south-4", "2호남관/4호관"),
        BUILDING_2_NORTH("building-2-north", "2호북관"),
        BUILDING_5_SOUTH("building-5-south", "5호남관"),
        BUILDING_5_EAST("building-5-east", "5호동관"),
        BUILDING_5_NORTH("building-5-north", "5호북관"),
        ANNIVERSARY_MEMORIAL_HALL("anniversary-memorial-hall", "60주년기념관"),
        INHA_DREAM_CENTER("inha-dream-center", "김현태인하드림센터"),
        BUILDING_7("building-7", "7호관(학생회관)"),
        BUILDING_9("building-9", "9호관/평생교육관"),
        LAW_SCHOOL_BUILDING("law-school-building", "로스쿨관"),
        WEST_HALL("west-hall", "서호관"),
        INHA_DREAM_CENTER_2_3("inha-dream-center-2-3", "인하드림센터 2/3관"),
        HIGH_TECH_CENTER("high-tech-center", "하이테크센터");


        final public String description;
        private final String koreanName;

        BuildingType(String description, String koreanName) {
            this.description = description; // URL용
            this.koreanName = koreanName;
        }
    }
}
