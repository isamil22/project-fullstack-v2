package com.example.demo.specification;

import com.example.demo.model.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProductSpecification {

    public Specification<Product> getProducts(String search, BigDecimal minPrice, BigDecimal maxPrice, String brand) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String searchTerm = "%" + search.toLowerCase() + "%";
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchTerm);
                Predicate descriptionLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchTerm);
                predicates.add(criteriaBuilder.or(nameLike, descriptionLike));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (brand != null && !brand.isEmpty()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("brand")), brand.toLowerCase()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}