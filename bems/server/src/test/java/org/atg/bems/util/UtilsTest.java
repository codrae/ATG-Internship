package org.atg.bems.util;

import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.utils.CommonUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;


public class UtilsTest {

    // 차분 계산 테스트
    @Test
    public void calculateDiffTest(){
        ElectricityData beforeData = createElectricityData(10.0);
        ElectricityData afterData = createElectricityData(20.0);

        Assertions.assertEquals(CommonUtils.calculateDiff(beforeData, afterData).getValue(), 10.0);
    }

    public ElectricityData createElectricityData(double value){
        return new ElectricityData(
                EnergyType.POWER,
                new ElectricityData.CompositeId("building", value, LocalDateTime.now())
        );
    }
}
