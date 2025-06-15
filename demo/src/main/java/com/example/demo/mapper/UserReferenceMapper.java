package com.example.demo.mapper;

import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.ObjectFactory;
import org.mapstruct.TargetType;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserReferenceMapper {

    private final UserRepository userRepository;

    /**
     * This method serves as an "object factory" for MapStruct.
     * When MapStruct needs to create a User object from a Long, it will
     * use this method. We use getReferenceById for efficiency, as it
     * provides a lazy-loaded proxy to the User entity.
     */
    @ObjectFactory
    public User resolve(Long userId, @TargetType Class<User> type) {
        if (userId == null) {
            return null;
        }
        return userRepository.getReferenceById(userId);
    }
}