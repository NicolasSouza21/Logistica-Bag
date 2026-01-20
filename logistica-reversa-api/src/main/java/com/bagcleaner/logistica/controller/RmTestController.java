package com.bagcleaner.logistica.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bagcleaner.logistica.repository.RmTestRepository;

@RestController
public class RmTestController {

    private final RmTestRepository rmTestRepository;

    public RmTestController(RmTestRepository rmTestRepository) {
        this.rmTestRepository = rmTestRepository;
    }

    @GetMapping("/api/rm/teste")
    public List<String> testar() {
        return rmTestRepository.testarConexao();
    }
}
