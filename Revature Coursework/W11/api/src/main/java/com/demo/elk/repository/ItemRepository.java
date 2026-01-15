package com.demo.elk.repository;

import com.demo.elk.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    // JpaRepository provides:
    // - findAll()
    // - findById(Long id)
    // - save(Item item)
    // - deleteById(Long id)
    // - and more...
}
