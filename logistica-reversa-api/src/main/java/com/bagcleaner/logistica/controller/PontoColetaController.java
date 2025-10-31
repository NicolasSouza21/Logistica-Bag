// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.PontoColetaDTO;
import com.bagcleaner.logistica.service.PontoColetaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}