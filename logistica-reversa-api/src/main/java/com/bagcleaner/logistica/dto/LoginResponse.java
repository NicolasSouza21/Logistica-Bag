// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para enviar o token JWT de volta ao cliente após a autenticação.
 * @Data gera getters, setters, etc.
 * @AllArgsConstructor gera um construtor com todos os campos (útil para criar a resposta).
 * @NoArgsConstructor gera um construtor vazio (boa prática).
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
}