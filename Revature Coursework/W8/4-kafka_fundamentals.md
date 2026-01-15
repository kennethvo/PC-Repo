# Week 7 - Thursday: Kafka Fundamentals and Architecture

## 1. Event-Driven Paradigm Basics

### What is Event-Driven Architecture (EDA)?
**Event-Driven Architecture** is a software design pattern where decoupled applications communicate by publishing and consuming **Events**.

### Core Concepts

#### Event
-   **Definition**: A significant change in state or an occurrence in the system.
-   **Examples**: "User Created", "Order Placed", "Payment Processed", "Temperature Changed".
-   **Characteristics**: Immutable, timestamped, describes what happened (past tense).

#### Message vs Event

| Concept | Description | Example | Intent |
| :---: | :--- | :--- | :--- |
| **Message** | Command/Request | "Please process this payment" | Tell someone to do something |
| **Event** | Notification/Fact | "Payment was processed" | Inform that something happened |

### EDA Components

```
┌──────────┐         ┌─────────┐         ┌──────────┐
│ Producer │────────▶│ Message │────────▶│ Consumer │
│ (Publisher)│       │  Broker │         │(Subscriber)│
└──────────┘         └─────────┘         └──────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │ Event Store  │
                  │   (Kafka)    │
                  └──────────────┘
```

-   **Producer (Publisher)**: The service that creates and sends events.
-   **Consumer (Subscriber)**: The service that listens for and reacts to events.
-   **Broker**: The middleware that receives, stores, and distributes events.
-   **Event Store**: Persistent storage for events (Kafka topics).

### Benefits of Event-Driven Architecture

| Benefit | Description |
| :--- | :--- |
| **Decoupling** | Producers don't know who consumers are. Services can be developed independently. |
| **Scalability** | Add more consumers to handle increased load without changing producers. |
| **Asynchronous** | Producers don't wait for consumers to finish processing. |
| **Flexibility** | New consumers can subscribe to existing events without modifying producers. |
| **Resilience** | If a consumer fails, events are persisted and can be replayed. |
| **Real-Time** | Events are processed as they occur, enabling real-time reactions. |

### Use Cases

-   **Microservices Communication**: Services react to events from other services.
-   **Real-Time Analytics**: Process streams of events as they occur.
-   **Event Sourcing**: Store state changes as a sequence of events.
-   **CQRS**: Separate read and write models using events.
-   **IoT**: Process sensor data streams.
-   **Logging and Monitoring**: Centralize logs and metrics.

---

## 2. Apache Kafka Core Architecture

**Apache Kafka** is a distributed event streaming platform designed for high-throughput, fault-tolerant, and scalable event processing.

### What is Kafka?
-   **Not a queue**: Messages are retained even after being consumed.
-   **Distributed**: Runs across multiple servers (brokers) for fault tolerance.
-   **Persistent**: Events are stored on disk (not just in memory).
-   **High throughput**: Can handle millions of events per second.
-   **Scalable**: Add more brokers and partitions as needed.

---

## 3. Kafka Components

### 1. Broker
-   **Definition**: A single Kafka server.
-   **Cluster**: Multiple brokers working together.
-   **Role**: Receives messages from producers, stores them on disk, and serves them to consumers.
-   **Fault Tolerance**: If one broker fails, others continue serving requests.

### 2. Topic
-   **Definition**: A category or feed name. Think of it as a table in a database or a folder.
-   **Purpose**: Logical grouping of related events.
-   **Examples**: `user-signup`, `order-placed`, `payment-completed`.
-   **Characteristics**:
    -   Topics are **append-only** logs.
    -   Events in a topic are **immutable**.
    -   Topics can be configured to **retain** events for a specified time (e.g., 7 days) or size.

### 3. Partition
-   **Definition**: Topics are split into **partitions**. Each partition is an ordered, immutable sequence of records.
-   **Purpose**: Enables **parallelism** and **scalability**.
-   **Characteristics**:
    -   Each partition is stored on a single broker (leader).
    -   Partitions can have **replicas** on other brokers for fault tolerance.
    -   Messages within a partition are **ordered** by offset.
    -   Messages across partitions have **no guaranteed order**.

#### Partition Distribution
```
Topic: user-events (3 partitions)

Partition 0: [msg0, msg3, msg6, msg9, ...]
Partition 1: [msg1, msg4, msg7, msg10, ...]
Partition 2: [msg2, msg5, msg8, msg11, ...]
```

**Key Point**: Messages are distributed across partitions based on a **partition key** (or round-robin if no key is provided).

### 4. Offset
-   **Definition**: A unique, sequential ID assigned to each message within a partition.
-   **Purpose**: Tracks the **read position** of a consumer.
-   **Characteristics**:
    -   Offsets start at 0 and increment for each new message.
    -   Each partition has its own offset sequence.
    -   Consumers track their own offset position.

#### Offset Example
```
Partition 0:
Offset  0  1  2  3  4  5  6  7  8  9
      [M][M][M][M][M][M][M][M][M][M]
                      ↑
                Consumer's current offset: 5
```

### 5. Replication Factor
-   **Definition**: Number of copies of each partition across different brokers.
-   **Purpose**: Fault tolerance. If a broker fails, another broker has a replica.
-   **Leader and Followers**:
    -   **Leader**: The broker that handles reads and writes for a partition.
    -   **Followers (Replicas)**: Brokers that replicate data from the leader.

#### Replication Example
```
Replication Factor = 3

Partition 0:
- Leader: Broker 1
- Follower: Broker 2
- Follower: Broker 3

If Broker 1 fails, Broker 2 or 3 becomes the new leader.
```

---

## 4. Kafka Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Kafka Cluster                            │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│  │   Broker 1   │   │   Broker 2   │   │   Broker 3   │       │
│  │              │   │              │   │              │       │
│  │ Topic: users │   │ Topic: users │   │ Topic: orders│       │
│  │ Partition 0  │   │ Partition 1  │   │ Partition 0  │       │
│  │ (Leader)     │   │ (Follower)   │   │ (Leader)     │       │
│  │              │   │              │   │              │       │
│  │ Topic: orders│   │ Topic: users │   │ Topic: users │       │
│  │ Partition 0  │   │ Partition 0  │   │ Partition 1  │       │
│  │ (Replica)    │   │ (Replica)    │   │ (Replica)    │       │
│  └──────────────┘   └──────────────┘   └──────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         ↑                                         ↓
         │                                         │
   ┌──────────┐                              ┌──────────┐
   │ Producer │                              │ Consumer │
   │ (Writes) │                              │ (Reads)  │
   └──────────┘                              └──────────┘
```

---

## 5. Producers

### What is a Producer?
-   Clients that **publish (write)** messages to Kafka topics.
-   **Responsibilities**:
    -   Serialize data into bytes.
    -   Determine which partition to send the message to.
    -   Handle retries and errors.

### Partition Assignment Strategies

| Strategy | Description | Use Case |
| :--- | :--- | :--- |
| **Round Robin** (No Key) | Messages distributed evenly across partitions | Order doesn't matter |
| **Key-based** | Hash of the key determines the partition. Same key → Same partition | Maintaining order for related messages |
| **Custom Partitioner** | Developer-defined logic | Advanced use cases |

#### Example: Key-based Partitioning
```java
// All messages for user_123 go to the same partition
producer.send(new ProducerRecord<>("user-events", "user_123", event));
```

---

## 6. Consumers and Consumer Groups

### What is a Consumer?
-   Clients that **subscribe to (read)** messages from Kafka topics.
-   **Responsibilities**:
    -   Fetch messages from partitions.
    -   Deserialize data.
    -   Track offset position.

### Consumer Groups
-   **Definition**: A group of consumers that work together to consume a topic.
-   **Purpose**: Load balancing and parallelism.
-   **Key Rule**: **Each partition is consumed by only ONE consumer in a group**.

#### Consumer Group Example
```
Topic: user-events (3 partitions)
Consumer Group: email-service (3 consumers)

Consumer 1 ────▶ Partition 0
Consumer 2 ────▶ Partition 1
Consumer 3 ────▶ Partition 2
```

If you have **more consumers than partitions**, some consumers will be **idle**.

```
Topic: user-events (3 partitions)
Consumer Group: email-service (5 consumers)

Consumer 1 ────▶ Partition 0
Consumer 2 ────▶ Partition 1
Consumer 3 ────▶ Partition 2
Consumer 4 ────▶ (IDLE)
Consumer 5 ────▶ (IDLE)
```

If you have **fewer consumers than partitions**, each consumer handles multiple partitions.

```
Topic: user-events (6 partitions)
Consumer Group: email-service (2 consumers)

Consumer 1 ────▶ Partition 0, 1, 2
Consumer 2 ────▶ Partition 3, 4, 5
```

---

## 7. Zookeeper vs KRaft

### Zookeeper (Legacy)
-   **Role**: Manages cluster metadata.
    -   Leader election for partitions.
    -   Broker registration.
    -   Topic and partition metadata.
-   **Limitations**:
    -   Additional system to manage.
    -   Scalability bottleneck.
    -   Complexity in deployment.

### KRaft (Kafka Raft Metadata Mode) - Modern
-   **Introduction**: Kafka 2.8+ (production-ready in Kafka 3.3+).
-   **Purpose**: Removes dependency on Zookeeper.
-   **How**: Kafka brokers manage metadata using the **Raft consensus protocol**.
-   **Benefits**:
    -   **Simpler architecture**: One less system to manage.
    -   **Faster metadata operations**: No external coordination.
    -   **Better scalability**: Can support millions of partitions.

**Recommendation**: Use **KRaft** for new clusters. Zookeeper is being phased out.

---

## 8. Kafka CLI Fundamentals

Kafka provides command-line tools (in the `bin/` directory) for common operations.

### Starting Kafka with ZRaft
```bash
# Start Kafka with KRaft (no Zookeeper needed)
bin/kafka-storage.sh format -t $(bin/kafka-storage.sh random-uuid) -c config/kraft/server.properties
bin/kafka-server-start.sh config/kraft/server.properties
```

### Creating a Topic
```bash
kafka-topics.sh --create \
    --topic user-updates \
    --bootstrap-server localhost:9092 \
    --partitions 3 \
    --replication-factor 1
```
-   `--topic`: Name of the topic.
-   `--partition`: Number of partitions for parallelism.
-   `--replication-factor`: Number of replicas for fault tolerance.

### Listing Topics
```bash
kafka-topics.sh --list --bootstrap-server localhost:9092
```

### Describing a Topic
```bash
kafka-topics.sh --describe --topic user-updates --bootstrap-server localhost:9092
```
Output:
```
Topic: user-updates	PartitionCount: 3	ReplicationFactor: 1
  Topic: user-updates	Partition: 0	Leader: 0	Replicas: 0	Isr: 0
  Topic: user-updates	Partition: 1	Leader: 0	Replicas: 0	Isr: 0
  Topic: user-updates	Partition: 2	Leader: 0	Replicas: 0	Isr: 0
```
-   **Leader**: Broker ID handling this partition.
-   **Replicas**: List of brokers with replicas.
-   **ISR (In-Sync Replicas)**: Replicas that are caught up with the leader.

### Producing Messages (Console Producer)
Opens an interactive shell to type messages.

```bash
kafka-console-producer.sh \
    --topic user-updates \
    --bootstrap-server localhost:9092
```

Type messages:
```
>User created: ID 101
>User updated: ID 102
>User deleted: ID 103
```

**With Keys** (for partition affinity):
```bash
kafka-console-producer.sh \
    --topic user-updates \
    --bootstrap-server localhost:9092 \
    --property "parse.key=true" \
    --property "key.separator=:"
```

Type `key:value`:
```
>user_101:User created
>user_101:User updated (goes to same partition as above)
```

### Consuming Messages (Console Consumer)
Reads messages from the topic.

```bash
kafka-console-consumer.sh \
    --topic user-updates \
    --bootstrap-server localhost:9092
```
**Reads only new messages** (from now on).

**Read from beginning**:
```bash
kafka-console-consumer.sh \
    --topic user-updates \
    --from-beginning \
    --bootstrap-server localhost:9092
```

**With Key and Value**:
```bash
kafka-console-consumer.sh \
    --topic user-updates \
    --bootstrap-server localhost:9092 \
    --property print.key=true \
    --property key.separator=" : "
```

Output:
```
user_101 : User created
user_101 : User updated
```

### Consumer Groups CLI
```bash
# List consumer groups
kafka-consumer-groups.sh --list --bootstrap-server localhost:9092

# Describe a consumer group
kafka-consumer-groups.sh --describe \
    --group email-service \
    --bootstrap-server localhost:9092
```

Output:
```
GROUP           TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
email-service   user-updates    0          100             150             50
email-service   user-updates    1          200             200             0
email-service   user-updates    2          150             180             30
```
-   **CURRENT-OFFSET**: Consumer's progress.
-   **LOG-END-OFFSET**: Latest offset in partition.
-   **LAG**: How far behind the consumer is (LOG-END - CURRENT).

---

## 9. Kafka Guarantees

### Delivery Semantics

| Semantic | Description | Use Case |
| :--- | :--- | :--- |
| **At Most Once** | Message delivered 0 or 1 times. May be lost. | Metrics, logs (loss tolerable) |
| **At Least Once** (Default) | Message delivered 1 or more times. May be duplicated. | Most use cases (idempotent processing) |
| **Exactly Once** | Message delivered exactly once. No loss, no duplicates. | Financial transactions, critical data |

### Message Ordering
-   **Within a partition**: Messages are **ordered** by offset.
-   **Across partitions**: **No guaranteed order**.

**Implication**: If order matters, use the same partition key for relatedmessages.

---

## 10. Best Practices

### Topics
1.  **Naming conventions**: Use clear, descriptive names (e.g., `user.created`, `order.shipped`).
2.  **Retention policy**: Set appropriate retention time (default: 7 days).
3.  **Partition count**: More partitions = more parallelism, but more overhead. Start with 3-5 partitions per topic.

### Producers
1.  **Use keys**: For related messages that need ordering.
2.  **Batch messages**: Improves throughput (Producer batches messages before sending).
3.  **Enable compression**: Reduce network usage (`compression.type=gzip` or `snappy`).

### Consumers
1.  **Consumer groups**: Scale by adding consumers (up to partition count).
2.  **Offset management**: Commit offsets after successful processing to avoid reprocessing.
3.  **Error handling**: Implement Dead Letter Queue (DLQ) for failed messages.

### Cluster
1.  **Replication factor**: At least 3 for production.
2.  **Monitor lag**: Track consumer lag to ensure consumers keep up.
3.  **Use KRaft**: Avoid Zookeeper for new deployments.

---

## 11. Kafka Operations and Administration

### Cluster Setup and Management

#### Single-Node Cluster (Development)
```bash
# 1. Format storage for KRaft
bin/kafka-storage.sh format -t $(bin/kafka-storage.sh random-uuid) \
    -c config/kraft/server.properties

# 2. Start Kafka
bin/kafka-server-start.sh config/kraft/server.properties
```

#### Multi-Node Cluster (Production)

**Requirements**:
- Minimum 3 brokers for fault tolerance
- Each broker on a separate machine/VM
- Shared Zookeeper or KRaft cluster

**broker-1.properties**:
```properties
broker.id=1
listeners=PLAINTEXT://broker1:9092
log.dirs=/var/kafka-logs-1
```

**broker-2.properties**:
```properties
broker.id=2
listeners=PLAINTEXT://broker2:9092
log.dirs=/var/kafka-logs-2
```

**broker-3.properties**:
```properties
broker.id=3
listeners=PLAINTEXT://broker3:9092
log.dirs=/var/kafka-logs-3
```

Start each broker:
```bash
bin/kafka-server-start.sh config/broker-1.properties &
bin/kafka-server-start.sh config/broker-2.properties &
bin/kafka-server-start.sh config/broker-3.properties &
```

### Monitoring and Observability

#### Key Metrics to Monitor

| Metric Category | Metric | Description | Alert Threshold |
| :--- | :--- | :--- | :--- |
| **Broker Health** | Is ISR (In-Sync Replicas) shrinking? | Indicates replication lag | ISR < replication factor |
| **Consumer Lag** | How far behind is the consumer? | Difference between latest offset and consumer offset | Lag > 10,000 messages |
| **Throughput** | Messages per second (in/out) | Producer and consumer throughput | Sharp drops |
| **Disk Usage** | Percentage of disk used | Broker storage capacity | > 80% |
| **Network I/O** | Bytes in/out per second | Network bandwidth usage | Approaching limit |
| **Under-Replicated Partitions** | Partitions missing replicas | Data redundancy risk | > 0 |

#### Monitoring Tools

##### 1. JMX Metrics
Kafka exposes metrics via JMX (Java Management Extensions).

```bash
# Enable JMX in Kafka
export JMX_PORT=9999
bin/kafka-server-start.sh config/server.properties
```

**Common JMX Metrics**:
- `kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec`
- `kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions`
- `kafka.controller:type=KafkaController,name=ActiveControllerCount`

##### 2. Prometheus + Grafana
-   **Prometheus**: Metrics collection and storage.
-   **Grafana**: Visualization and dashboards.
-   **JMX Exporter**: Bridges Kafka JMX metrics to Prometheus.

##### 3. Kafka Manager / AKHQ / Conduktor
-   **Kafka Manager** (by Yahoo): Web-based management tool.
-   **AKHQ**: Modern Kafka GUI for viewing topics, consumers, and configs.
-   **Conduktor**: Commercial tool with advanced features.

##### 4. Consumer Lag Monitoring
```bash
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
    --describe --group my-consumer-group
```

---

## 12. Kafka Application Development

### Producer Development

#### Basic Producer Setup (Spring Boot)

**Dependency** (`pom.xml`):
```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

**Configuration** (`application.properties`):
```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
spring.kafka.producer.acks=all
spring.kafka.producer.retries=3
```

**Producer Service**:
```java
@Service
public class UserEventProducer {
    
    @Autowired
    private KafkaTemplate<String, UserEvent> kafkaTemplate;
    
    private static final String TOPIC = "user-events";
    
    public void sendUserCreatedEvent(UserEvent event) {
        kafkaTemplate.send(TOPIC, event.getUserId(), event);
    }
    
    public void sendUserCreatedEventWithCallback(UserEvent event) {
        kafkaTemplate.send(TOPIC, event.getUserId(), event)
            .addCallback(
                result -> logger.info("Sent message: {}", event),
                ex -> logger.error("Failed to send message: {}", event, ex)
            );
    }
}
```

**UserEvent POJO**:
```java
public class UserEvent {
    private String userId;
    private String eventType;
    private LocalDateTime timestamp;
    private Map<String, Object> data;
    
    // Constructors, getters, setters
}
```

#### Advanced Producer Configurations

```properties
# Acknowledgment levels
spring.kafka.producer.acks=all  # Wait for all replicas (safest, slowest)
# acks=1: Wait for leader only (default)
# acks=0: Don't wait (fastest, risky)

# Batch settings
spring.kafka.producer.batch-size=16384  # Bytes
spring.kafka.producer.linger.ms=10      # Wait up to 10ms to batch messages

# Compression
spring.kafka.producer.compression-type=gzip  # gzip, snappy, lz4, zstd

# Idempotence (prevents duplicates)
spring.kafka.producer.properties.enable.idempotence=true
```

---

## 13. Consumer Development

### Basic Consumer Setup

**Configuration** (`application.properties`):
```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=email-service
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer
spring.kafka.consumer.properties.spring.json.trusted.packages=*
spring.kafka.consumer.auto-offset-reset=earliest
```

**Consumer Service**:
```java
@Service
public class UserEventConsumer {
    
    @KafkaListener(topics = "user-events", groupId = "email-service")
    public void consumeUserEvent(UserEvent event) {
        logger.info("Received user event: {}", event);
        processEvent(event);
    }
    
    private void processEvent(UserEvent event) {
        if ("USER_CREATED".equals(event.getEventType())) {
            sendWelcomeEmail(event.getUserId());
        } else if ("USER_DELETED".equals(event.getEventType())) {
            cleanupUserData(event.getUserId());
        }
    }
}
```

### Advanced Consumer Features

#### Manual Offset Commit
```java
@KafkaListener(topics = "user-events", groupId = "email-service")
public void consumeWithManualCommit(
        ConsumerRecord<String, UserEvent> record,
        Acknowledgment acknowledgment) {
    
    try {
        processEvent(record.value());
        acknowledgment.acknowledge();  // Manual commit
    } catch (Exception e) {
        logger.error("Processing failed", e);
        // Don't acknowledge - message will be reprocessed
    }
}
```

Configuration:
```properties
spring.kafka.consumer.enable-auto-commit=false
spring.kafka.listener.ack-mode=manual
```

#### Batch Consumption
```java
@KafkaListener(topics = "user-events", groupId = "batch-processor")
public void consumeBatch(List<UserEvent> events) {
    logger.info("Received batch of {} events", events.size());
    events.forEach(this::processEvent);
}
```

Configuration:
```properties
spring.kafka.listener.type=batch
spring.kafka.consumer.max-poll-records=500
```

---

## 14. Kafka Error Handling Techniques

### 1. Retry with Backoff

**Configuration**:
```java
@Configuration
public class KafkaConfig {
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, UserEvent> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, UserEvent> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        
        // Retry configuration
        factory.setCommonErrorHandler(new DefaultErrorHandler(
            new FixedBackOff(1000L, 3L))  // 1 second backoff, 3 retries
        );
        
        return factory;
    }
}
```

### 2. Dead Letter Topic (DLT)

**Consumer with DLT**:
```java
@Service
public class UserEventConsumer {
    
    @KafkaListener(topics = "user-events", groupId = "email-service")
    public void consumeUserEvent(UserEvent event) {
        try {
            processEvent(event);
        } catch (Exception e) {
            logger.error("Failed to process event: {}", event, e);
            throw e;  // Triggers DLT
        }
    }
    
    @KafkaListener(topics = "user-events.DLT", groupId = "dlt-monitor")
    public void consumeDeadLetter(UserEvent event) {
        logger.error("Message sent to DLT: {}", event);
        // Alert operations team, store for manual review, etc.
    }
}
```

**DLT Configuration**:
```java
@Bean
public ConcurrentKafkaListenerContainerFactory<String, UserEvent> kafkaListenerContainerFactory() {
    ConcurrentKafkaListenerContainerFactory<String, UserEvent> factory = 
        new ConcurrentKafkaListenerContainerFactory<>();
    
    DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(kafkaTemplate);
    DefaultErrorHandler errorHandler = new DefaultErrorHandler(
        recoverer,
        new FixedBackOff(1000L, 3L)
    );
    
    factory.setCommonErrorHandler(errorHandler);
    return factory;
}
```

### 3. Circuit Breaker Pattern

```java
@Service
public class UserEventConsumer {
    
    private final CircuitBreaker circuitBreaker = CircuitBreaker.ofDefaults("emailService");
    
    @KafkaListener(topics = "user-events", groupId = "email-service")
    public void consumeUserEvent(UserEvent event) {
        circuitBreaker.executeRunnable(() -> processEvent(event));
    }
}
```

---

## 15. Kafka Best Practices Summary

### Operations
1.  **Monitor consumer lag**: Set up alerts for high lag.
2.  **Automate cluster management**: Use Infrastructure as Code (Terraform, Ansible).
3.  **Regular backups**: Back up topic configurations and critical data.
4.  **Capacity planning**: Monitor disk usage and plan for growth.

### Application Development
1.  **Idempotent consumers**: Design consumers to handle duplicate messages.
2.  **Schema evolution**: Use compatible schema evolution (Avro, Protobuf).
3.  **Error handling**: Implement retries, DLT, and circuit breakers.
4.  **Message size**: Keep messages small (< 1 MB).
