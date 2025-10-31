// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.LoginRequest;
import com.bagcleaner.logistica.dto.LoginResponse;
import com.bagcleaner.logistica.service.JwtService;
import com.bagcleaner.logistica.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // Nossos serviços e managers injetados via construtor pelo Lombok
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // 1. Autentica o usuário
        // O AuthenticationManager usa nosso UserDetailsService e PasswordEncoder por baixo dos panos.
        // Se as credenciais estiverem erradas, ele lançará uma exceção,
        // e o Spring retornará um erro 401 Unauthorized automaticamente.
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );

        // 2. Se a autenticação for bem-sucedida, busca os detalhes do usuário
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());

        // 3. Gera o token JWT
        final String jwt = jwtService.generateToken(userDetails);

        // 4. Retorna o token em um DTO de resposta
        return ResponseEntity.ok(new LoginResponse(jwt));
    }
}