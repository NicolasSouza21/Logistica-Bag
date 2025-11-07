// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

import lombok.Data;
import java.util.List;

@Data
public class RotaRequestDTO {
    /* * ✨ ALTERAÇÃO AQUI: Mudamos de 'enderecos' para 'coordenadas'.
     * Esperamos uma lista de Strings, onde cada String é "latitude,longitude"
     */
    private List<String> coordenadas;
}