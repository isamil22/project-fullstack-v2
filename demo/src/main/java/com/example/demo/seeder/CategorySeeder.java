package com.example.demo.seeder;

import com.example.demo.model.Category;
import com.example.demo.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(1) // Ensures this runs first
public class CategorySeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            Category skincare = new Category(null, "Skincare", "Products for skin health and appearance.");
            Category makeup = new Category(null, "Makeup", "Cosmetics for enhancing appearance.");
            Category haircare = new Category(null, "Haircare", "Products for hair hygiene and cosmetology.");
            Category fragrance = new Category(null, "Fragrance", "Perfumes and scented products.");
            Category bathAndBody = new Category(null, "Bath & Body", "Soaps, scrubs, lotions, and bath products.");
            Category tools = new Category(null, "Tools & Brushes", "Makeup brushes, hair tools, and skincare tools.");


            List<Category> categories = Arrays.asList(skincare, makeup, haircare, fragrance, bathAndBody, tools);
            categoryRepository.saveAll(categories);
            System.out.println("Default beauty categories have been added to the database.");
        } else {
            System.out.println("Categories already exist in the database.");
        }
    }
}