package com.bagcleaner.logistica.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class RmDataSourceConfig {

    @Bean(name = "rmDataSourceProperties")
    @ConfigurationProperties("rm.datasource")
    public DataSourceProperties rmDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "rmDataSource")
    @ConfigurationProperties("rm.datasource.hikari")
    public DataSource rmDataSource(@Qualifier("rmDataSourceProperties") DataSourceProperties props) {
        HikariDataSource ds = props.initializeDataSourceBuilder()
            .type(HikariDataSource.class)
            .build();

        ds.setReadOnly(true);
        return ds;
    }

    @Bean(name = "rmJdbcTemplate")
    public JdbcTemplate rmJdbcTemplate(@Qualifier("rmDataSource") DataSource rmDataSource) {
        return new JdbcTemplate(rmDataSource);
    }
}
