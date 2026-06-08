package org.atg.bems.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Controller
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/bems"); // 서버가 클라이언트에게 메시지를 전송할 때의 접두사
        registry.setApplicationDestinationPrefixes("/app"); // 서버에 메시지 발행할 때의 경로
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-socket")
                .setAllowedOriginPatterns("*") // 모든 도메인 허용
                .withSockJS() // 웹소켓 연결을 지원하지 않을 경우 SockJS로 연결
                .setDisconnectDelay(1000000)
        ;
    }

}
