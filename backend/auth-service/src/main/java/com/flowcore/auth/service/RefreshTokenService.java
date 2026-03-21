package com.flowcore.auth.service;

import com.flowcore.auth.entity.RefreshToken;
import com.flowcore.auth.entity.User;
import com.flowcore.auth.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh.expiration}")
    private long refreshExpiration;

    public RefreshToken createFreshToken(User user) {
        return refreshTokenRepository.findByUser(user)
                .map(existingToken -> {
                    existingToken.setToken(UUID.randomUUID().toString());
                    existingToken.setExpiryDate(Instant.now().plusMillis(refreshExpiration));
                    return refreshTokenRepository.save(existingToken);
                })
                .orElseGet(() -> {
                    RefreshToken refreshToken = new RefreshToken();
                    refreshToken.setUser(user);
                    refreshToken.setToken(UUID.randomUUID().toString());
                    refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpiration));
                    return refreshTokenRepository.save(refreshToken);
                });
    }
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        // Compare Instant with Instant
        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token is expired");
        }

        return refreshToken;
    }
    public void deleteToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

}
