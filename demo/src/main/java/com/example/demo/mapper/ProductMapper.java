package com.example.demo.mapper;

import com.example.demo.dto.CommentDTO;
import com.example.demo.dto.ProductDTO;
import com.example.demo.model.Comment;
import com.example.demo.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    // --- UPDATE: Add mappings for category fields ---
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "category.id", target = "categoryId")
    ProductDTO toDTO(Product product);

    // --- UPDATE: Ignore the category object during DTO-to-Entity mapping ---
    // The service layer will handle fetching the Category entity by its ID.
    @Mapping(target = "category", ignore = true)
    Product toEntity(ProductDTO productDTO);

    // --- No changes needed for Comment mappings ---
    @Mapping(target = "userId", source = "user.id")
    CommentDTO toDTO(Comment comment);

    @Mapping(target = "user.id", source = "userId")
    @Mapping(target = "product", ignore = true)
    Comment toEntity(CommentDTO commentDTO);
}
