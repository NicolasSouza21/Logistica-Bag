// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

import lombok.Data;
import java.util.List;

/**
 * DTO para receber os dados do frontend para a criação de uma nova Rota.
 */
@Data
public class CriarRotaRequestDTO {

    // Lista de IDs das Ordens de Serviço que farão parte desta rota.
    private List<Long> ordemIds;

    // A distância total formatada (ex: "25.7 km").
    private String distanciaTotal;

    // A duração total estimada formatada (ex: "45 min").
    private String duracaoEstimada;

    /* ✨ ALTERAÇÃO AQUI: Novo campo para receber o valor do frete */
    private Double valorFrete;
}