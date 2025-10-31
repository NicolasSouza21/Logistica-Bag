// ✨ CÓDIGO CORRIGIDO/NOVO AQUI
package com.bagcleaner.logistica.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "clientes_contratantes")
@Data
public class ClienteContratante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cnpj;
    private String enderecoDevolucao; // Endereço para onde os bags limpos retornam
}