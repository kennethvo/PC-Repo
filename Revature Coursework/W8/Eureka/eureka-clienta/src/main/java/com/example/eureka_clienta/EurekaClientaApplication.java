package com.example.eureka_clienta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class EurekaClientaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaClientaApplication.class, args);
	}

}

@RestController
class MyController {
	@GetMapping("/hello")
	public String hello() {
		return "Hello from Eureka Client A";
	}
}
