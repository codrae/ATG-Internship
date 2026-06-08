package org.atg.bems.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.atg.bems.dto.llm.analysis.indicator.IndicatorAnalysisDto;
import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.postgresql.entity.AnomalyLog;
import org.atg.bems.postgresql.entity.Building;
import org.atg.bems.postgresql.entity.ElectricalConsumption;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.atg.bems.utils.CommonUtils.fromKoreanToEnglish;

@Service
@Slf4j
public class LLMService {
    private final ObjectMapper objectMapper;
    private final AnthropicChatModel chatModel;
    private final Map<String, List<Message>> conversationHistory;
    private final BuildingService buildingService;
    private final ElectricityConsumptionService consumptionService;
    private final AnomalyLogService anomalyLogService;
    private final InfluxService influxService;
    private final String indicatorAnalysisSystemPrompt = """
            {
               "buildingInfo":{
                  "name": string,
                  "type":string,
                  "area":double,
                  "address": string
               },
               "powerUsage":{
                  "currentMonth":double,
                  "previousMonth":double,
                  "changeRate":double,
                  "peakDemand":double
               },
               "estimatedBill":{
                  "basicCharge":double,
                  "usageCharge":double,
                  "totalEstimate":double
               },
               "anomalyAlerts":{
                  "count":12,
                  "timeRanges": array,
                  "maxValue":double,
                  "minValue":double
               },
               "energyIntensity":{
                  "currentMonth":double,
                  "previousMonth":double,
                  "unit":"kWh/m²"
               }
            }
            ---
            너는 지금부터 BEMS 시스템에 탑재될 에너지 사용 현황 요약 LLM이야. 앞으로 제공될 데이터를 토대로 건물별 사용 현황, 전월 대비 요금 변화량, 예상 전력 요금, 이상치 알림들 정보, 월별 원단위 값 등을 위와 같은 JSON 형태로 알려줘.
            추가적인 시스템 답변은 붙이지 말고, 오직 필요한 응답 내용만 출력해줘. 참고로 건물의 전력 요금제는 교육용(을) 고압이야.
            """;
    public LLMService(ObjectMapper objectMapper, AnthropicChatModel chatModel, BuildingService buildingService, ElectricityConsumptionService consumptionService, AnomalyLogService anomalyLogService, InfluxService influxService) {
        this.objectMapper = objectMapper;
        this.chatModel = chatModel;
        this.buildingService = buildingService;
        this.consumptionService = consumptionService;
        this.anomalyLogService = anomalyLogService;
        this.influxService = influxService;
        this.conversationHistory = new ConcurrentHashMap<>();
    }

    public IndicatorAnalysisDto getAiIndicatedResponse(String sessionId, Long buildingId, EnergyType energyType) throws JsonProcessingException {
        // 세션의 대화 기록 가져오기
        List<Message> messages = conversationHistory.computeIfAbsent(sessionId, k -> {
            ArrayList<Message> messageList = new ArrayList<>();
            messageList.add(new SystemMessage(indicatorAnalysisSystemPrompt));
            return messageList;
        });

        objectMapper.registerModule(new JavaTimeModule());

        String userMessage = "";

        //건물 정보 추가
        Building building = buildingService.readBuildingById(buildingId);
        String buildingJson = """
                ---
                건물 json 데이터
                %s
                ---
                """.formatted(objectMapper.writeValueAsString(building));
        userMessage += buildingJson + "\n";
        // 전월 전력 사용량 정보 추가
        LocalDateTime now = LocalDateTime.now();
        ElectricalConsumption electricalConsumption = consumptionService.readElectricityConsumptionByBuildingIdAndYearMonth(buildingId, now.getYear(), now.minusMonths(1).getMonth().getValue());
        String previousConsumptionJson = """
                ---
                전월 전력 사용량 json 데이터
                %s
                ---
                """.formatted(objectMapper.writeValueAsString(electricalConsumption));

        userMessage += previousConsumptionJson + "\n";
        // 이번달 전력 사용량 정보 추가
        LocalDateTime currentMonth = LocalDateTime.of(now.getYear(), now.getMonth(), 1, 0, 0);
        Double value = influxService.sumDataByPeriod(currentMonth, now, fromKoreanToEnglish(building.getName()), energyType);
        String currentConsumptionJson = """
                ---
                이번달 전력 사용량 값 : %f
                ---
                """.formatted(value);
        userMessage += currentConsumptionJson + "\n";
        //이상치 정보 추가
        List<AnomalyLog> anomalyLogs = anomalyLogService.readAllByBuilding(buildingId);

        String currentAnomalyLogsJson = """
                ---
                이상치 로그들
                %s
                ---
                """.formatted(objectMapper.writeValueAsString(anomalyLogs));
        userMessage += currentAnomalyLogsJson + "\n";
        // 사용자 메시지 추가
        messages.add(new UserMessage(userMessage));

        // Prompt 생성
        Prompt prompt = new Prompt(messages);

        try {
            // Claude API 호출
            ChatResponse response = chatModel.call(prompt);
            Generation result = response.getResult();

            // 어시스턴트 응답 저장
            messages.add(result.getOutput());
            log.info("사용자의 질문 : {}, AI 답변 : {}", userMessage, result.getOutput());

            return objectMapper.readValue(result.getOutput().getText(), IndicatorAnalysisDto.class);
        } catch (Exception e) {
            log.error("Chat error: ", e);
            throw new RuntimeException("Failed to get response from Claude", e);
        }
    }

    //세션이 종료되면 제거
    public void clearSession(String sessionId) {
        conversationHistory.remove(sessionId);
    }

    //대화 내역 가져오기
    public List<Message> getSessionHistory(String sessionId) {
        return conversationHistory.getOrDefault(sessionId, new ArrayList<>());
    }


}
