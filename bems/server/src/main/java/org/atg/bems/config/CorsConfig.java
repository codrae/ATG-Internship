package org.atg.bems.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해 적용
                .allowedOrigins("http://localhost:3000/**")  // 3000번 포트 허용
                .allowedOrigins("http://localhost:8000/**")  // 8000번 포트 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 허용할 HTTP 메서드
                .allowedHeaders("*")  // 모든 헤더 허용
                .allowCredentials(true)  // 인증 정보 허용
                .maxAge(3600);  // preflight 캐시 시간 (1시간)
    }
}
