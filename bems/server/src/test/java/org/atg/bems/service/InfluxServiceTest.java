package org.atg.bems.service;


import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.entity.EnergyType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class InfluxServiceTest {


    @Autowired
    InfluxService influxService;

    @Test
    @DisplayName("readElectricityDataList 를 통해 db 데이터 직접 읽기 테스트")
    public void readDataList(){

        //given
        LocalDateTime startTime = LocalDateTime.now().minusHours(72);
        LocalDateTime endTime = LocalDateTime.now();
        String measurement = "60주년기념관";

        //when
        List<ElectricityData> electricityDataList = influxService.readDataList(startTime, endTime, measurement, EnergyType.POWER);

        //then
        assertThat(electricityDataList).isNotNull();
        assertThat(electricityDataList.size()).isGreaterThan(0);

    }

    @Test
    @DisplayName("readElectricityData 를 통해 db 데이터 직접 읽기 테스트")
    public void readData(){
        //given
        LocalDateTime endTime = LocalDateTime.now().minusHours(36);
        String measurement = "60주년기념관";

        //when
        ElectricityData electricityData = influxService.readData(endTime, measurement, EnergyType.POWER);

        //then
        assertThat(electricityData).isNotNull();

        System.out.println(electricityData.getDateTime().toString());
    }

    @Test
    @DisplayName("설정한 기간 안의 최대값을 갖는 electricitydata 반환하는 테스트 코드")
    public void getMaxValueList() {

        // given
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = LocalDateTime.now().minusDays(7);

        // when
        List<ElectricityData> electricityDataList= influxService.maxDataByPeriod(startTime, endTime, "60주년기념관", EnergyType.POWER);

        // then
        assertThat(electricityDataList).isNotNull();

        electricityDataList.forEach(System.out::println);

    }


    @Test
    @DisplayName("설정한 기간 안의 전력값의 총 합을 반환하는 테스트 코드")
    public void getSumValue(){

        // given
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime = LocalDateTime.now().minusDays(7);

        // when
        Double sumVal = influxService.sumDataByPeriod(startTime, endTime, "60주년기념관", EnergyType.POWER);

        // then
        assertThat(sumVal).isGreaterThan(0);
        System.out.println("7일동안의 합: " + sumVal);
    }


}
