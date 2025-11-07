// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.CriarRotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaCriadaDTO;
import com.bagcleaner.logistica.dto.RotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaResponseDTO;
import com.bagcleaner.logistica.model.Rota;
import com.bagcleaner.logistica.service.RotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // ✨ ALTERAÇÃO AQUI: Imports adicionados

import java.util.List; // ✨ ALTERAÇÃO AQUI: Import adicionado

@RestController
@RequestMapping("/api/rotas")
@RequiredArgsConstructor
public class RotaController {

    private final RotaService rotaService;

    /* ✨ ALTERAÇÃO AQUI: Novo endpoint GET para listar rotas */
    @GetMapping
    public ResponseEntity<List<RotaCriadaDTO>> listarTodasAsRotas() {
        List<RotaCriadaDTO> rotas = rotaService.listarTodasAsRotas();
        return ResponseEntity.ok(rotas);
    }

    @PostMapping("/calcular")
    public ResponseEntity<RotaResponseDTO> calcularRota(@RequestBody RotaRequestDTO request) {
        RotaResponseDTO resultado = rotaService.calcularRota(request);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<RotaCriadaDTO> criarRotaPlanejada(@RequestBody CriarRotaRequestDTO request) {
        Rota novaRota = rotaService.criarRotaPlanejada(request);
        
        // Converte a entidade salva para o DTO de resposta
        RotaCriadaDTO rotaDTO = RotaCriadaDTO.fromEntity(novaRota);

        // Retorna o DTO e o status HTTP 201 Created
        return new ResponseEntity<>(rotaDTO, HttpStatus.CREATED);
    }

    /* ✨ ALTERAÇÃO AQUI: Novo endpoint PUT para aprovar uma rota */
    @PutMapping("/{id}/aprovar")
    public ResponseEntity<RotaCriadaDTO> aprovarRota(@PathVariable Long id) {
        RotaCriadaDTO rotaAprovada = rotaService.aprovarRota(id);
        return ResponseEntity.ok(rotaAprovada);
    }
}