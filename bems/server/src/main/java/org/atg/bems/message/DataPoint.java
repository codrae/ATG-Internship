package org.atg.bems.message;

import lombok.Builder;
import lombok.Data;
import org.atg.bems.mssql.entity.EnergyType;

import java.io.Serializable;
import java.time.LocalDateTime;

@Builder
@Data

/**
 * 소켓 통신에 전달 주체로 데이터에 대한 이상치, 에너지 종류, 값, 발생 시간 정보를 보유함.
 */
public class DataPoint implements Serializable {
    public boolean isAnomaly;
    public EnergyType energyType;
    public LocalDateTime datetime;
    public double value;
}
