package com.flowcore.auth.controller;

import com.flowcore.auth.dto.AuthResponse;
import com.flowcore.auth.dto.LoginRequest;
import com.flowcore.auth.dto.RegisterRequest;
import com.flowcore.auth.entity.User;
import com.flowcore.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest registerRequest) {
        return userService.registerUser(registerRequest);
    }

    @GetMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }
}
