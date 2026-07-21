package com.lttech.neuropp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Clock;
import java.time.ZoneId;

@Configuration
public class ApplicationConfig {

    @Bean
    public PasswordEncoder passwordEncoder(AppSecurityProperties properties) {
        return new BCryptPasswordEncoder(properties.bcryptStrength());
    }

    @Bean
    public Clock applicationClock(@Value("${app.time-zone:America/Recife}") String timeZone) {
        return Clock.system(ZoneId.of(timeZone));
    }
}
