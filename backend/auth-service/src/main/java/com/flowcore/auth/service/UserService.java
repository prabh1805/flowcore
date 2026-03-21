package com.flowcore.auth.service;

import com.flowcore.auth.dto.AuthResponse;
import com.flowcore.auth.dto.LoginRequest;
import com.flowcore.auth.dto.RegisterRequest;
import com.flowcore.auth.entity.User;
import com.flowcore.auth.exception.ApiException;
import com.flowcore.auth.jwt.JwtUtil;
import com.flowcore.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    public AuthResponse registerUser(RegisterRequest request) {

        // Check if email already exists
        Optional<User> existingUserByEmail = userRepository.findByEmail(request.getEmail());
        if (existingUserByEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Check if phone already exists
        Optional<User> existingUserByPhone =
                userRepository.findByCountryCodeAndPhone(request.getCountryCode(), request.getPhone());

        if (existingUserByPhone.isPresent()) {
            throw new RuntimeException("Phone already exists");
        }

        // Create user from request and save it
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setCountryCode(request.getCountryCode());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        String accessToken = jwtUtil.generateToken(request.getEmail());
        String refreshToken = refreshTokenService.createFreshToken(user).getToken();
        return new AuthResponse(accessToken, refreshToken,"User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("User not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = refreshTokenService.createFreshToken(user).getToken();
        return new AuthResponse(token, refreshToken,"User logged in successfully");
    }
}