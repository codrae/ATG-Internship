package org.atg.bems.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "influx")
public class InfluxConfig {

    @Value("${influx.token}")
    private String token;

    @Value("${influx.url}")
    private String url;

    @Value("${influx.database}")
    private String database;

    @Value("${influx.organization}")
    private String organization;

    @Bean
    public InfluxDBClient InfluxDBClient() {

        return InfluxDBClientFactory.create(
                url,
                token.toCharArray(),
                organization,
                database
        );
    }
}