package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
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

    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        existingCategory.setName(categoryDTO.getName());
        existingCategory.setDescription(categoryDTO.getDescription());
        Category updatedCategory = categoryRepository.save(existingCategory);
        return toDto(updatedCategory);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }
        // Add logic here to handle products in this category (e.g., re-assign or prevent deletion)
        categoryRepository.deleteById(id);
    }

    private CategoryDTO toDto(Category category) {
        return new CategoryDTO(category.getId(), category.getName(), category.getDescription());
    }
}
