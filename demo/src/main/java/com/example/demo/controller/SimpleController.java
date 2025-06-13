package com.example.demo.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@RestController
public class SimpleController {

    @GetMapping("/api/hello")
    public Map<String, String> sayHello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello! This message is from your Spring Boot backend.");
        return response;
    }
}
