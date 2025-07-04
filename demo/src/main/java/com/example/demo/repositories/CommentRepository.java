package com.example.demo.repositories;

import com.example.demo.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByProductId(Long productId);

    // --- ADD THIS LINE ---
    List<Comment> findByUserId(Long userId);
}