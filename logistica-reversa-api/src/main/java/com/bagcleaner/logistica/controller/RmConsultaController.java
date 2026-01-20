package com.bagcleaner.logistica.controller;

import com.bagcleaner.logistica.dto.RmColetaDTO;
import com.bagcleaner.logistica.service.RmConsultaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rm")
@RequiredArgsConstructor
public class RmConsultaController {

    private final RmConsultaService rmConsultaService;

    @GetMapping("/coleta")
    public ResponseEntity<RmColetaDTO> buscarEnderecoColeta(
            @RequestParam String codCfo,
            @RequestParam String cidadeColeta
    ) {
        return ResponseEntity.ok(rmConsultaService.buscarEnderecoColeta(codCfo, cidadeColeta));
    }
}
