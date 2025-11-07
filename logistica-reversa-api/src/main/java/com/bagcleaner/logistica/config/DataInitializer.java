// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.config;

import com.bagcleaner.logistica.model.User;
import com.bagcleaner.logistica.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional; // ✨ ALTERAÇÃO AQUI

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        /* ✨ ALTERAÇÃO AQUI: Lógica de "Find-or-Create" e SEMPRE atualiza as roles */
        User admin = userRepository.findByUsername("admin")
                .orElse(new User()); // Se não achar, cria um novo

        admin.setUsername("admin");
        // Se for um usuário novo, define a senha
        if (admin.getId() == null) {
            admin.setPassword(passwordEncoder.encode("admin123"));
            System.out.println("🎉 Usuário 'admin' criado com sucesso! Senha: 'admin123'");
        }
        // SEMPRE atualiza as roles para garantir que estão corretas
        admin.setRoles(List.of("ADMIN", "GERENTE"));
        userRepository.save(admin);
        System.out.println("✅ Permissões do usuário 'admin' atualizadas.");


        /* ✨ ALTERAÇÃO AQUI: Lógica de "Find-or-Create" e SEMPRE atualiza as roles */
        User logisticaUser = userRepository.findByUsername("logistica")
                .orElse(new User()); // Se não achar, cria um novo
        
        logisticaUser.setUsername("logistica");
        if (logisticaUser.getId() == null) {
            logisticaUser.setPassword(passwordEncoder.encode("logistica123"));
            System.out.println("🎉 Usuário 'logistica' criado com sucesso! Senha: 'logistica123'");
        }
        // SEMPRE atualiza as roles
        logisticaUser.setRoles(List.of("LOGISTICA"));
        userRepository.save(logisticaUser);
        System.out.println("✅ Permissões do usuário 'logistica' atualizadas.");
    }
}