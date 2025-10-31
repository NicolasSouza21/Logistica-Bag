// ✨ CÓDIGO CORRIGIDO/NOVO AQUI
package com.bagcleaner.logistica.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordens_servico")
@Data
public class OrdemServico {

    // Enum para controlar os status da Ordem de Serviço
    public enum Status {
        PENDENTE,
        EM_ROTA_COLETA,
        EM_MANUTENCAO,
        PRONTA_PARA_DEVOLUCAO,
        CONCLUIDA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Muitas ordens para UM ponto de coleta
    @JoinColumn(name = "ponto_coleta_id")
    private PontoColeta pontoColeta;

    @Enumerated(EnumType.STRING) // ⚠️ Boa prática: Salva o NOME do status no banco, não o número
    private Status status;

    private int quantidadeEstimada;
    private int quantidadeRealColetada;
    private LocalDateTime dataCriacao = LocalDateTime.now();
    private LocalDateTime dataConclusao;
}