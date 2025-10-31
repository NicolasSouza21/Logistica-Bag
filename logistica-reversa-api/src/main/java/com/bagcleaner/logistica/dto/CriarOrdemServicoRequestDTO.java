// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.dto;

import lombok.Data;

@Data
public class CriarOrdemServicoRequestDTO {
    private Long pontoColetaId;
    private int quantidadeEstimada;
}