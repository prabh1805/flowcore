package com.flowcore.auth.service;

import com.flowcore.auth.entity.BlacklistedToken;
import com.flowcore.auth.jwt.JwtUtil;
import com.flowcore.auth.repository.BlackTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class BlacklistTokenService {
    private final BlackTokenRepository blackTokenRepository;
    private final JwtUtil jwtUtil;

    public void blacklist(String token) {
        LocalDateTime expiryAt = jwtUtil.extractExpiration(token)
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        BlacklistedToken blacklistedToken = new BlacklistedToken();
        blacklistedToken.setToken(token);
        blacklistedToken.setExpiryAt(expiryAt);
        blackTokenRepository.save(blacklistedToken);
    }

    public boolean isBlacklisted(String token) {
        return blackTokenRepository.existsByToken(token);
    }
}
