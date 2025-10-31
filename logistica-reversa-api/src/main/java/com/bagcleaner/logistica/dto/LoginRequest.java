// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.dto;

import lombok.Data;

/**
 * DTO para receber as credenciais de login do cliente.
 * A anotação @Data do Lombok gera getters, setters, toString(), etc.
 */
@Data
public class LoginRequest {
    private String username;
    private String password;
}