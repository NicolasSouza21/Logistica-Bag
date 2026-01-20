// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

import lombok.Data;
import java.util.List;

@Data
public class RotaRequestDTO {

    /*
     * ✨ ALTERAÇÃO AQUI:
     * Aceita os dois formatos:
     * - enderecos: ["Rua X, 123 - Cidade", ...]
     * - coordenadas: ["-23.55,-46.63", ...]
     *
     * O service escolhe a melhor fonte:
     * 1) se coordenadas vier preenchido -> usa direto
     * 2) senão se enderecos vier preenchido -> faz geocoding e transforma em coordenadas
     */
    private List<String> enderecos;
    private Boolean otimizar;

    private List<String> coordenadas;
}
