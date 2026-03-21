package com.flowcore.auth.controller;

import com.flowcore.auth.dto.AuthResponse;
import com.flowcore.auth.dto.LoginRequest;
import com.flowcore.auth.dto.RefreshRequest;
import com.flowcore.auth.dto.RegisterRequest;
import com.flowcore.auth.entity.RefreshToken;
import com.flowcore.auth.jwt.JwtUtil;
import com.flowcore.auth.service.BlacklistTokenService;
import com.flowcore.auth.service.RefreshTokenService;
import com.flowcore.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final BlacklistTokenService blacklistTokenService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest registerRequest) {
        return userService.registerUser(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestBody RefreshRequest refreshRequest) {
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(refreshRequest.getRefreshToken());
        String newAccessToken = jwtUtil.generateToken(refreshToken.getUser().getEmail());
        return new AuthResponse(newAccessToken, refreshRequest.getRefreshToken(), "Token refreshed successfully");
    }

    @PostMapping("/logout")
    public String logout(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String refreshToken
    ) {
        String token = authHeader.substring(7);
        blacklistTokenService.blacklist(token);
        refreshTokenService.deleteToken(refreshToken);
        return "Logged out successfully";
    }
}
