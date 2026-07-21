package com.lttech.neuropp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.bootstrap-admin")
public record BootstrapAdminProperties(
        boolean enabled,
        String name,
        String email,
        String phone,
        String password
) {
}
