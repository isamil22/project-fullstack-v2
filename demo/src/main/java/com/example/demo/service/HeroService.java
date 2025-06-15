package com.example.demo.service;

import com.example.demo.dto.HeroDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.HeroMapper;
import com.example.demo.model.Hero;
import com.example.demo.repositories.HeroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HeroService {
    private final HeroRepository heroRepository;
    private final HeroMapper heroMapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public HeroDTO getHero() {
        Hero hero = heroRepository.findById(1L).orElseGet(() -> {
            Hero newHero = new Hero();
            newHero.setId(1L);
            newHero.setTitle("Default Title");
            newHero.setSubtitle("Default Subtitle");
            newHero.setLinkText("Shop Now");
            newHero.setLinkUrl("/products");
            newHero.setImageUrl("https://placehold.co/1200x400/E91E63/FFFFFF?text=Beauty+Cosmetics");
            return heroRepository.save(newHero);
        });
        return heroMapper.toDTO(hero);
    }

    public HeroDTO updateHero(HeroDTO heroDTO, MultipartFile image) throws IOException {
        Hero hero = heroRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("Hero section not found"));

        hero.setTitle(heroDTO.getTitle());
        hero.setSubtitle(heroDTO.getSubtitle());
        hero.setLinkText(heroDTO.getLinkText());
        hero.setLinkUrl(heroDTO.getLinkUrl());

        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImageAndGetUrl(image);
            hero.setImageUrl(imageUrl);
        }

        Hero updatedHero = heroRepository.save(hero);
        return heroMapper.toDTO(updatedHero);
    }

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
}