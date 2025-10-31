package com.bagcleaner.logistica.repository;

import com.bagcleaner.logistica.model.OrdemServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // ✨ ALTERAÇÃO AQUI
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {

    List<OrdemServico> findByStatus(OrdemServico.Status status);

    /* ✨ ALTERAÇÃO AQUI: Novo método para buscar múltiplas ordens por IDs */
    /**
     * Busca uma lista de Ordens de Serviço pelos seus IDs e já carrega
     * as informações do Ponto de Coleta associado em uma única consulta.
     * @param ids A lista de IDs das ordens a serem buscadas.
     * @return Uma lista de Ordens de Serviço com seus Pontos de Coleta.
     */
    @Query("SELECT os FROM OrdemServico os JOIN FETCH os.pontoColeta WHERE os.id IN :ids")
    List<OrdemServico> findByIdInWithPontoColeta(List<Long> ids);
}