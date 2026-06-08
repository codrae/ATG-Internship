package org.atg.bems.postgresql.repository;

import org.atg.bems.postgresql.entity.SeasonType;
import org.atg.bems.postgresql.entity.UsageRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsageRateRepository extends JpaRepository<UsageRate, Long> {

    List<UsageRate> findAllBySeason(SeasonType seasonType);
}
