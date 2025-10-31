// ✨ CÓDIGO CORRIGIDO E ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

import com.bagcleaner.logistica.model.Rota;
import lombok.Data;
import lombok.NoArgsConstructor; // ✨ ADIÇÃO AQUI

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

    // Construtor para o cálculo da rota (usado no RotaService)
    public RotaResponseDTO(String distanciaTotal, String duracaoEstimada) {
        this.distanciaTotal = distanciaTotal;
        this.duracaoEstimada = duracaoEstimada;
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
        return dto;
    }
}