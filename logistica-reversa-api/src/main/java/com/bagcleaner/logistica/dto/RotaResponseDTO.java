// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RotaResponseDTO {
    private String distanciaTotal;
    private String duracaoTotal;
}