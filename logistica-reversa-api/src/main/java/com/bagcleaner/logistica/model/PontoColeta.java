// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList; // ✨ ALTERAÇÃO AQUI
import java.util.List; // ✨ ALTERAÇÃO AQUI

@Entity
@Table(name = "pontos_coleta")
@Data
public class PontoColeta {

    /* ✨ ALTERAÇÃO AQUI: Removemos o Enum TipoBag */
    // public enum TipoBag { ... }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome; 
    private String enderecoCompleto;
    private String contatoResponsavel;

    /* ✨ ALTERAÇÃO AQUI: Removemos o campo antigo */
    // @Enumerated(EnumType.STRING)
    // private TipoBag tipoBag;
    
    /* ✨ ALTERAÇÃO AQUI: Adicionamos um ElementCollection */
    /**
     * Armazena uma lista de nomes de bags customizados para este ponto.
     * O JPA criará uma tabela separada (ex: ponto_coleta_tipos_bag)
     * para vincular o ID do PontoColeta a uma lista de Strings.
     */
    @ElementCollection(fetch = FetchType.EAGER) // EAGER para carregar a lista junto com o Ponto
    @CollectionTable(name = "ponto_coleta_tipos_bag", joinColumns = @JoinColumn(name = "ponto_coleta_id"))
    @Column(name = "tipo_bag_nome") // Nome da coluna que vai guardar o nome do bag
    private List<String> tiposBag = new ArrayList<>();


    private Double latitude;
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_contratante_id")
    private ClienteContratante clienteContratante;
}