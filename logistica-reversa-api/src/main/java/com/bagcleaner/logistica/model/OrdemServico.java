// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.model;

import com.fasterxml.jackson.annotation.JsonBackReference; // ✨ ALTERAÇÃO AQUI
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

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

    private int quantidadeEstimada;
    private int quantidadeRealColetada;
    private LocalDateTime dataCriacao = LocalDateTime.now();
    private LocalDateTime dataConclusao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rota_id")
    /* ✨ ALTERAÇÃO AQUI: Adiciona a anotação para quebrar a referência circular */
    @JsonBackReference 
    private Rota rota;
}