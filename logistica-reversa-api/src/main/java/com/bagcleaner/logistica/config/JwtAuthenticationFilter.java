// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.config;

import com.bagcleaner.logistica.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // ✨ ALTERAÇÃO AQUI: Verifica se a requisição é para a API de login
        // Se for, nós pulamos o filtro e deixamos o Spring Security continuar
        // Isso permite que o usuário faça login mesmo se tiver um token expirado no header
        if (request.getServletPath().contains("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1. Pega o cabeçalho 'Authorization' da requisição
        final String authHeader = request.getHeader("Authorization");

        // 2. Se o cabeçalho não existir ou não começar com "Bearer ", passa para o próximo filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extrai o token do cabeçalho (removendo o prefixo "Bearer ")
        final String jwt = authHeader.substring(7);
        final String username; // ✨ ALTERAÇÃO AQUI: movida a declaração

        try { // ✨ ALTERAÇÃO AQUI: Adiciona um try-catch para o erro de token expirado
            username = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            // Se o token estiver expirado ou inválido, apenas continue o filtro.
            // O Spring Security vai barrar o acesso à rota protegida mais tarde.
            filterChain.doFilter(request, response);
            return;
        }


        // 4. Se temos um usuário e ele ainda não está autenticado no contexto de segurança...
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 5. Se o token for válido...
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // ...cria um objeto de autenticação e o define no contexto de segurança.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, 
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 6. Passa a requisição para o próximo filtro na cadeia
        filterChain.doFilter(request, response);
    }
}