package com.Revature;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ThreadPoolDemo {
    public static void main(String[] args) {
        // Create a pool with 3 threads
        ExecutorService pool = Executors.newFixedThreadPool(3);

        System.out.println("Starting thread pool demo with 3 threads...\n");

        // Submit 10 tasks to the pool
        for (int i = 1; i <= 10; i++) {
            final int taskId = i;

            pool.submit(() -> {
                String threadName = Thread.currentThread().getName();
                System.out.println("Task " + taskId + " started on " + threadName);

                try {
                    // Simulate some work with random duration
                    Thread.sleep((long) (Math.random() * 2000) + 500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }

                System.out.println("Task " + taskId + " completed on " + threadName);
            });
        }

        // Shutdown the pool gracefully
        pool.shutdown();

        try {
            // Wait for all tasks to complete (max 30 seconds)
            if (pool.awaitTermination(30, TimeUnit.SECONDS)) {
                System.out.println("\nAll tasks completed successfully!");
            } else {
                System.out.println("\nTimeout - some tasks didn't finish in time");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}