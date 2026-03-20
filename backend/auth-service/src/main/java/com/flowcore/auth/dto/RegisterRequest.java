package com.flowcore.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    @NotBlank
    @Email
    private String email;
    @Size(min = 6)
    private String password;
    private String countryCode;
    private String phone;
}
