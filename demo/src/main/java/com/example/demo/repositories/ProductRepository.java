package com.example.demo.repositories;

import com.example.demo.dto.ProductListDTO;
import com.example.demo.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query("SELECT new com.example.demo.dto.ProductListDTO(p.id, p.name, p.description, p.price, p.quantity, p.image, p.brand) FROM Product p")
    Page<ProductListDTO> findAllWithoutComments(Pageable pageable);

    @Query("SELECT new com.example.demo.dto.ProductListDTO(p.id, p.name, p.description, p.price, p.quantity, p.image, p.brand) FROM Product p WHERE p.category.id = :categoryId")
    Page<ProductListDTO> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT new com.example.demo.dto.ProductListDTO(p.id, p.name, p.description, p.price, p.quantity, p.image, p.brand) FROM Product p WHERE p.bestseller = true")
    Page<ProductListDTO> findBestsellers(Pageable pageable);

    @Query("SELECT new com.example.demo.dto.ProductListDTO(p.id, p.name, p.description, p.price, p.quantity, p.image, p.brand) FROM Product p WHERE p.newArrival = true")
    Page<ProductListDTO> findNewArrivals(Pageable pageable);
}