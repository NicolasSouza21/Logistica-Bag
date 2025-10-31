package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.CriarPontoColetaRequestDTO; // ✨ ALTERAÇÃO AQUI
import com.bagcleaner.logistica.dto.PontoColetaDTO;
import com.bagcleaner.logistica.service.PontoColetaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // ✨ ALTERAÇÃO AQUI
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // ✨ ALTERAÇÃO AQUI

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

    /* ✨ ALTERAÇÃO AQUI: Novo endpoint para criar um Ponto de Coleta */
    @PostMapping
    public ResponseEntity<PontoColetaDTO> criarPontoColeta(@RequestBody CriarPontoColetaRequestDTO dto) {
        PontoColetaDTO novoPontoColeta = pontoColetaService.criarPontoColeta(dto);
        // Retorna o objeto criado e o status 201 Created
        return new ResponseEntity<>(novoPontoColeta, HttpStatus.CREATED);
    }
}