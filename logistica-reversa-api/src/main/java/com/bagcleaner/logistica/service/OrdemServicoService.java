// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.CriarOrdemServicoRequestDTO;
import com.bagcleaner.logistica.dto.OrdemServicoDTO;
import com.bagcleaner.logistica.model.OrdemServico;
import com.bagcleaner.logistica.model.PontoColeta;
import com.bagcleaner.logistica.repository.OrdemServicoRepository;
import com.bagcleaner.logistica.repository.PontoColetaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ✨ ALTERAÇÃO AQUI

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdemServicoService {

    private final OrdemServicoRepository ordemServicoRepository;
    private final PontoColetaRepository pontoColetaRepository;

    public List<OrdemServicoDTO> findByStatus(OrdemServico.Status status) {
        return ordemServicoRepository.findByStatus(status)
                .stream()
                .map(OrdemServicoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<OrdemServicoDTO> findByIds(List<Long> ids) {
        return ordemServicoRepository.findByIdInWithPontoColeta(ids)
                .stream()
                .map(OrdemServicoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /* ✨ ALTERAÇÃO AQUI: Lógica de criação atualizada */
    @Transactional
    public OrdemServicoDTO criarOrdemServico(CriarOrdemServicoRequestDTO dto) {
        PontoColeta pontoColeta = pontoColetaRepository.findById(dto.getPontoColetaId())
                .orElseThrow(() -> new RuntimeException("Ponto de Coleta não encontrado com id: " + dto.getPontoColetaId()));

        OrdemServico novaOrdem = new OrdemServico();
        novaOrdem.setPontoColeta(pontoColeta);
        
        // Remove quaisquer entradas com quantidade 0 ou nula
        dto.getQuantidadesEstimadas().values().removeIf(qtd -> qtd == null || qtd <= 0);
        
        // Salva o Map de quantidades
        novaOrdem.setQuantidadesEstimadas(dto.getQuantidadesEstimadas());
        
        novaOrdem.setStatus(OrdemServico.Status.PENDENTE);

        OrdemServico ordemSalva = ordemServicoRepository.save(novaOrdem);

        return OrdemServicoDTO.fromEntity(ordemSalva);
    }
}