// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.model;

import com.fasterxml.jackson.annotation.JsonManagedReference; // ✨ ALTERAÇÃO AQUI
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
        EM_ANDAMENTO,
        CONCLUIDA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeRota;
    private String distanciaTotal;
    private String duracaoEstimada;

    @Enumerated(EnumType.STRING)
    private StatusRota status;
    
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @OneToMany(mappedBy = "rota", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    /* ✨ ALTERAÇÃO AQUI: Adiciona a anotação para gerenciar a referência circular */
    @JsonManagedReference
    private List<OrdemServico> ordensServico = new ArrayList<>();
}