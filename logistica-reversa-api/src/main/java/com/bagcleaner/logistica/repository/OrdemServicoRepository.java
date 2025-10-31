// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.repository;

import com.bagcleaner.logistica.model.OrdemServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {
    // A mágica do Spring Data JPA: ele cria a query automaticamente a partir do nome do método
    List<OrdemServico> findByStatus(OrdemServico.Status status);
}