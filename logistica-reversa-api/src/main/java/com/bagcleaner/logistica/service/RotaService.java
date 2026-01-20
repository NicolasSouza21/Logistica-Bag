// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.CriarRotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaCriadaDTO;
import com.bagcleaner.logistica.dto.RotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaResponseDTO;
import com.bagcleaner.logistica.model.OrdemServico;
import com.bagcleaner.logistica.model.Rota;
import com.bagcleaner.logistica.repository.OrdemServicoRepository;
import com.bagcleaner.logistica.repository.RotaRepository;
import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RotaService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    private final RotaRepository rotaRepository;
    private final OrdemServicoRepository ordemServicoRepository;

    @Transactional
    public Rota criarRotaPlanejada(CriarRotaRequestDTO dto) {
        List<OrdemServico> ordensParaRota = ordemServicoRepository.findAllById(dto.getOrdemIds());
        if (ordensParaRota.size() != dto.getOrdemIds().size()) {
            throw new IllegalStateException("Uma ou mais Ordens de Serviço não foram encontradas.");
        }

        Rota novaRota = new Rota();
        String nomeRota = "Rota de " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        novaRota.setNomeRota(nomeRota);
        novaRota.setDistanciaTotal(dto.getDistanciaTotal());
        novaRota.setDuracaoEstimada(dto.getDuracaoEstimada());
        novaRota.setValorFrete(dto.getValorFrete());
        novaRota.setStatus(Rota.StatusRota.PLANEJADA);

        for (OrdemServico os : ordensParaRota) {
            os.setStatus(OrdemServico.Status.ALOCADA_PARA_ROTA);
            os.setRota(novaRota);
        }

        novaRota.setOrdensServico(ordensParaRota);
        return rotaRepository.save(novaRota);
    }

    @Transactional(readOnly = true)
    public List<RotaCriadaDTO> listarTodasAsRotas() {
        return rotaRepository.findAll()
                .stream()
                .map(RotaCriadaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public RotaCriadaDTO aprovarRota(Long rotaId) {
        Rota rota = rotaRepository.findById(rotaId)
                .orElseThrow(() -> new EntityNotFoundException("Rota não encontrada com ID: " + rotaId));

        if (rota.getStatus() != Rota.StatusRota.PLANEJADA) {
            throw new IllegalStateException("A rota só pode ser aprovada se estiver com status 'PLANEJADA'.");
        }

        rota.setStatus(Rota.StatusRota.APROVADA);
        Rota rotaAprovada = rotaRepository.save(rota);
        return RotaCriadaDTO.fromEntity(rotaAprovada);
    }

    /* ✨ ALTERAÇÃO AQUI: Método calcularRota respeitando ordem manual e suportando enderecos/coordenadas */
    @Transactional(readOnly = true)
    public RotaResponseDTO calcularRota(RotaRequestDTO request) {

        // ✨ ALTERAÇÃO AQUI: escolhe fonte de pontos (coordenadas primeiro, depois enderecos)
        List<String> pontos = null;

        if (request.getCoordenadas() != null && request.getCoordenadas().size() >= 2) {
            pontos = request.getCoordenadas();
        } else if (request.getEnderecos() != null && request.getEnderecos().size() >= 2) {
            pontos = request.getEnderecos();
        } else {
            throw new IllegalArgumentException("É necessário fornecer pelo menos duas coordenadas ou dois endereços.");
        }

        // ✨ ALTERAÇÃO AQUI: por padrão NÃO otimiza (rota manual). Se vier true, otimiza.
        boolean otimizar = request.getOtimizar() != null && request.getOtimizar();

        GeoApiContext context = new GeoApiContext.Builder()
                .apiKey(apiKey)
                .build();

        String origem = pontos.get(0);
        String destino = pontos.get(pontos.size() - 1);
        String[] waypoints = pontos.subList(1, pontos.size() - 1).toArray(new String[0]);

        try {
            DirectionsResult result = DirectionsApi.newRequest(context)
                    .origin(origem)
                    .destination(destino)
                    .waypoints(waypoints)
                    .optimizeWaypoints(otimizar) // ✅ agora respeita manual se false
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
                String polyline = route.overviewPolyline != null ? route.overviewPolyline.getEncodedPath() : null;

                return new RotaResponseDTO(distanciaFormatada, duracaoFormatada, polyline);
            }
        } catch (Exception e) {
            log.error("Erro ao calcular rota com a API do Google: {}", e.getMessage());
            throw new RuntimeException("Não foi possível calcular a rota.", e);
        } finally {
            context.shutdown();
        }

        return new RotaResponseDTO("N/A", "N/A", null);
    }
}
