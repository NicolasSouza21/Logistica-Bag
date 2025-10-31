// ✨ CÓDIGO CORRIGIDO AQUI
package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.CriarOrdemServicoRequestDTO;
import com.bagcleaner.logistica.dto.OrdemServicoDTO;
import com.bagcleaner.logistica.model.OrdemServico;
import com.bagcleaner.logistica.service.OrdemServicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordens-servico")
@RequiredArgsConstructor
public class OrdemServicoController {

    private final OrdemServicoService ordemServicoService;
    
    // ✨ ALTERAÇÃO AQUI: A injeção direta do repositório foi removida para seguir as boas práticas.

    @GetMapping
    public ResponseEntity<List<OrdemServicoDTO>> getOrdensPorStatus(
            @RequestParam("status") OrdemServico.Status status) {
        
        List<OrdemServicoDTO> ordens = ordemServicoService.findByStatus(status);
        return ResponseEntity.ok(ordens);
    }
    
    @PostMapping
    public ResponseEntity<OrdemServicoDTO> criarOrdem(
            @RequestBody CriarOrdemServicoRequestDTO dto) {
        
        OrdemServicoDTO novaOrdem = ordemServicoService.criarOrdemServico(dto);
        return new ResponseEntity<>(novaOrdem, HttpStatus.CREATED);
    }

    /* ✨ ALTERAÇÃO AQUI: O método agora chama a camada de Serviço. */
    /**
     * Endpoint para buscar os detalhes completos de múltiplas ordens de serviço.
     * @param ids A lista de Longs representando os IDs das ordens.
     * @return Uma lista de OrdemServicoDTO.
     */
    @PostMapping("/by-ids")
    public ResponseEntity<List<OrdemServicoDTO>> getOrdensByIds(@RequestBody List<Long> ids) {
        // A lógica agora é delegada para o OrdemServicoService, mantendo o controller limpo.
        List<OrdemServicoDTO> dtos = ordemServicoService.findByIds(ids);
        return ResponseEntity.ok(dtos);
    }
}