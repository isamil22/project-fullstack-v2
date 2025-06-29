package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.Category; // Import Category
import com.example.demo.model.Product;
import com.example.demo.repositories.CategoryRepository; // Import CategoryRepository
import com.example.demo.repositories.ProductRepository;
import jakarta.transaction.Transactional; // Import Transactional
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository; // Inject CategoryRepository

    @Autowired
    private S3Service s3Service;

    @Autowired
    private ProductMapper productMapper;

    // NEW METHOD: Creates a product and uploads images in one go.
    @Transactional
    public ProductDTO createProductWithImages(ProductDTO productDTO, List<MultipartFile> images) throws IOException {
        Product product = productMapper.toEntity(productDTO);

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + productDTO.getCategoryId()));
        product.setCategory(category);

        // Handle images
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = uploadAndGetImageUrls(images);
            product.setImages(imageUrls);
        } else {
            product.setImages(new ArrayList<>());
        }

        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }

    // NEW METHOD: Updates a product and its images.
    @Transactional
    public ProductDTO updateProductWithImages(Long id, ProductDTO productDTO, List<MultipartFile> images) throws IOException {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update fields from DTO
        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setBrand(productDTO.getBrand());
        existingProduct.setBestseller(productDTO.isBestseller());
        existingProduct.setNewArrival(productDTO.isNewArrival());

        if (!existingProduct.getCategory().getId().equals(productDTO.getCategoryId())) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + productDTO.getCategoryId()));
            existingProduct.setCategory(category);
        }

        // Handle new images if they are provided
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = uploadAndGetImageUrls(images);
            // Here you can decide whether to add to or replace existing images
            existingProduct.getImages().clear(); // Example: replacing all images
            existingProduct.getImages().addAll(imageUrls);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toDTO(updatedProduct);
    }

    // Helper method to reduce code duplication
    private List<String> uploadAndGetImageUrls(List<MultipartFile> images) {
        return images.stream()
                .map(image -> {
                    try {
                        return s3Service.saveImage(image);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to upload image", e);
                    }
                })
                .collect(Collectors.toList());
    }

    // --- The rest of your service methods ---
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getBestsellers() {
        return productRepository.findByBestsellerIsTrue(Pageable.unpaged()).getContent().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getNewArrivals() {
        return productRepository.findByNewArrivalIsTrue(Pageable.unpaged()).getContent().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDTO(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}