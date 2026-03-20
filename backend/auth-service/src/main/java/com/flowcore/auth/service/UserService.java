package com.flowcore.auth.service;

import com.flowcore.auth.dto.RegisterRequest;
import com.flowcore.auth.entity.User;
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
    public User registerUser(RegisterRequest request) {

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
        user.setEmail(request.getEmail());
        user.setCountryCode(request.getCountryCode());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }
}