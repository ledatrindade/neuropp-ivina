package com.lttech.neuropp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.lttech.neuropp.security.JwtAuthenticationFilter;

/*
 * Configuração de segurança da API.
 *
 * Agora deixamos de liberar tudo.
 * A API passa a respeitar:
 * - rotas públicas;
 * - rotas autenticadas;
 * - rotas exclusivas de ADMIN.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {

        System.out.println(">>> SecurityConfig com JWT carregada");

        http
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .logout(logout -> logout.disable())

                /*
                 * JWT não usa sessão no servidor.
                 * Cada requisição precisa enviar o token.
                 */
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Rotas públicas.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/availability").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/responsibles").permitAll()

                        /*
                         * Rotas administrativas.
                         */
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        /*
                         * Demais rotas da API precisam estar autenticadas.
                         */
                        .requestMatchers("/api/**").authenticated()

                        /*
                         * Qualquer outra coisa fica bloqueada.
                         */
                        .anyRequest().denyAll()
                )

                /*
                 * Nosso filtro JWT roda antes do filtro padrão de usuário/senha.
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /*
     * Criptografia de senha.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}