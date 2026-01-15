package com.demo.user.controller;

import com.demo.user.model.User;
import com.demo.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "CRUD operations for Users - generates logs for ELK demo")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get all users", description = "Retrieves all users from the database. Generates INFO logs.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all users")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        logger.info("GET /api/users - Request to fetch all users");
        List<User> users = userService.getAllUsers();
        logger.info("GET /api/users - Returning {} users", users.size());
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID", description = "Retrieves a single user by ID. Generates INFO or WARN logs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found"),
            @ApiResponse(responseCode = "404", description = "User not found - generates WARN log")
    })
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @Parameter(description = "ID of the user to retrieve") @PathVariable Long id) {
        logger.info("GET /api/users/{} - Request to fetch user", id);

        return userService.getUserById(id)
                .map(user -> {
                    logger.info("GET /api/users/{} - Found user", id);
                    return ResponseEntity.ok(user);
                })
                .orElseGet(() -> {
                    logger.warn("GET /api/users/{} - User not found, returning 404", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @Operation(summary = "Create new user", description = "Creates a new user in the database. Generates INFO logs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "500", description = "Server error - generates ERROR log")
    })
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        logger.info("POST /api/users - Request to create user: username='{}'", user.getUsername());

        try {
            User createdUser = userService.createUser(user);
            logger.info("POST /api/users - Created user with id: {}", createdUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            logger.error("POST /api/users - Failed to create user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Delete user by ID", description = "Deletes a user from the database. Generates INFO or WARN logs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found - generates WARN log")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID of the user to delete") @PathVariable Long id) {
        logger.info("DELETE /api/users/{} - Request to delete user", id);

        boolean deleted = userService.deleteUser(id);

        if (deleted) {
            logger.info("DELETE /api/users/{} - User deleted successfully", id);
            return ResponseEntity.noContent().build();
        } else {
            logger.warn("DELETE /api/users/{} - User not found, returning 404", id);
            return ResponseEntity.notFound().build();
        }
    }
}
