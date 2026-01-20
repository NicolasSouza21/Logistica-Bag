package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.RmColetaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RmConsultaService {

    @Qualifier("rmJdbcTemplate")
    private final JdbcTemplate rmJdbcTemplate;

    public RmColetaDTO buscarEnderecoColeta(String codCfo, String cidadeColeta) {

        // ==========================
        // 1) TENTA ACHAR ENDEREÇO OPERACIONAL POR CIDADE (se existir tabela de endereços)
        // ==========================
        // ✅ Sem estado (nem coluna, nem alias)
        String sqlEnderecoPorCidade = """
            SELECT TOP 1
                CAST(c.CODCFO AS VARCHAR(50)) AS codCfo,
                c.NOMEFANTASIA AS nomeFantasia,
                c.NOME AS nomeSocial,
                e.CIDADE AS cidadeColeta,
                e.RUA AS rua,
                e.NUMERO AS numero,
                e.BAIRRO AS bairro,
                e.COMPLEMENTO AS complemento,
                e.CEP AS cep,
                e.LATITUDE AS latitude,
                e.LONGITUDE AS longitude
            FROM FCFO c
            INNER JOIN FCFO_ENDERECOS e ON e.CODCFO = c.CODCFO
            WHERE c.CODCFO = ?
              AND e.CIDADE = ?
        """;

        try {
            List<RmColetaDTO> porCidade = rmJdbcTemplate.query(
                sqlEnderecoPorCidade,
                (rs, rowNum) -> new RmColetaDTO(
                    rs.getString("codCfo"),
                    rs.getString("nomeFantasia"),
                    rs.getString("nomeSocial"),
                    rs.getString("cidadeColeta"),
                    null, // ✅ estado removido
                    rs.getString("rua"),
                    rs.getString("numero"),
                    rs.getString("bairro"),
                    rs.getString("complemento"),
                    rs.getString("cep"),
                    rs.getObject("latitude") != null ? rs.getDouble("latitude") : null,
                    rs.getObject("longitude") != null ? rs.getDouble("longitude") : null
                ),
                codCfo, cidadeColeta
            );

            if (!porCidade.isEmpty()) return porCidade.get(0);
        } catch (Exception ignored) {
            // ✅ Se a tabela/colunas não existirem no RM, cai no fallback sem explodir
        }

        // ==========================
        // 2) FALLBACK: ENDEREÇO PADRÃO DO FCFO (confirmado na sua print)
        // ==========================
        // ✅ Sem estado (nem tenta ler)
        String sqlPadrao = """
            SELECT TOP 1
                CAST(CODCFO AS VARCHAR(50)) AS codCfo,
                NOMEFANTASIA AS nomeFantasia,
                NOME AS nomeSocial,
                CIDADE AS cidadeColeta,
                RUA AS rua,
                NUMERO AS numero,
                BAIRRO AS bairro,
                COMPLEMENTO AS complemento,
                CEP AS cep
            FROM FCFO
            WHERE CODCFO = ?
        """;

        List<RmColetaDTO> padrao = rmJdbcTemplate.query(
            sqlPadrao,
            (rs, rowNum) -> new RmColetaDTO(
                rs.getString("codCfo"),
                rs.getString("nomeFantasia"),
                rs.getString("nomeSocial"),
                cidadeColeta, // ✅ mantém o código operacional solicitado
                null,          // ✅ estado removido
                rs.getString("rua"),
                rs.getString("numero"),
                rs.getString("bairro"),
                rs.getString("complemento"),
                rs.getString("cep"),
                null,
                null
            ),
            codCfo
        );

        if (padrao.isEmpty()) {
            throw new RuntimeException("Nenhum cadastro encontrado no RM para CODCFO: " + codCfo);
        }

        return padrao.get(0);
    }
}
