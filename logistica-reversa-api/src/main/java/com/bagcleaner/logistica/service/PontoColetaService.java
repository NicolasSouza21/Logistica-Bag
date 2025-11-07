// ✨ CÓDIGO ATUALIZADO AQUI
package com.bagcleaner.logistica.service;

import com.bagcleaner.logistica.dto.CriarPontoColetaRequestDTO;
import com.bagcleaner.logistica.dto.PontoColetaDTO;
import com.bagcleaner.logistica.model.PontoColeta;
import com.bagcleaner.logistica.repository.OrdemServicoRepository;
import com.bagcleaner.logistica.repository.PontoColetaRepository;
import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PontoColetaService {

    private final PontoColetaRepository pontoColetaRepository;
    private final OrdemServicoRepository ordemServicoRepository;

    @Value("${google.maps.api.key}")
    private String apiKey;

    @Transactional(readOnly = true)
    public List<PontoColetaDTO> findAll() {
        return pontoColetaRepository.findAll().stream()
                .map(PontoColetaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PontoColetaDTO criarPontoColeta(CriarPontoColetaRequestDTO dto) {
        PontoColeta novoPontoColeta = new PontoColeta();
        novoPontoColeta.setNome(dto.getNome());
        novoPontoColeta.setEnderecoCompleto(dto.getEnderecoCompleto());
        novoPontoColeta.setContatoResponsavel(dto.getContatoResponsavel());
        
        /* ✨ ALTERAÇÃO AQUI: Trocamos "setTipoBag" por "setTiposBag" */
        novoPontoColeta.setTiposBag(dto.getTiposBag()); // Agora ele salva a lista

        LatLng newCoords = getGeocoding(dto.getEnderecoCompleto());
        if (newCoords != null) {
            novoPontoColeta.setLatitude(newCoords.lat);
            novoPontoColeta.setLongitude(newCoords.lng);
        }

        PontoColeta pontoColetaSalvo = pontoColetaRepository.save(novoPontoColeta);
        return PontoColetaDTO.fromEntity(pontoColetaSalvo);
    }

    @Transactional
    public PontoColetaDTO updatePontoColeta(Long id, CriarPontoColetaRequestDTO dto) {
        PontoColeta pontoExistente = pontoColetaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ponto de Coleta não encontrado com ID: " + id));

        if (dto.getEnderecoCompleto() != null && !dto.getEnderecoCompleto().equals(pontoExistente.getEnderecoCompleto())) {
            log.info("Endereço alterado para o Ponto ID {}. Recalculando coordenadas...", id);
            LatLng newCoords = getGeocoding(dto.getEnderecoCompleto());
            if (newCoords != null) {
                pontoExistente.setLatitude(newCoords.lat);
                pontoExistente.setLongitude(newCoords.lng);
            }
            pontoExistente.setEnderecoCompleto(dto.getEnderecoCompleto());
        }

        pontoExistente.setNome(dto.getNome());
        pontoExistente.setContatoResponsavel(dto.getContatoResponsavel());
        
        /* ✨ ALTERAÇÃO AQUI: Trocamos "setTipoBag" por "setTiposBag" */
        pontoExistente.setTiposBag(dto.getTiposBag()); // Agora ele atualiza a lista

        PontoColeta pontoSalvo = pontoColetaRepository.save(pontoExistente);
        return PontoColetaDTO.fromEntity(pontoSalvo);
    }

    @Transactional
    public void deletePontoColeta(Long id) {
        if (!pontoColetaRepository.existsById(id)) {
            throw new EntityNotFoundException("Ponto de Coleta não encontrado com ID: " + id);
        }
        ordemServicoRepository.deleteByPontoColetaId(id);
        pontoColetaRepository.deleteById(id);
    }

    private LatLng getGeocoding(String endereco) {
        GeoApiContext context = new GeoApiContext.Builder().apiKey(apiKey).build();
        try {
            GeocodingResult[] results = GeocodingApi.geocode(context, endereco).await();
            if (results != null && results.length > 0) {
                LatLng location = results[0].geometry.location;
                log.info("Geocoding bem-sucedido para '{}': {},{}", endereco, location.lat, location.lng);
                return location;
            } else {
                log.warn("Geocoding não encontrou resultados para o endereço: {}", endereco);
            }
        } catch (Exception e) {
            log.error("Erro ao fazer geocoding do endereço: {}", e.getMessage());
        } finally {
            context.shutdown();
        }
        return null;
    }
}