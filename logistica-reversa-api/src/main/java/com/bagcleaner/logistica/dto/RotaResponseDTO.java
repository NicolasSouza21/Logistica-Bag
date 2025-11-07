// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

import com.bagcleaner.logistica.model.Rota;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para enviar os detalhes de uma Rota (criada ou calculada) de volta para o frontend.
 */
@Data
@NoArgsConstructor // Adiciona um construtor sem argumentos
public class RotaResponseDTO {
    // Campos para a resposta da CRIAÇÃO de uma rota
    private Long id;
    private String nomeRota;
    private String status;
    private int totalOrdens;

    // Campos para a resposta do CÁLCULO de uma rota
    private String distanciaTotal;
    private String duracaoEstimada; // Nome corrigido para consistência
    
    /* ✨ ALTERAÇÃO AQUI: Novo campo para a rota desenhável (polyline) */
    private String polyline;

    // Construtor para o cálculo da rota (usado no RotaService)
    /* ✨ ALTERAÇÃO AQUI: Construtor atualizado para incluir a polyline */
    public RotaResponseDTO(String distanciaTotal, String duracaoEstimada, String polyline) {
        this.distanciaTotal = distanciaTotal;
        this.duracaoEstimada = duracaoEstimada;
        this.polyline = polyline;
    }

    // Método de fábrica para converter a entidade Rota para este DTO após a criação
    public static RotaResponseDTO fromEntity(Rota rota) {
        RotaResponseDTO dto = new RotaResponseDTO();
        dto.setId(rota.getId());
        dto.setNomeRota(rota.getNomeRota());
        dto.setDistanciaTotal(rota.getDistanciaTotal());
        dto.setDuracaoEstimada(rota.getDuracaoEstimada());
        dto.setStatus(rota.getStatus().toString());
        dto.setTotalOrdens(rota.getOrdensServico() != null ? rota.getOrdensServico().size() : 0);
        // Note: A polyline não é salva no banco, ela só existe no momento do cálculo.
        return dto;
    }
}