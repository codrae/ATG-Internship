package org.atg.bems.mapper;

import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.entity.EnergyType;

import java.time.ZoneId;
import java.util.List;

/**
 * InfluxDB에 데이터를 넣기 위해 전력 데이터를 {@link Point} 로 변환해주는 클래스
 */
public class PointMapper {
    public static Point toPoint(ElectricityData electricityData) {
        return new Point(electricityData.getBuilding())
                .time(
                        electricityData
                                .getDateTime()
                                .atZone(ZoneId.systemDefault())
                                .toInstant(),
                        WritePrecision.S)
                .addField("value", electricityData.getValue())
                .addTag("energy_type", EnergyType.POWER.name()); //TODO : 어차피 인하대 전력만 사용하니까  전력 데이터만 가져옴
    }

    public static List<Point> toPoints(List<ElectricityData> electricityDataList) {
        return electricityDataList.stream()
                .map(PointMapper::toPoint)
                .toList();
    }
}
