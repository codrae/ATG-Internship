package org.atg.bems.postgresql.repository;

import org.atg.bems.postgresql.entity.ContractType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoltageTypeRepository extends JpaRepository<ContractType, Long> {
}
