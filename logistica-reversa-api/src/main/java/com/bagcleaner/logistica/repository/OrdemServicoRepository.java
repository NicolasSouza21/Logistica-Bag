// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.repository;

import com.bagcleaner.logistica.model.OrdemServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // ✨ ALTERAÇÃO AQUI
import org.springframework.data.repository.query.Param; // ✨ ALTERAÇÃO AQUI
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {
    
    List<OrdemServico> findByStatus(OrdemServico.Status status);

    /* ✨ ALTERAÇÃO AQUI: (Mantém o método que já tínhamos) */
    void deleteByPontoColetaId(Long pontoColetaId);

    /* ✨ ALTERAÇÃO AQUI: (Mantém o método que já tínhamos) */
    @Query("SELECT os FROM OrdemServico os JOIN FETCH os.pontoColeta WHERE os.id IN :ids")
    List<OrdemServico> findByIdInWithPontoColeta(@Param("ids") List<Long> ids);
}