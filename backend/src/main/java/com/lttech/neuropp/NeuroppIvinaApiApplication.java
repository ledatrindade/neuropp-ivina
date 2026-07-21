package com.lttech.neuropp;

import com.lttech.neuropp.config.AppSecurityProperties;
import com.lttech.neuropp.config.BootstrapAdminProperties;
import com.lttech.neuropp.config.CorsProperties;
import com.lttech.neuropp.config.JwtProperties;
import com.lttech.neuropp.config.RateLimitProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties({
        JwtProperties.class,
        CorsProperties.class,
        BootstrapAdminProperties.class,
        RateLimitProperties.class,
        AppSecurityProperties.class
})
public class NeuroppIvinaApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(NeuroppIvinaApiApplication.class, args);
    }
}
