package org.atg.bems.postgresql.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 전력 계약 종별 요금을 관리하기 위한 엔티티 ex) 교육용(을)
 */

@Getter
@Entity
@ToString(callSuper = true)
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "contract_type")
@SequenceGenerator(name = "contract_type_generator", sequenceName = "contract_type_seq", initialValue = 1, allocationSize = 1)
public class ContractType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "contract_type_generator")
    private Long id;

    @Column(name = "code", length = 20, nullable = false)
    private String code;

    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "voltage_type", length = 20, nullable = false)
    VoltageType voltageType;

    @Column(name = "selection", length = 20, nullable = false)
    private String selection;
}
