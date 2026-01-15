package com.demo.elk.service;

import com.demo.elk.model.Item;
import com.demo.elk.repository.ItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * Get all items from the database
     */
    public List<Item> getAllItems() {
        logger.info("Fetching all items from database");
        List<Item> items = itemRepository.findAll();
        logger.info("Found {} items", items.size());
        return items;
    }

    /**
     * Get a single item by ID
     */
    public Optional<Item> getItemById(Long id) {
        logger.info("Fetching item with id: {}", id);
        Optional<Item> item = itemRepository.findById(id);

        if (item.isPresent()) {
            logger.info("Found item: {}", item.get());
        } else {
            logger.warn("Item with id {} not found", id);
        }

        return item;
    }

    /**
     * Create a new item
     */
    public Item createItem(Item item) {
        logger.info("Creating new item: name='{}', description='{}'",
                item.getName(), item.getDescription());

        try {
            Item savedItem = itemRepository.save(item);
            logger.info("Successfully created item with id: {}", savedItem.getId());
            return savedItem;
        } catch (Exception e) {
            logger.error("Failed to create item: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Delete an item by ID
     */
    public boolean deleteItem(Long id) {
        logger.info("Attempting to delete item with id: {}", id);

        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            logger.info("Successfully deleted item with id: {}", id);
            return true;
        } else {
            logger.warn("Cannot delete - item with id {} does not exist", id);
            return false;
        }
    }
}
