package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Value("${file.upload-dir}") // Inject upload directory path
    private String uploadDir;

    // Modified to accept a MultipartFile
    public CategoryDTO createCategory(CategoryDTO categoryDTO, MultipartFile image) throws IOException {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImageAndGetUrl(image);
            category.setImageUrl(imageUrl);
        }

        Category savedCategory = categoryRepository.save(category);
        return toDto(savedCategory);
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return toDto(category);
    }

    // Modified to accept a MultipartFile
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO, MultipartFile image) throws IOException {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        existingCategory.setName(categoryDTO.getName());
        existingCategory.setDescription(categoryDTO.getDescription());

        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImageAndGetUrl(image);
            existingCategory.setImageUrl(imageUrl);
        }

        Category updatedCategory = categoryRepository.save(existingCategory);
        return toDto(updatedCategory);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // Helper method to save the image file and return its URL path
    private String saveImageAndGetUrl(MultipartFile image) throws IOException {
        if (image.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path path = Paths.get(uploadDir + "/images/" + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, image.getBytes());
        return "/images/" + fileName;
    }

    private CategoryDTO toDto(Category category) {
        return new CategoryDTO(category.getId(), category.getName(), category.getDescription(), category.getImageUrl());
    }
}