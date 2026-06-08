package org.atg.bems.postgresql.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 전력 계약 종별 세부 요금 책정 방식을 저장 관리하기 위한 엔티티
 */

@Getter
@Entity
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "usage_rate")
@SequenceGenerator(name = "usage_rate_generator", sequenceName = "usage_rate_seq", initialValue = 1, allocationSize = 1)
public class UsageRate {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usage_rate_generator")
    Long id;

    @ManyToOne
    @JoinColumn(name = "contract_type_id")
    @ToString.Exclude
    ContractType contractType;

    @Column(name = "base_rate")
    private Double baseRate;

    @Column(name = "usage_level")
    private Integer usageLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "season")
    private SeasonType season;

    @Column(name = "rate_per_kwh")
    private Double ratePerKwh;
}
