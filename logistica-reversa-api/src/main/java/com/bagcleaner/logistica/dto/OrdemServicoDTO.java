// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.dto;

import com.bagcleaner.logistica.model.OrdemServico;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdemServicoDTO {
    private Long id;
    private String status;
    private String nomePontoColeta;
    private String enderecoPontoColeta;
    private int quantidadeEstimada;

    // Um método de fábrica estático para facilitar a conversão da Entidade para DTO
    public static OrdemServicoDTO fromEntity(OrdemServico ordem) {
        return new OrdemServicoDTO(
            ordem.getId(),
            ordem.getStatus().toString(),
            ordem.getPontoColeta().getNome(),
            ordem.getPontoColeta().getEnderecoCompleto(),
            ordem.getQuantidadeEstimada()
        );
    }
}