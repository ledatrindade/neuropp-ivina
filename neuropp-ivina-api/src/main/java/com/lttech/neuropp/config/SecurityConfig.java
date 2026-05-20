package com.lttech.neuropp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/*
 * Classe responsável pelas configurações de segurança da API.
 *
 * Hoje vamos deixar apenas a rota /api/health pública.
 * Depois vamos evoluir para:
 * - login;
 * - JWT;
 * - responsável;
 * - administradora;
 * - rotas protegidas.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                /*
                 * CSRF é muito usado para proteger formulários web tradicionais.
                 * Como nossa aplicação será uma API REST usando JWT futuramente,
                 * vamos deixar desabilitado por enquanto.
                 */
                .csrf(csrf -> csrf.disable())

                /*
                 * Aqui definimos quem pode acessar cada rota.
                 */
                .authorizeHttpRequests(auth -> auth

                        /*
                         * Rota pública para testar se a API está viva.
                         */
                        .requestMatchers("/api/health").permitAll()

                        /*
                         * Qualquer outra rota ainda exige autenticação.
                         */
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}