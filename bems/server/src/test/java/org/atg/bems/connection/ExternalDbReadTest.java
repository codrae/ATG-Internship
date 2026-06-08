package org.atg.bems.connection;

import org.atg.bems.mssql.entity.ElectricityData;
import org.atg.bems.mssql.repository.TechAllKwhRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ExternalDbReadTest {

    private static final Logger log = LoggerFactory.getLogger(ExternalDbReadTest.class);
    @Autowired
    private TechAllKwhRepository repository;

    @Test
    public void testReadFromExternalDb() {
        System.out.println(repository.findAll().size());
    }

    @Test
    public void readByBuildingNameAndCurrentTime() {
        List<ElectricityData> list = repository.findAllByCompositeIdBuildingAndCompositeIdDateTimeGreaterThanEqualOrderByCompositeIdDateTimeAsc("60주년기념관", LocalDateTime.now().minusMinutes(20));

        log.info(list.toString());
//        Assertions.assertEquals(2, list.size());
        Assertions.assertFalse(list.isEmpty());
    }
}
