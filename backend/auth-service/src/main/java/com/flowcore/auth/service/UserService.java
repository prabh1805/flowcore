package com.flowcore.auth.service;

import com.flowcore.auth.entity.User;
import com.flowcore.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(User user) {

        // Check if email already exists
        Optional<User> existingUserByEmail = userRepository.findByEmail(user.getEmail());
        if (existingUserByEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Check if phone already exists
        Optional<User> existingUserByPhone =
                userRepository.findByCountryCodeAndPhone(user.getCountryCode(), user.getPhone());

        if (existingUserByPhone.isPresent()) {
            throw new RuntimeException("Phone already exists");
        }

        // Save user
        return userRepository.save(user);
    }
}