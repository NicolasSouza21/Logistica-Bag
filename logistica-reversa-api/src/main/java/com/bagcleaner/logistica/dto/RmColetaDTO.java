package com.bagcleaner.logistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RmColetaDTO {
    private String codCfo;
    private String nomeFantasia;
    private String nomeSocial;

    private String cidadeColeta;
    private String estado;

    private String rua;
    private String numero;
    private String bairro;
    private String complemento;
    private String cep;

    private Double latitude;
    private Double longitude;
}
