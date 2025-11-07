// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

// import com.bagcleaner.logistica.model.PontoColeta; // ✨ ALTERAÇÃO AQUI: Não precisamos mais do Enum
import lombok.Data;
import java.util.List; // ✨ ALTERAÇÃO AQUI

@Data
public class CriarPontoColetaRequestDTO {
    private String nome;
    private String enderecoCompleto;
    private String contatoResponsavel;
    
    /* ✨ ALTERAÇÃO AQUI: Trocamos o Enum por uma Lista de Strings */
    // private PontoColeta.TipoBag tipoBag;
    private List<String> tiposBag; // O frontend enviará uma lista de nomes
}