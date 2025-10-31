// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.RotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaResponseDTO;
import com.bagcleaner.logistica.service.RotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rotas")
@RequiredArgsConstructor
public class RotaController {

    private final RotaService rotaService;

    @PostMapping("/calcular")
    public ResponseEntity<RotaResponseDTO> calcularRota(@RequestBody RotaRequestDTO request) {
        RotaResponseDTO resultado = rotaService.calcularRota(request);
        return ResponseEntity.ok(resultado);
    }
}