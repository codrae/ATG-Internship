package org.atg.bems.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.service.BuildingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/building")
@CrossOrigin(origins = "http://localhost:3000")
public class BuildingController {
    private final BuildingService buildingService;

    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    @GetMapping(value = "/all")
    @Operation(summary = "전체 건물 조회")
    public List<Building> getBuildings(){
        return buildingService.readAll();
    }

    @GetMapping(value = "/{buildingId}")
    @Operation(summary = "id를 통한 특정 건물 조회")
    public Building getBuilding(@PathVariable(name = "buildingId") Long buildingId){
        return buildingService.readBuildingById(buildingId);
    }

    // TODO : 현재는 읽어오는 것 밖에 생각이 나지 않지만 추가적인 요구사항이 있을 때 마다 추가할 예정
}
