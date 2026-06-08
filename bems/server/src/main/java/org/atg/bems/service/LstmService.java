package org.atg.bems.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Slf4j
public class LstmService {
    private final RestClient restClient = RestClient.create();
    @Getter
    public static AtomicBoolean isRetraining = new AtomicBoolean(false);

    public void sendEvent(String building, String energy_type) {

        try {
            isRetraining.set(true); // 재학습 시작

            restClient.get()
                    .uri("http://127.0.0.1:8000/retrain/" + building + "/" + energy_type) // TODO : 실제 주소로 변경 필요
                    .retrieve();
            log.info("Event sent successfully");

            isRetraining.set(false); // 재학습 종료

        } catch (Exception e) {
            log.error("Failed to send event", e);
        }

    }
}
