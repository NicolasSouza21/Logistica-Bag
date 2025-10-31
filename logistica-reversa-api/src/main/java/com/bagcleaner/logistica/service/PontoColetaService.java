// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.PontoColetaDTO;
import com.bagcleaner.logistica.repository.PontoColetaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PontoColetaService {

    private final PontoColetaRepository pontoColetaRepository;

    public List<PontoColetaDTO> findAll() {
        return pontoColetaRepository.findAll().stream()
                .map(PontoColetaDTO::fromEntity)
                .collect(Collectors.toList());
    }
}