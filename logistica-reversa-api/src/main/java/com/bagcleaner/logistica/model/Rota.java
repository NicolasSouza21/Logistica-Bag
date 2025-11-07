// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rotas")
@Data
public class Rota {
    public enum StatusRota {
        PLANEJADA,
        APROVADA, // ✨ ALTERAÇÃO AQUI: Novo status para o fluxo de aprovação
        EM_ANDAMENTO,
        CONCLUIDA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeRota;
    private String distanciaTotal;
    private String duracaoEstimada;

    /* ✨ ALTERAÇÃO AQUI: Campo para armazenar o valor do frete */
    private Double valorFrete;

    @Enumerated(EnumType.STRING)
    private StatusRota status;
    
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @OneToMany(mappedBy = "rota", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<OrdemServico> ordensServico = new ArrayList<>();
}