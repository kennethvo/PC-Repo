package com.demo.user.service;

import com.demo.user.model.User;
import com.demo.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        logger.info("Fetching all users from database");
        List<User> users = userRepository.findAll();
        logger.info("Found {} users", users.size());
        return users;
    }

    public Optional<User> getUserById(Long id) {
        logger.info("Fetching user with id: {}", id);
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            logger.info("Found user: {}", user.get());
        } else {
            logger.warn("User with id {} not found", id);
        }

        return user;
    }

    public User createUser(User user) {
        logger.info("Creating new user: username='{}', email='{}'",
                user.getUsername(), user.getEmail());

        try {
            User savedUser = userRepository.save(user);
            logger.info("Successfully created user with id: {}", savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            logger.error("Failed to create user: {}", e.getMessage(), e);
            throw e;
        }
    }

    public boolean deleteUser(Long id) {
        logger.info("Attempting to delete user with id: {}", id);

        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            logger.info("Successfully deleted user with id: {}", id);
            return true;
        } else {
            logger.warn("Cannot delete - user with id {} does not exist", id);
            return false;
        }
    }
}
