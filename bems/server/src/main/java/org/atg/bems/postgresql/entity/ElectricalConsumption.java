package org.atg.bems.postgresql.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 월 단위 에너지 사용량 집계 데이터를 관리하기 위한 엔티티
 */

@Getter
@Entity
@ToString(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "energy_consumption")
@SequenceGenerator(name = "energy_consumption_generator", sequenceName = "energy_consumption_seq", initialValue = 1, allocationSize = 1)
public class ElectricalConsumption extends AuditingField{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "energy_consumption_generator")
    private Long id;

    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "building_id")
    @ToString.Exclude
    private Building building;

    @Setter
    @Column(name = "year", nullable = false)
    private Integer year;

    @Setter
    @Column(name = "month", nullable = false)
    private Integer month;

    @Setter
    @Column(name = "electricity_usage", nullable = false)
    private Double electricityUsage;

    @Setter
    @Column(name = "peak_demand", nullable = false)
    private Double peekDemand;
}
