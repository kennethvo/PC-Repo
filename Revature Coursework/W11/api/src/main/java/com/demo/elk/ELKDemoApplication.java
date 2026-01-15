package com.demo.elk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class ELKDemoApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(ELKDemoApplication.class);

    public static void main(String[] args) {
        logger.info("Starting ELK Demo Application...");
        SpringApplication.run(ELKDemoApplication.class, args);
        logger.info("ELK Demo Application started successfully!");
    }
}
