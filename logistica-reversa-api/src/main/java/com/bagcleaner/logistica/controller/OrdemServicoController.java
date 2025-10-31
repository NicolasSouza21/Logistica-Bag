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
/* ✨ ALTERAÇÃO AQUI: Adiciona a anotação que cria o construtor para injeção. */
@RequiredArgsConstructor
public class OrdemServicoController {

    /* ✨ ALTERAÇÃO AQUI: Declara o campo do serviço que será injetado. */
    private final OrdemServicoService ordemServicoService;

    @GetMapping
    public ResponseEntity<List<OrdemServicoDTO>> getOrdensPorStatus(
            @RequestParam("status") OrdemServico.Status status) {
        
        List<OrdemServicoDTO> ordens = ordemServicoService.findByStatus(status);
        return ResponseEntity.ok(ordens);
    }
    
    /* ✨ ALTERAÇÃO AQUI: Seu método de criação, agora funcionando. */
    @PostMapping
    public ResponseEntity<OrdemServicoDTO> criarOrdem(
            @RequestBody CriarOrdemServicoRequestDTO dto) {
        
        OrdemServicoDTO novaOrdem = ordemServicoService.criarOrdemServico(dto);
        return new ResponseEntity<>(novaOrdem, HttpStatus.CREATED);
    }
}
