package org.atg.bems.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.atg.bems.service.ClientService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/daily-bound")
    @Operation(summary = "사용자 그룹이 지정한 일별 에너지 소비 상한")
    public Double getClientDailyConsumptionBound(@RequestParam(name = "clientId") Long clientId){
        return clientService.getClientById(clientId).getDailyUsageBound();
    }

    @GetMapping("/monthly-bound")
    @Operation(summary = "사용자 그룹이 지정한 월별 에너지 소비 상한")
    public Double getClientMonthlyConsumptionBound(@RequestParam(name = "clientId") Long clientId){
        return clientService.getClientById(clientId).getMonthlyUsageBound();
    }

    @GetMapping("/target-usage")
    @Operation(summary = "사용자 그룹이 지정한 목표 에너지 사용량")
    public Double getClientTargetToe(@RequestParam(name = "clientId") Long clientId){
        return clientService.getClientById(clientId).getTargetUsage();
    }
}
