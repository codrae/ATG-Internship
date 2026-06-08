package org.atg.bems.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import org.atg.bems.dto.llm.analysis.indicator.IndicatorAnalysisDto;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.service.LLMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    private final LLMService llmService;

    @Autowired
    public ChatController(LLMService llmService) {
        this.llmService = llmService;
    }

    @GetMapping(value = "/ai/generate", produces = "application/json")
    @Operation(summary = "LLM을 활용한 건물 지표 분석")
    public IndicatorAnalysisDto generate(@RequestParam("building-id") Long buildingId, @RequestParam("energy-type") EnergyType energyType, HttpSession session) throws JsonProcessingException {
        return llmService.getAiIndicatedResponse(session.getId(), buildingId, energyType);
    }
}