// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.dto;

import com.bagcleaner.logistica.model.PontoColeta;
import lombok.Data;

@Data
public class CriarPontoColetaRequestDTO {
    private String nome;
    private String enderecoCompleto;
    private String contatoResponsavel;
    private PontoColeta.TipoBag tipoBag; // O Spring converterá a String ("PADRAO") para o Enum
}