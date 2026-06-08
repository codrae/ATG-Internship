package org.atg.bems.connection;

import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.utils.CommonUtils;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.*;


public class TransformLogicTest {

    private static final Logger logger = LoggerFactory.getLogger(TransformLogicTest.class);
    @Test
    public void calculateAndLogicTest() {
        HashMap<String, List<ElectricityData>> map = new HashMap<>();
        List<ElectricityData> result = createElectricityDataList(100);
        result.forEach(
                elec -> {
                    if(!map.containsKey(elec.getBuilding())){
                        map.put(elec.getBuilding(), new ArrayList<>());
                    }
                    map.get(elec.getBuilding()).add(elec);
                }
        );
        for(Map.Entry<String, List<ElectricityData>> entry : map.entrySet()) {
            List<ElectricityData> list = entry.getValue();
            list.sort(Comparator.comparing(ElectricityData::getDateTime));
            list = CommonUtils.calculateDiff(list);
            list.forEach(electricityData -> logger.info(String.valueOf(electricityData.getValue())));
        }
    }
    public List<ElectricityData> createElectricityDataList(int size){
        List<ElectricityData> list = new ArrayList<>();
        for(int i = 1; i < size; i++){
            list.add(createElectricityData(i));
        }
        return list;
    }

    public ElectricityData createElectricityData(double value){
        return new ElectricityData(
                EnergyType.POWER,
                new ElectricityData.CompositeId("building", value, LocalDateTime.now())
        );
    }
}
