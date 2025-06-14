package com.example.demo.repositories;

import com.example.demo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Finds all reviews based on their approval status.
     * @param approved The approval status to filter by.
     * @return A list of reviews matching the approval status.
     */
    List<Review> findByApproved(boolean approved);

    // The findByProductIdAndApproved method has been removed as it is no longer valid.
}

