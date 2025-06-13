package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.mapstruct.MapperScan;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
//@MapperScan("com.example.demo.mapper")  // Add this line to enable MapStruct scanning


public class EcomercebasicApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcomercebasicApplication.class, args);
	}

}
