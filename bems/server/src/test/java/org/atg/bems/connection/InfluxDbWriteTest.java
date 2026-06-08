package org.atg.bems.connection;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.write.Point;
import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mapper.PointMapper;
import org.atg.bems.mssql.entity.EnergyType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class InfluxDbWriteTest {
    @Autowired
    InfluxDBClient influxDBClient;

    @Test
    public void writeData(){
        Point point = PointMapper.toPoint(new ElectricityData(EnergyType.POWER, new ElectricityData.CompositeId("test", 200.0, LocalDateTime.now())));
        influxDBClient.makeWriteApi()
                .writePoint(point);
    }
}
