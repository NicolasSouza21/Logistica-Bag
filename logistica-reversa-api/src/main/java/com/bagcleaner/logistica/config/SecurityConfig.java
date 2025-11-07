// ✨ CÓDIGO ATUALIZADO AQUI (REATIVANDO A SEGURANÇA)
package com.bagcleaner.logistica.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider; // ✨ ALTERAÇÃO AQUI
import org.springframework.security.authentication.dao.DaoAuthenticationProvider; // ✨ ALTERAÇÃO AQUI
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // ✨ ALTERAÇÃO AQUI
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // ✨ ALTERAÇÃO AQUI
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService; // ✨ ALTERAÇÃO AQUI
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // ✨ ALTERAÇÃO AQUI
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity // ✨ ALTERAÇÃO AQUI: Ativa as anotações como @PreAuthorize
public class SecurityConfig {

    /* ✨ ALTERAÇÃO AQUI: Trazendo o filtro e o service de volta */
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            /* ✨ ALTERAÇÃO AQUI: Reativando as regras de segurança */
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/**").permitAll() // Libera o login
                .anyRequest().authenticated() // Protege todo o resto
            )
            
            /* ✨ ALTERAÇÃO AQUI: Reconectando nossos provedores e filtros */
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /* ✨ ALTERAÇÃO AQUI: Trazendo o AuthenticationProvider de volta */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    /* ✨ ALTERAÇÃO AQUI: Trazendo o AuthenticationManager de volta (CORRIGE O ERRO) */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}