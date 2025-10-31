package com.bagcleaner.logistica.dto;

import com.bagcleaner.logistica.model.PontoColeta;
import lombok.Data;

@Data
public class PontoColetaDTO {
    private Long id;
    private String nome;
    /* ✨ ALTERAÇÃO AQUI: Novos campos adicionados ao DTO */
    private String enderecoCompleto;
    private String contatoResponsavel;
    private String tipoBag;

    // O método de fábrica agora preenche todos os campos
    public static PontoColetaDTO fromEntity(PontoColeta pontoColeta) {
        PontoColetaDTO dto = new PontoColetaDTO();
        dto.setId(pontoColeta.getId());
        dto.setNome(pontoColeta.getNome());
        /* ✨ ALTERAÇÃO AQUI: Preenchendo os novos campos */
        dto.setEnderecoCompleto(pontoColeta.getEnderecoCompleto());
        dto.setContatoResponsavel(pontoColeta.getContatoResponsavel());
        // Converte o Enum para String para enviar ao frontend
        if (pontoColeta.getTipoBag() != null) {
            dto.setTipoBag(pontoColeta.getTipoBag().toString());
        }
        return dto;
    }
}