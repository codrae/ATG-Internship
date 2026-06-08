package org.atg.bems.postgresql.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.atg.bems.mssql.entity.EnergyType;

import java.time.LocalDateTime;

/**
 * 이상치 로그를 PostgreSQL에서 관리하기 위한 위한 엔티티
 */

@Getter
@Entity
@ToString(callSuper = true)
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "anomaly_log")
@SequenceGenerator(name = "anomaly_log_generator", sequenceName = "anomaly_log_seq", initialValue = 1, allocationSize = 1)
public class AnomalyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "anomaly_log_generator")
    private Long id;

    @Column(name = "created_at")
    @Setter
    private LocalDateTime createdAt;

    @Column(name = "value")
    @Setter
    private Double value;

    @Column(name = "predict")
    @Setter
    private Double predict;

    @Enumerated(EnumType.STRING)
    @Column(name = "energy_type")
    @Setter
    EnergyType energyType;

    @ManyToOne
    @JoinColumn(name = "building_id")
    @JsonIgnoreProperties
    @Setter
    Building building;
}
