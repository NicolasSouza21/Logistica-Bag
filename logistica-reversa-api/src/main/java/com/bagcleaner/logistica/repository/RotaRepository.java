// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.repository;

import com.bagcleaner.logistica.model.Rota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RotaRepository extends JpaRepository<Rota, Long> {
    // O Spring Data JPA fornecerá as implementações para os métodos CRUD básicos
    // (findAll, findById, save, delete, etc.) automaticamente.
}