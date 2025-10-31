package com.bagcleaner.logistica.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "pontos_coleta")
@Data
public class PontoColeta {

    /* ✨ ALTERAÇÃO AQUI: Criamos um Enum para os tipos de bag */
    public enum TipoBag {
        PADRAO,
        GRANDE,
        REFRIGERADO,
        ESPECIAL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O "Nome empresa" do seu pedido será o campo 'nome' do Ponto de Coleta
    private String nome; 
    private String enderecoCompleto;

    /* ✨ ALTERAÇÃO AQUI: Novos campos adicionados */
    private String contatoResponsavel; // Campo para "Quem procurar"

    @Enumerated(EnumType.STRING) // Garante que o texto do enum seja salvo no banco
    private TipoBag tipoBag;

    private Double latitude;
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_contratante_id")
    private ClienteContratante clienteContratante;
}