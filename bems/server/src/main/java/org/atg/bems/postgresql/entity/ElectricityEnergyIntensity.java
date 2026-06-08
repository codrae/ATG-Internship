package org.atg.bems.postgresql.entity;


import jakarta.persistence.*;
import lombok.*;

/**
 * 각 건물의 월별 에너지 원단위를 관리하기 위한 엔티티
 */

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "electricity_energy_intensity")
@ToString(callSuper = true)
@SequenceGenerator(name = "electricity_energy_intensity_generator", sequenceName = "electricity_energy_intensity_seq", initialValue = 1, allocationSize = 1)
public class ElectricityEnergyIntensity extends AuditingField{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "electricity_energy_intensity_generator")
    private Long id;

    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "building_id")
    @ToString.Exclude
    private Building building;

    @Setter
    @Column(name = "year")
    private Integer year;

    @Setter
    @Column(name = "month")
    private Integer month;

    @Setter
    @Column(name = "energy_intensity_monthly")
    private Double energyIntensityMonthly;
}
