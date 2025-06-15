package com.example.demo.controller;

import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.ProductListDTO;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    // ... (other methods remain the same)
    @GetMapping("/bestsellers")
    public ResponseEntity<Page<ProductListDTO>> getBestsellers(
            @PageableDefault(size = 4) Pageable pageable) {
        Page<ProductListDTO> bestsellers = productService.getBestsellers(pageable);
        return ResponseEntity.ok(bestsellers);
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<Page<ProductListDTO>> getNewArrivals(
            @PageableDefault(size = 4) Pageable pageable) {
        Page<ProductListDTO> newArrivals = productService.getNewArrivals(pageable);
        return ResponseEntity.ok(newArrivals);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductListDTO>> getProductsByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(size = 12, sort = "name") Pageable pageable) {
        Page<ProductListDTO> products = productService.getProductsByCategoryId(categoryId, pageable);
        return ResponseEntity.ok(products);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@RequestPart("product") @Valid ProductDTO productDTO,
                                                    @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        return ResponseEntity.ok(productService.createProduct(productDTO, image));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id,
                                                    @RequestPart("product") @Valid ProductDTO productDTO,
                                                    @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        return ResponseEntity.ok(productService.updateProduct(id, productDTO, image));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }


    @GetMapping
    public ResponseEntity<Page<ProductListDTO>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean bestseller,
            @RequestParam(required = false) Boolean newArrival,
            @RequestParam(required = false) Long categoryId, // Add this
            @PageableDefault(size = 12, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(search, minPrice, maxPrice, brand, bestseller, newArrival, categoryId, pageable)); // Pass it here
    }
}