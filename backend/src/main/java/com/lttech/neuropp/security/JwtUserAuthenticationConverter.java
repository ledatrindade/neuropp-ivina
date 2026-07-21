package com.lttech.neuropp.security;

import com.lttech.neuropp.entity.User;
import com.lttech.neuropp.repository.UserRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class JwtUserAuthenticationConverter
        implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;

    public JwtUserAuthenticationConverter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        UUID userId;

        try {
            userId = UUID.fromString(jwt.getSubject());
        } catch (RuntimeException exception) {
            throw new BadCredentialsException("Token inválido.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("Token inválido."));

        Number tokenVersionClaim = jwt.getClaim("tokenVersion");
        int tokenVersion = tokenVersionClaim == null ? -1 : tokenVersionClaim.intValue();

        if (!Boolean.TRUE.equals(user.getActive()) || tokenVersion != user.getTokenVersion()) {
            throw new BadCredentialsException("Token revogado ou usuário inativo.");
        }

        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return new JwtAuthenticationToken(jwt, authorities, userId.toString());
    }
}
