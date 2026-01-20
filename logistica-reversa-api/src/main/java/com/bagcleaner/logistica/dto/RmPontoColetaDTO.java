package com.bagcleaner.logistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RmPontoColetaDTO {
    private String codCfo;
    private String nome;
    private String cidade;
    private String uf;
    private String cep;
    private String endereco;
    private String numero;
    private String bairro;
    private String complemento;

    // se o RM tiver coordenadas, ótimo. Se não, fica null.
    private Double latitude;
    private Double longitude;
}
