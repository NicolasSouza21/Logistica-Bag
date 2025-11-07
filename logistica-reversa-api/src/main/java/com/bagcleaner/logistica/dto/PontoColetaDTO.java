// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

import com.bagcleaner.logistica.model.PontoColeta;
import lombok.Data;
import java.util.List; // ✨ ALTERAÇÃO AQUI

@Data
public class PontoColetaDTO {
    private Long id;
    private String nome;
    private String enderecoCompleto;
    private String contatoResponsavel;
    
    /* ✨ ALTERAÇÃO AQUI: Trocamos o campo para refletir a nova entidade */
    // private String tipoBag;
    private List<String> tiposBag; // Agora é uma lista de strings

    // O método de fábrica agora preenche todos os campos
    public static PontoColetaDTO fromEntity(PontoColeta pontoColeta) {
        PontoColetaDTO dto = new PontoColetaDTO();
        dto.setId(pontoColeta.getId());
        dto.setNome(pontoColeta.getNome());
        dto.setEnderecoCompleto(pontoColeta.getEnderecoCompleto());
        dto.setContatoResponsavel(pontoColeta.getContatoResponsavel());

        /* ✨ ALTERAÇÃO AQUI: Copiamos a lista da entidade para o DTO */
        // if (pontoColeta.getTipoBag() != null) {
        //     dto.setTipoBag(pontoColeta.getTipoBag().toString());
        // }
        dto.setTiposBag(pontoColeta.getTiposBag()); // Copia a lista de nomes

        return dto;
    }
}