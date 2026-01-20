package com.bagcleaner.logistica.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RmTestRepository {

    private final JdbcTemplate rmJdbcTemplate;

    public RmTestRepository(@Qualifier("rmJdbcTemplate") JdbcTemplate rmJdbcTemplate) {
        this.rmJdbcTemplate = rmJdbcTemplate;
    }

    public List<String> testarConexao() {
        return rmJdbcTemplate.query(
            "SELECT TOP 5 name FROM sys.tables ORDER BY name",
            (rs, rowNum) -> rs.getString("name")
        );
    }
}
