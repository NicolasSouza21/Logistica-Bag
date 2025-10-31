// ✨ CÓDIGO NOVO AQUI
package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.RotaRequestDTO;
import com.bagcleaner.logistica.dto.RotaResponseDTO;
import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j // Adiciona um logger para depuração
public class RotaService {

    @Value("${google.maps.api.key}")
    private String apiKey;

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
                    .optimizeWaypoints(true) // Tenta reordenar os waypoints para a rota mais eficiente!
                    .await();

            if (result.routes != null && result.routes.length > 0) {
                DirectionsRoute route = result.routes[0];
                long distanciaTotalMetros = 0;
                long duracaoTotalSegundos = 0;

                // Soma a distância e duração de cada "perna" da rota
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