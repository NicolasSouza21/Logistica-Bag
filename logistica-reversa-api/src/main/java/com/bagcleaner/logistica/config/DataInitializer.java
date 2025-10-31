// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.config;

import com.bagcleaner.logistica.model.User;
import com.bagcleaner.logistica.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verifica se já existe um usuário admin para não criar duplicado
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            // IMPORTANTE: Sempre salve a senha criptografada!
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(List.of("ADMIN", "GERENTE"));

            userRepository.save(admin);
            System.out.println("🎉 Usuário 'admin' criado com sucesso! Senha: 'admin123'");
        }

        if (userRepository.findByUsername("logistica").isEmpty()) {
            User logisticaUser = new User();
            logisticaUser.setUsername("logistica");
            logisticaUser.setPassword(passwordEncoder.encode("logistica123"));
            logisticaUser.setRoles(List.of("LOGISTICA"));
            
            userRepository.save(logisticaUser);
            System.out.println("🎉 Usuário 'logistica' criado com sucesso! Senha: 'logistica123'");
        }
    }
}