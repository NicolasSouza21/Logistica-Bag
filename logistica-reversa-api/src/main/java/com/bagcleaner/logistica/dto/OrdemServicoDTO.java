// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.dto;

import com.bagcleaner.logistica.model.OrdemServico;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map; // ✨ ALTERAÇÃO AQUI

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdemServicoDTO {
    private Long id;
    private String status;
    private String nomePontoColeta;
    private String enderecoPontoColeta;
    private int quantidadeEstimada; // ✨ ATENÇÃO: Isso agora será o TOTAL de bags

    /* ✨ ALTERAÇÃO AQUI: Adicionamos os detalhes e as coordenadas */
    private Map<String, Integer> quantidadesEstimadasMap;
    private Double latitude;
    private Double longitude;


    // Um método de fábrica estático para facilitar a conversão da Entidade para DTO
    public static OrdemServicoDTO fromEntity(OrdemServico ordem) {
        
        /* ✨ ALTERAÇÃO AQUI: Calculamos o total de bags somando os valores do Map */
        int totalEstimado = ordem.getQuantidadesEstimadas().values().stream()
                .mapToInt(Integer::intValue)
                .sum();

        /* ✨ ALTERAÇÃO AQUI: Usamos o novo construtor com todos os campos */
        return new OrdemServicoDTO(
            ordem.getId(),
            ordem.getStatus().toString(),
            ordem.getPontoColeta().getNome(),
            ordem.getPontoColeta().getEnderecoCompleto(),
            totalEstimado, // Passa o total calculado
            ordem.getQuantidadesEstimadas(), // Passa o Map detalhado
            ordem.getPontoColeta().getLatitude(), // Passa a coordenada
            ordem.getPontoColeta().getLongitude() // Passa a coordenada
        );
    }
}