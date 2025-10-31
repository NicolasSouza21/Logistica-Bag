// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.repository;

import com.bagcleaner.logistica.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // O Spring Data JPA criará automaticamente a consulta SQL para este método
    // "SELECT u FROM User u WHERE u.username = ?"
    Optional<User> findByUsername(String username);
}