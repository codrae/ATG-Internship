package org.atg.bems.mssql.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


/**
 * 인하대학교의 MS SQL Server 로 부터 데이터를 받아오기 위한 Entity 객체
 */

@Entity
@Table(name = "Tech_All_KWH")
@AllArgsConstructor
@NoArgsConstructor
public class ElectricityData {

    @Transient
    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private EnergyType energyType;

    @EmbeddedId
    private CompositeId compositeId;


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CompositeId {
        @Column(name = "Building")
        String building;
        @Column(name = "DataValue")
        Double value;
        @Column(name = "DateTime")
        LocalDateTime dateTime;
    }

    public String getBuilding() {
        return this.compositeId.building;
    }

    public void setBuilding(String building) {
        this.compositeId.building = building;
    }

    public Double getValue() {
        return this.compositeId.value;
    }

    public void setValue(Double value) {
        this.compositeId.value = value;
    }

    public LocalDateTime getDateTime() {
        return this.compositeId.dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.compositeId.dateTime = dateTime;
    }
}
