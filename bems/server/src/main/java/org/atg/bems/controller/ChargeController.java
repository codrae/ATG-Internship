package org.atg.bems.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.atg.bems.service.ChargeService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import static org.atg.bems.utils.CommonUtils.fromUrlBuildingNameToEnglish;

@RestController
@RequestMapping("/charge")
@CrossOrigin(origins = "http://localhost:3000")
public class ChargeController {
    private final ChargeService chargeService;

    public ChargeController(ChargeService chargeService) {
        this.chargeService = chargeService;
    }

    @GetMapping(value = "/{building}")
    @Operation(summary = "특정 건물 - 월별 or 당월 금일까지 건물 요금 데이터 생성")
    public double calculateCharge(@PathVariable(name = "building") String building, @RequestParam int year, @RequestParam int month, @RequestParam(required = false, defaultValue = "0") int date){
        return chargeService.calculateChargePerMonth(fromUrlBuildingNameToEnglish(building), year, month, date);
    }

    @GetMapping(value = "/total")
    @Operation(summary = "전체 건물 - 월별 or 당월 금일까지 건물의 요금 데이터 생성")
    public double calculateCharge(@RequestParam int year, @RequestParam int month, @RequestParam(required = false, defaultValue = "0") int date){
        return chargeService.calculateTotalCharge(year, month, date);
    }

    @GetMapping(value = "/{building}/today")
    @Operation(summary = "특정 건물 - 당일에 현재 시간까지 사용한 하루치 금액 데이터 반환")
    public double calculateTodayCharge(@PathVariable(name = "building") String building){
        return chargeService.calculateChargePerDate(LocalDateTime.now(), building);
    }

    @GetMapping(value = "/{building}/past")
    @Operation(summary = "특정 건물 - 과거 날짜에 현재 시간까지 사용한 하루치 금액 데이터 반환")
    public double calculatePastCharge(@PathVariable(name = "building") String building, @RequestParam LocalDateTime past){
        return chargeService.calculateChargePerDate(past, building);
    }

    @GetMapping(value = "/past")
    @Operation(summary = "전체 건물 - 과거 날짜에 현재 시간까지 사용한 하루치 금액 데이터 반환")
    public double calculatePastChargeTotal(@PathVariable(name = "building") String building, @RequestParam LocalDateTime past){
        return chargeService.calculateChargePerDate(past);
    }

    @GetMapping(value = "/today")
    @Operation(summary = "전체 건물 - 당일에 현재 시간까지 사용한 금액 데이터 반환")
    public double calculateTodayCharge(){
        return chargeService.calculateChargePerDate(LocalDateTime.now());
    }

    @GetMapping(value = "/{building}/date")
    @Operation(summary = "특정 건물 - 특정 일에 사용한 금액 데이터 반환")
    public double calculateTargetDateCharge(@PathVariable(name = "building") String building){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime targetDate = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), 23, 59);
        return chargeService.calculateChargePerDate(targetDate, building);
    }

    @GetMapping(value = "/date")
    @Operation(summary = "전체 건물 - 특정 일에 사용한 금액 데이터 반환")
    public double calculateTargetDateChargeTotal(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime targetDate = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), 23, 59);
        return chargeService.calculateChargePerDate(targetDate);
    }
}
