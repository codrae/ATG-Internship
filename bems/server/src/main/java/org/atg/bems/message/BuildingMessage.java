package org.atg.bems.message;

import lombok.*;

import java.io.Serializable;
import java.util.List;


@Builder
@Data

/**
 * 소켓 통신에 활용될 JSON 스키마를 맞추기 위해 정의된 클래스
 */
public class BuildingMessage implements Serializable {
    public String building;
    public List<DataPoint> dataList;
}
