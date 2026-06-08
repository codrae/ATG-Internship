package org.atg.bems.postgresql.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;

/**
 * 건물 정보를 기록하기 위한 엔티티
 */

@Getter
@Entity
@ToString(callSuper = true)
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "building")
@SequenceGenerator(name = "building_generator", sequenceName = "building_seq", initialValue = 1, allocationSize = 1)
public class Building extends AuditingField{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "building_generator")
    private Long id;

    @Column(name = "building_name", length = 128, nullable = false, unique = true)
    @Setter
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "building_type",columnDefinition = "building_type", nullable = false)
    @Setter
    private BuildingType buildingType;

    @Column(name = "address", length = 128, nullable = false)
    @Setter
    private String address;

    @Column(name = "completion_date", nullable = false)
    @Setter
    private LocalDate completionDate;

    @Column(name = "total_area", nullable = false)
    @Setter
    private Long totalArea;

//  TODO : 정렬 순서 논의 후 지정  @OrderBy("createdAt DESC")
    @ToString.Exclude
    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL)
    @JsonIgnore
    Set<ElectricityEnergyIntensity> electricityEnergyIntensities;

    @ToString.Exclude
    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL)
    @JsonIgnore
    Set<ElectricalConsumption> electricalConsumptions;

    @ToString.Exclude
    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL)
    @JsonIgnore
    Set<AnomalyLog> anomalyLogs;

    @Override
    public boolean equals(Object o) { //id라는 유니크한 속성만으로도 동등한 객체인지에 대한 비교가 충분하기 때문에 id만을 사용하여 성능을 높여줌
        if (this == o) return true;
        if (!(o instanceof Building building)) return false;
        return this.getId() != null &&  this.getId().equals(building.id);
        //아직 영속화가 되기 전이면 null일 수 있기 때문에 null check와 동시에 아직 영속화 대상에 포함되지 않는 객체들은 같은 대상으로 보지 않겠다는 의미도 갖고 있음.
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getId());
    }

    public enum BuildingType {
        EDU, MEDICAL, ETC, CULTURE
    }
}
