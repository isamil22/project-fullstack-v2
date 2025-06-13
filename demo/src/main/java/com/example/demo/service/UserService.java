package com.example.demo.service;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.UserDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final UserMapper userMapper; // Add this

    public User registerUser(User user){
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.USER);
        user.setConfirmationCode(generateConfirmationCode());
        user.setEmailConfirmation(false);
        emailService.sendConfirmationCode(user);
        return userRepository.save(user);
    }

    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found"));
    }

    public void changePassword(String email, ChangePasswordRequest request){
        User user = getUserByEmail(email);
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void confirmEmail(String email, String confirmationCode){
        User user = getUserByEmail(email);
        if(user.getConfirmationCode().equals(confirmationCode)){
            user.setEmailConfirmation(true);
            user.setConfirmationCode(null);
            userRepository.save(user);
        }
        else{
            throw new BadCredentialsException("Invalid confirmation code");
        }
    }

    private String generateConfirmationCode(){
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    // New methods for admin
    public List<UserDTO> getAllUsers() {
        return userMapper.toDTOs(userRepository.findAll());
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserDTO updateUserRole(Long id, User.Role role) {
        User user = getUserById(id);
        user.setRole(role);
        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }
}