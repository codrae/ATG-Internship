package org.atg.bems.postgresql.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@ToString(callSuper = true)
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "client")
@SequenceGenerator(name = "client_generator", sequenceName = "client_seq", initialValue = 1, allocationSize = 1)
public class Client extends AuditingField{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "client_generator")
    private Long id;

    @Column(name = "client_name")
    String clientName;

    @Column(name = "password")
    String password;

    @Column(name = "target_usage")
    Double targetUsage;

    @Column(name = "anomaly_criteria")
    Double anomalyCriteria;

    @Column(name = "daily_usage_bound")
    Double dailyUsageBound;

    @Column(name = "monthly_usage_bound")
    Double monthlyUsageBound;
}
