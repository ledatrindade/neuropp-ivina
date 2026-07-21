package com.lttech.neuropp.security;

import com.lttech.neuropp.config.JwtProperties;
import com.lttech.neuropp.entity.User;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final JwtProperties properties;
    private final Clock clock;

    public JwtService(JwtEncoder jwtEncoder, JwtProperties properties, Clock clock) {
        this.jwtEncoder = jwtEncoder;
        this.properties = properties;
        this.clock = clock;
    }

    public GeneratedToken generate(User user) {
        Instant issuedAt = clock.instant();
        Instant expiresAt = issuedAt.plus(properties.accessTokenTtl());

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256)
                .type("JWT")
                .build();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(properties.issuer())
                .subject(user.getId().toString())
                .audience(List.of(properties.audience()))
                .issuedAt(issuedAt)
                .notBefore(issuedAt)
                .expiresAt(expiresAt)
                .id(UUID.randomUUID().toString())
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .claim("role", user.getRole().name())
                .claim("tokenVersion", user.getTokenVersion())
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims))
                .getTokenValue();

        return new GeneratedToken(token, expiresAt);
    }

    public record GeneratedToken(String value, Instant expiresAt) {
    }
}
