// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.CriarPontoColetaRequestDTO;
import com.bagcleaner.logistica.dto.PontoColetaDTO;
import com.bagcleaner.logistica.service.PontoColetaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pontos-coleta")
@RequiredArgsConstructor
public class PontoColetaController {

    private final PontoColetaService pontoColetaService;

    @GetMapping
    public ResponseEntity<List<PontoColetaDTO>> listarTodos() {
        return ResponseEntity.ok(pontoColetaService.findAll());
    }

    @PostMapping
    public ResponseEntity<PontoColetaDTO> criarPontoColeta(@RequestBody CriarPontoColetaRequestDTO dto) {
        PontoColetaDTO novoPontoColeta = pontoColetaService.criarPontoColeta(dto);
        return new ResponseEntity<>(novoPontoColeta, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PontoColetaDTO> atualizarPontoColeta(
            @PathVariable Long id,
            @RequestBody CriarPontoColetaRequestDTO dto) {
        
        PontoColetaDTO pontoAtualizado = pontoColetaService.updatePontoColeta(id, dto);
        return ResponseEntity.ok(pontoAtualizado);
    }

    /* ✨ ALTERAÇÃO AQUI: Mudamos de 'hasRole' para 'hasAuthority' */
    // Isso é mais explícito e checa a string "ROLE_ADMIN" exata.
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPontoColeta(@PathVariable Long id) {
        pontoColetaService.deletePontoColeta(id);
        return ResponseEntity.noContent().build();
    }
}