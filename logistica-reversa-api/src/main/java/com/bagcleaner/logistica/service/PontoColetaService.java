package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.CriarPontoColetaRequestDTO; // ✨ ALTERAÇÃO AQUI
import com.bagcleaner.logistica.dto.PontoColetaDTO;
import com.bagcleaner.logistica.model.PontoColeta; // ✨ ALTERAÇÃO AQUI
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

    /* ✨ ALTERAÇÃO AQUI: Novo método para criar um Ponto de Coleta */
    public PontoColetaDTO criarPontoColeta(CriarPontoColetaRequestDTO dto) {
        // 1. Cria uma nova entidade PontoColeta a partir dos dados do DTO
        PontoColeta novoPontoColeta = new PontoColeta();
        novoPontoColeta.setNome(dto.getNome());
        novoPontoColeta.setEnderecoCompleto(dto.getEnderecoCompleto());
        novoPontoColeta.setContatoResponsavel(dto.getContatoResponsavel());
        novoPontoColeta.setTipoBag(dto.getTipoBag());

        // 2. Salva a nova entidade no banco de dados
        PontoColeta pontoColetaSalvo = pontoColetaRepository.save(novoPontoColeta);

        // 3. Retorna o DTO correspondente à entidade salva
        return PontoColetaDTO.fromEntity(pontoColetaSalvo);
    }
}