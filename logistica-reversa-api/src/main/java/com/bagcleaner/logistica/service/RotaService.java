// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.CriarRotaRequestDTO; // ✨ ALTERAÇÃO AQUI
import com.bagcleaner.logistica.dto.RotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaResponseDTO;
import com.bagcleaner.logistica.model.OrdemServico; // ✨ ALTERAÇÃO AQUI
import com.bagcleaner.logistica.model.Rota; // ✨ ALTERAÇÃO AQUI
import com.bagcleaner.logistica.repository.OrdemServicoRepository; // ✨ ALTERAÇÃO AQUI
import com.bagcleaner.logistica.repository.RotaRepository; // ✨ ALTERAÇÃO AQUI
import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;
import lombok.RequiredArgsConstructor; // ✨ ALTERAÇÃO AQUI
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ✨ ALTERAÇÃO AQUI

import java.time.LocalDate; // ✨ ALTERAÇÃO AQUI
import java.time.format.DateTimeFormatter; // ✨ ALTERAÇÃO AQUI
import java.util.List;

@Service
@Slf4j
/* ✨ ALTERAÇÃO AQUI: Adiciona o construtor para os novos repositórios */
@RequiredArgsConstructor
public class RotaService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    /* ✨ ALTERAÇÃO AQUI: Injeção dos repositórios necessários */
    private final RotaRepository rotaRepository;
    private final OrdemServicoRepository ordemServicoRepository;


    /* ✨ ALTERAÇÃO AQUI: Adicionado o novo método para criar e salvar a rota */
    @Transactional // Garante que todas as operações com o banco sejam executadas em uma única transação
    public Rota criarRotaPlanejada(CriarRotaRequestDTO dto) {
        // 1. Busca todas as Ordens de Serviço pelos IDs fornecidos
        List<OrdemServico> ordensParaRota = ordemServicoRepository.findAllById(dto.getOrdemIds());

        if (ordensParaRota.size() != dto.getOrdemIds().size()) {
            throw new IllegalStateException("Uma ou mais Ordens de Serviço não foram encontradas.");
        }

        // 2. Cria e configura a nova entidade Rota
        Rota novaRota = new Rota();
        
        // Gera um nome descritivo para a rota, ex: "Rota de 31/10/2025"
        String nomeRota = "Rota de " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        novaRota.setNomeRota(nomeRota);
        
        novaRota.setDistanciaTotal(dto.getDistanciaTotal());
        novaRota.setDuracaoEstimada(dto.getDuracaoEstimada());
        novaRota.setStatus(Rota.StatusRota.PLANEJADA); // Status inicial

        // 3. Atualiza cada Ordem de Serviço
        for (OrdemServico os : ordensParaRota) {
            os.setStatus(OrdemServico.Status.ALOCADA_PARA_ROTA); // Muda o status da OS
            os.setRota(novaRota); // Associa a OS à nova rota
        }

        // 4. Adiciona a lista de ordens à rota
        novaRota.setOrdensServico(ordensParaRota);

        // 5. Salva a rota. Graças ao CascadeType.ALL, as OS atualizadas também serão salvas.
        return rotaRepository.save(novaRota);
    }


    public RotaResponseDTO calcularRota(RotaRequestDTO request) {
        if (request.getEnderecos() == null || request.getEnderecos().size() < 2) {
            throw new IllegalArgumentException("É necessário fornecer pelo menos dois endereços (origem e destino).");
        }

        GeoApiContext context = new GeoApiContext.Builder().apiKey(apiKey).build();
        List<String> enderecos = request.getEnderecos();
        String origem = enderecos.get(0);
        String destino = enderecos.get(enderecos.size() - 1);
        String[] waypoints = enderecos.subList(1, enderecos.size() - 1).toArray(new String[0]);

        try {
            DirectionsResult result = DirectionsApi.newRequest(context)
                    .origin(origem)
                    .destination(destino)
                    .waypoints(waypoints)
                    .optimizeWaypoints(true)
                    .await();

            if (result.routes != null && result.routes.length > 0) {
                DirectionsRoute route = result.routes[0];
                long distanciaTotalMetros = 0;
                long duracaoTotalSegundos = 0;

                for (var leg : route.legs) {
                    distanciaTotalMetros += leg.distance.inMeters;
                    duracaoTotalSegundos += leg.duration.inSeconds;
                }

                String distanciaFormatada = String.format("%.1f km", distanciaTotalMetros / 1000.0);
                String duracaoFormatada = String.format("%d min", duracaoTotalSegundos / 60);

                return new RotaResponseDTO(distanciaFormatada, duracaoFormatada);
            }
        } catch (Exception e) {
            log.error("Erro ao calcular rota com a API do Google: {}", e.getMessage());
            throw new RuntimeException("Não foi possível calcular a rota.", e);
        } finally {
            context.shutdown();
        }

        return new RotaResponseDTO("N/A", "N/A");
    }
}