// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.dto;

import lombok.Data;
import java.util.List;

@Data
public class RotaRequestDTO {
    // Esperamos receber uma lista de endereços do frontend
    private List<String> enderecos;
}