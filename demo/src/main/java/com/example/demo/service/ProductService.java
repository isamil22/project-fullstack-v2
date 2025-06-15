package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.ProductListDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.specification.ProductSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final ProductSpecification productSpecification;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO, MultipartFile image) throws IOException {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + productDTO.getCategoryId()));

        Product product = productMapper.toEntity(productDTO);
        product.setCategory(category);
        product.setBrand(productDTO.getBrand());
        product.setBestseller(productDTO.isBestseller());
        product.setNewArrival(productDTO.isNewArrival());

        if (image != null && !image.isEmpty()) {
            String fileName = saveImage(image);
            product.setImage("/images/" + fileName);
        }
        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO, MultipartFile image) throws IOException {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + productDTO.getCategoryId()));

        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setCategory(category);
        existingProduct.setBrand(productDTO.getBrand());
        existingProduct.setBestseller(productDTO.isBestseller());
        existingProduct.setNewArrival(productDTO.isNewArrival());

        if (image != null && !image.isEmpty()) {
            String fileName = saveImage(image);
            existingProduct.setImage("/images/" + fileName);
        }
        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toDTO(updatedProduct);
    }

    public Page<ProductListDTO> getProductsByCategoryId(Long categoryId, Pageable pageable) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Cannot find products for a non-existent category with ID: " + categoryId);
        }
        return productRepository.findByCategoryId(categoryId, pageable);
    }

    public Page<ProductListDTO> getBestsellers(Pageable pageable) {
        return productRepository.findBestsellers(pageable);
    }

    public Page<ProductListDTO> getNewArrivals(Pageable pageable) {
        return productRepository.findNewArrivals(pageable);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public ProductDTO getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productMapper.toDTO(product);
    }

    public Page<ProductListDTO> getAllProducts(String search, BigDecimal minPrice, BigDecimal maxPrice, String brand, Pageable pageable) {
        Specification<Product> spec = productSpecification.getProducts(search, minPrice, maxPrice, brand);
        return productRepository.findAll(spec, pageable)
                .map(product -> new ProductListDTO(
                        product.getId(),
                        product.getName(),
                        product.getDescription(),
                        product.getPrice(),
                        product.getQuantity(),
                        product.getImage(),
                        product.getBrand()
                ));
    }

    private String saveImage(MultipartFile image) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();

        Path path = Paths.get(uploadDir + "/images/" + fileName);

        Files.createDirectories(path.getParent());
        Files.write(path, image.getBytes());
        return fileName;
    }
}