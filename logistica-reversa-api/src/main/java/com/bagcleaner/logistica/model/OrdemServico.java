// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap; // ✨ ALTERAÇÃO AQUI
import java.util.Map; // ✨ ALTERAÇÃO AQUI

@Entity
@Table(name = "ordens_servico")
@Data
public class OrdemServico {

    public enum Status {
        PENDENTE,
        ALOCADA_PARA_ROTA,
        EM_ROTA_COLETA,
        EM_MANUTENCAO,
        PRONTA_PARA_DEVOLUCAO,
        CONCLUIDA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ponto_coleta_id")
    private PontoColeta pontoColeta;

    @Enumerated(EnumType.STRING)
    private Status status;

    /* ✨ ALTERAÇÃO AQUI: Removemos os campos antigos */
    // private int quantidadeEstimada;
    // private int quantidadeRealColetada;

    /* ✨ ALTERAÇÃO AQUI: Adicionamos Maps para as quantidades por tipo */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ordem_quantidades_estimadas", joinColumns = @JoinColumn(name = "ordem_servico_id"))
    @MapKeyColumn(name = "bag_tipo") // Ex: "Bag Vermelha"
    @Column(name = "quantidade") // Ex: 5
    private Map<String, Integer> quantidadesEstimadas = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "ordem_quantidades_reais", joinColumns = @JoinColumn(name = "ordem_servico_id"))
    @MapKeyColumn(name = "bag_tipo")
    @Column(name = "quantidade")
    private Map<String, Integer> quantidadesReais = new HashMap<>();


    private LocalDateTime dataCriacao = LocalDateTime.now();
    private LocalDateTime dataConclusao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rota_id")
    @JsonBackReference 
    private Rota rota;
}