// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.dto;

import com.bagcleaner.logistica.model.Rota;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RotaCriadaDTO {

    private Long id;
    private String nomeRota;
    private String status;
    private LocalDateTime dataCriacao;
    private int totalOrdensServico;

    // Método de fábrica para converter a entidade Rota para este DTO
    public static RotaCriadaDTO fromEntity(Rota rota) {
        RotaCriadaDTO dto = new RotaCriadaDTO();
        dto.setId(rota.getId());
        dto.setNomeRota(rota.getNomeRota());
        dto.setStatus(rota.getStatus().toString());
        dto.setDataCriacao(rota.getDataCriacao());
        dto.setTotalOrdensServico(rota.getOrdensServico() != null ? rota.getOrdensServico().size() : 0);
        return dto;
    }
}