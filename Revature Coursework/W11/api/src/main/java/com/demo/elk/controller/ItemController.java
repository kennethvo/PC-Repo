package com.demo.elk.controller;

import com.demo.elk.model.Item;
import com.demo.elk.service.ItemService;
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
@RequestMapping("/api/items")
@Tag(name = "Items", description = "CRUD operations for Items - generates logs for ELK demo")
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @Operation(summary = "Get all items", description = "Retrieves all items from the database. Generates INFO logs.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all items")
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        logger.info("GET /api/items - Request to fetch all items");
        List<Item> items = itemService.getAllItems();
        logger.info("GET /api/items - Returning {} items", items.size());
        return ResponseEntity.ok(items);
    }

    @Operation(summary = "Get item by ID", description = "Retrieves a single item by its ID. Generates INFO or WARN logs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item found"),
            @ApiResponse(responseCode = "404", description = "Item not found - generates WARN log")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(
            @Parameter(description = "ID of the item to retrieve") @PathVariable Long id) {
        logger.info("GET /api/items/{} - Request to fetch item", id);

        return itemService.getItemById(id)
                .map(item -> {
                    logger.info("GET /api/items/{} - Found item", id);
                    return ResponseEntity.ok(item);
                })
                .orElseGet(() -> {
                    logger.warn("GET /api/items/{} - Item not found, returning 404", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @Operation(summary = "Create new item", description = "Creates a new item in the database. Generates INFO logs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Item created successfully"),
            @ApiResponse(responseCode = "500", description = "Server error - generates ERROR log")
    })
    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        logger.info("POST /api/items - Request to create item: name='{}'", item.getName());

        try {
            Item createdItem = itemService.createItem(item);
            logger.info("POST /api/items - Created item with id: {}", createdItem.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
        } catch (Exception e) {
            logger.error("POST /api/items - Failed to create item: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Delete item by ID", description = "Deletes an item from the database. Generates INFO or WARN logs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found - generates WARN log")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(
            @Parameter(description = "ID of the item to delete") @PathVariable Long id) {
        logger.info("DELETE /api/items/{} - Request to delete item", id);

        boolean deleted = itemService.deleteItem(id);

        if (deleted) {
            logger.info("DELETE /api/items/{} - Item deleted successfully", id);
            return ResponseEntity.noContent().build();
        } else {
            logger.warn("DELETE /api/items/{} - Item not found, returning 404", id);
            return ResponseEntity.notFound().build();
        }
    }
}
