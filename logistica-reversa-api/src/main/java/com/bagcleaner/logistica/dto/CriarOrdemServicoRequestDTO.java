// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

import lombok.Data;
import java.util.Map; // ✨ ALTERAÇÃO AQUI

@Data
public class CriarOrdemServicoRequestDTO {
    private Long pontoColetaId;
    
    /* ✨ ALTERAÇÃO AQUI: Trocamos o int por um Map */
    // private int quantidadeEstimada;
    private Map<String, Integer> quantidadesEstimadas; // Ex: {"Bag Vermelha": 5, "Bag Lona": 3}
}