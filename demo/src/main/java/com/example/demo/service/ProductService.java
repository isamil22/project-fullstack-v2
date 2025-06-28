package com.example.demo.service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.Product;
import com.example.demo.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private ProductMapper productMapper;

    // This method now only saves the product with text-based data
    public ProductDTO addProduct(ProductDTO productDTO) {
        Product product = productMapper.toEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }

    // This is the new method for uploading images
    public ProductDTO uploadProductImages(Long productId, List<MultipartFile> images) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        List<String> imageUrls = images.stream()
                .map(image -> {
                    try {
                        // Corrected method call to match your S3Service
                        return s3Service.saveImage(image);
                    } catch (IOException e) {
                        // It's better to wrap the checked exception in an unchecked one for streams
                        throw new RuntimeException("Failed to upload image", e);
                    }
                })
                .collect(Collectors.toList());

        product.getImages().addAll(imageUrls);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toDTO(updatedProduct);
    }

    // No changes to the other methods
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDTO(product);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Product product = productMapper.toEntity(productDTO);
        product.setId(existingProduct.getId()); // Ensure the ID is not changed

        Product updatedProduct = productRepository.save(product);
        return productMapper.toDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}