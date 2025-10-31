// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.repository;

import com.bagcleaner.logistica.model.PontoColeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PontoColetaRepository extends JpaRepository<PontoColeta, Long> {}