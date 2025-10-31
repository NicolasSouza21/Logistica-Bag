package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.CriarOrdemServicoRequestDTO;
import com.bagcleaner.logistica.dto.OrdemServicoDTO;
import com.bagcleaner.logistica.model.OrdemServico;
import com.bagcleaner.logistica.model.PontoColeta;
import com.bagcleaner.logistica.repository.OrdemServicoRepository;
import com.bagcleaner.logistica.repository.PontoColetaRepository; // ✨ ALTERAÇÃO AQUI: Importação necessária
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdemServicoService {

    private final OrdemServicoRepository ordemServicoRepository;
    /* ✨ ALTERAÇÃO AQUI: Injeção do PontoColetaRepository */
    private final PontoColetaRepository pontoColetaRepository;

    public List<OrdemServicoDTO> findByStatus(OrdemServico.Status status) {
        return ordemServicoRepository.findByStatus(status)
                .stream()
                .map(OrdemServicoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /* ✨ ALTERAÇÃO AQUI: Método criarOrdemServico corrigido */
    public OrdemServicoDTO criarOrdemServico(CriarOrdemServicoRequestDTO dto) {
        // 1. Busca a entidade PontoColeta com base no ID recebido
        PontoColeta pontoColeta = pontoColetaRepository.findById(dto.getPontoColetaId())
                .orElseThrow(() -> new RuntimeException("Ponto de Coleta não encontrado com id: " + dto.getPontoColetaId()));

        // 2. Cria a nova entidade OrdemServico
        OrdemServico novaOrdem = new OrdemServico();
        novaOrdem.setPontoColeta(pontoColeta);
        novaOrdem.setQuantidadeEstimada(dto.getQuantidadeEstimada());
        novaOrdem.setStatus(OrdemServico.Status.PENDENTE); // Status inicial é sempre PENDENTE

        // 3. Salva a nova ordem no banco USANDO O REPOSITÓRIO CORRETO
        OrdemServico ordemSalva = ordemServicoRepository.save(novaOrdem);

        // 4. Retorna o DTO da ordem recém-criada
        return OrdemServicoDTO.fromEntity(ordemSalva);
    }
}