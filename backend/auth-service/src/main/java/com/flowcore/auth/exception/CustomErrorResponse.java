package com.flowcore.auth.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CustomErrorResponse {
    private String message;
    private int status;
    private LocalDateTime timestamp;
}
