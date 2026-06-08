package org.atg.bems.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@EnableJpaRepositories(
        basePackages = "org.atg.bems.mssql",
        entityManagerFactoryRef = "msSqlEntityManagerFactory",
        transactionManagerRef = "msSqlTransactionManager"
)
public class MssqlConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.mssql-datasource")
    public DataSource msSqlDataSource(){
        return DataSourceBuilder.create().build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean msSqlEntityManagerFactory(
    ){
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(msSqlDataSource());
        em.setPackagesToScan("org.atg.bems.mssql");

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setShowSql(false);
        vendorAdapter.setGenerateDdl(false);
        em.setJpaVendorAdapter(vendorAdapter);

        HashMap<String, Object> prop = new HashMap<>();
        prop.put("hibernate.dialect", "org.hibernate.dialect.SQLServer2012Dialect");
        prop.put("hibernate.naming.physical-strategy", "org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl");
        prop.put("hibernate.format_sql", false);
        em.setJpaPropertyMap(prop);
        return em;
    }

    @Bean
    public PlatformTransactionManager msSqlTransactionManager(){
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(msSqlEntityManagerFactory().getObject());
        return transactionManager;
    }
}
