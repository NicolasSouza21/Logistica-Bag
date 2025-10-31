// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Anotação do Lombok que cria um construtor com os campos 'final'
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca o usuário no repositório pelo nome de usuário
        return userRepository.findByUsername(username)
                // Se não encontrar, lança uma exceção padrão do Spring Security
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }
}