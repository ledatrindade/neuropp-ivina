package com.lttech.neuropp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/*
 * Configuração temporária de segurança.
 *
 * Nesta fase inicial, estamos apenas testando as rotas da API.
 * Por isso, todas as rotas estão liberadas temporariamente.
 *
 * Depois vamos proteger:
 * - rotas do responsável;
 * - rotas da admin Ivina;
 * - documentos privados;
 * - agendamentos.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        System.out.println(">>> SecurityConfig personalizada carregada");

        http
                /*
                 * Desabilita CSRF para evitar erro 403 nos métodos POST, PUT e DELETE
                 * enquanto estamos trabalhando com API REST.
                 */
                .csrf(csrf -> csrf.disable())

                /*
                 * Desabilita login básico e formulário padrão do Spring Security.
                 */
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .logout(logout -> logout.disable())

                /*
                 * Libera todas as rotas temporariamente.
                 * Isso NÃO ficará assim na versão final.
                 */
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}