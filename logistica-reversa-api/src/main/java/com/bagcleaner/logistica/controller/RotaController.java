// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.CriarRotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaCriadaDTO; // ✨ ALTERAÇÃO AQUI
import com.bagcleaner.logistica.dto.RotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaResponseDTO;
import com.bagcleaner.logistica.model.Rota;
import com.bagcleaner.logistica.service.RotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    /* ✨ ALTERAÇÃO AQUI: O método agora retorna o DTO, não a entidade */
    @PostMapping
    public ResponseEntity<RotaCriadaDTO> criarRotaPlanejada(@RequestBody CriarRotaRequestDTO request) {
        Rota novaRota = rotaService.criarRotaPlanejada(request);
        
        // Converte a entidade salva para o DTO de resposta
        RotaCriadaDTO rotaDTO = RotaCriadaDTO.fromEntity(novaRota);

        // Retorna o DTO e o status HTTP 201 Created
        return new ResponseEntity<>(rotaDTO, HttpStatus.CREATED);
    }
}