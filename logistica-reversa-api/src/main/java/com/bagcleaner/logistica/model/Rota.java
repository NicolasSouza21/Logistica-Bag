// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.model;

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

    private String nomeRota; // Ex: "Rota Leste - 31/10/2025"
    private String distanciaTotal;
    private String duracaoEstimada;

    @Enumerated(EnumType.STRING)
    private StatusRota status;
    
    private LocalDateTime dataCriacao = LocalDateTime.now();

    // Uma Rota tem muitas Ordens de Serviço
    @OneToMany(mappedBy = "rota", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrdemServico> ordensServico = new ArrayList<>();
}