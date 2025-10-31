// ✨ CÓD-IGO NOVO AQUI
package com.bagcleaner.logistica.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "users") // "user" é uma palavra reservada em muitos bancos de dados
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // Usaremos ElementCollection para uma lista simples de papéis (roles)
    // Para sistemas mais complexos, uma entidade @Entity separada para Role seria melhor.
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private List<String> roles;

    // Métodos da interface UserDetails implementados abaixo

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // O Spring Security espera uma coleção de GrantedAuthority.
        // Convertemos nossa lista de Strings (roles) para isso.
        // O prefixo "ROLE_" é uma convenção do Spring Security.
        return this.roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    // Para simplificar, vamos manter as contas sempre ativas.
    // Em um sistema real, você poderia ter colunas no banco para isso.
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}