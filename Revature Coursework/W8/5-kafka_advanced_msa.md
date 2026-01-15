# Week 7 - Friday: Microservices Architecture

## 1. Microservices Architecture (MSA)

### Intro to SOA & Microservices

#### Service-Oriented Architecture (SOA)
-   **Definition**: architectural pattern where services communicate over a network.
-   **Characteristics**: Coarse-grained services, enterprise service bus (ESB), shared database.
-   **Challenges**: Tight coupling via ESB, complex governance, monolithic ESB becomes bottleneck.

#### Microservices
-   **Definition**: Fine-grained, independently deployable services that communicate over lightweight protocols (HTTP/REST, messaging).
-   **Evolution from SOA**: Smaller services, decentralized data management, DevOps culture.

---

## 2. What Are Microservices?

### Core Principles
1.  **Single Responsibility**: Each service does one thing well.
2.  **Independently Deployable**: Services can be deployed without affecting others.
3.  **Decentralized Data**: Each service owns its own database.
4.  **Technology Agnostic**: Services can use different tech stacks.
5.  **Resilient**: Failures are isolated; system degrades gracefully.
6.  **Observable**: Comprehensive logging, monitoring, and tracing.

---

## 3. MSA vs Monolith Applications

| Aspect | Monolith | Microservices |
| :--- | :--- | :--- |
| **Architecture** | Single codebase, single deployment unit | Multiple independent services |
| **Database** | Shared database | Distributed databases (one per service) |
| **Deployment** | Deploy entire application | Deploy individual services |
| **Scaling** | Scale entire application | Scale individual services |
| **Technology** | Single tech stack | Polyglot (different stacks per service) |
| **Development Speed** | Fast initially, slows over time | Complex initially, faster long-term |
| **Failure Impact** | Single point of failure (entire app down) | Isolated failures (one service down) |
| **Team Structure** | Single team or siloed teams | Cross-functional teams per service |
| **Complexity** | Low | High (distributed systems challenges) |

### When to Use Monolith
-   Small team (< 10 developers)
-   Simple domain
-   MVP/prototype
-   Limited scale requirements

### When to Use Microservices
-   Large teams (multiple development teams)
-   Complex domain (can be decomposed)
-   Need independent scaling
-   Polyglot requirements
-   Frequent deployments

---

## 4. Characteristics of a MSA

1.  **Componentization via Services**: Components are services, not libraries.
2.  **Organized Around Business Capabilities**: Teams own end-to-end features.
3.  **Products, Not Projects**: "You build it, you run it" philosophy.
4.  **Decentralized Governance**: Teams choose their own tools and technologies.
5.  **Decentralized Data Management**: Each service owns its data.
6.  **Infrastructure Automation**: CI/CD, automated testing, infrastructure as code.
7.  **Design for Failure**: Assume services will fail; design for resilience.
8.  **Evolutionary Design**: Services evolve independently.

---

## 5. Advantages / Disadvantages of MSA

### Advantages

| Advantage | Description |
| :--- | :--- |
| **Independent Scaling** | Scale only the services that need it |
| **Technology Flexibility** | Use the best tool for each service |
| **Fault Isolation** | One service failure doesn't bring down the entire system |
| **Faster Deployment** | Deploy services independently without full system redeployment |
| **Team Autonomy** | Teams own services end-to-end |
| **Easier to Understand** | Smaller, focused codebases |

### Disadvantages

| Disadvantage | Description |
| :--- | :--- |
| **Complexity** | Distributed systems are inherently complex |
| **Data Consistency** | No ACID transactions across services |
| **Network Latency** | Inter-service communication adds latency |
| **Testing Challenges** | Integration testing across services is difficult |
| **Operational Overhead** | More services = more to monitor and deploy |
| **Deployment Complexity** | Coordinating deployments across services |

---

## 6. Microservice Design Patterns

### API Gateway
-   **Problem**: Clients need to call multiple services.
-   **Solution**: Single entry point that routes requests to appropriate services.
-   **Benefits**: Authentication, rate limiting, request aggregation.

```
Client ──▶ API Gateway ──┬──▶ User Service
                        ├──▶ Order Service
                        └──▶ Payment Service
```

### Service Discovery (Eureka)
-   **Problem**: Services need to find each other without hardcoded IPs.
-   **Solution**: Services register themselves; clients query the registry.

```
Service A ──register──▶ Eureka Server
Service B ──register──▶ Eureka Server

Client ──query──▶ Eureka Server ──returns──▶ Service A location
```

### Circuit Breaker
-   **Problem**: Cascading failures when a service is down.
-   **Solution**: "Trip" the circuit after N failures; return fallback response.

**States**:
1.  **Closed**: Normal operation.
2.  **Open**: Too many failures; reject requests immediately.
3.  **Half-Open**: Allow limited requests to test if service recovered.

### Event-Driven Communication
-   **Problem**: Tight coupling via synchronous REST calls.
-   **Solution**: Services communicate via events (Kafka).

### Saga Pattern
-   **Problem**: No distributed transactions across services.
-   **Solution**: Break transaction into local transactions with compensating actions.

**Example**: Order placement
1.  **Order Service**: Create order (local transaction).
2.  **Payment Service**: Charge payment (local transaction).
3.  **Inventory Service**: Reserve items (local transaction).
4.  **If inventory fails**: Compensate (refund payment, cancel order).

---

## 7. CQRS (Command Query Responsibility Segregation)

### What is CQRS?
A pattern that separates **Read** operations from **Write** operations.

### Traditional Approach (Same Model)
```
Client ──┬──Write──▶ Service ──▶ Database
         └──Read───▶ Service ──▶ Database
```

### CQRS Approach (Separate Models)
```
Client ──Write (Command)──▶ Command Service ──▶ Write DB

Client ──Read (Query)─────▶ Query Service ──▶ Read DB (Materialized View)

Command Service ──Events──▶ Kafka ──▶ Query Service (updates Read DB)
```

### Benefits
-   **Optimized Models**: Write model optimized for consistency; read model optimized for queries.
-   **Independent Scaling**: Scale reads and writes independently.
-   **Performance**: Read models can be denormalized, cached, or use different databases (e.g., Elasticsearch).

### Use Cases
-   High read-to-write ratio
-   Complex queries
-   Event sourcing

### Example with Kafka
```java
// Command Service
@Service
public class OrderCommandService {
    
    @Autowired
    private OrderRepository orderRepo;
    
    @Autowired
    private KafkaTemplate<String, OrderEvent> kafkaTemplate;
    
    public void createOrder(Order order) {
        Order saved = orderRepo.save(order);  // Write to SQL
        
        OrderEvent event = new OrderEvent("ORDER_CREATED", saved);
        kafkaTemplate.send("order-events", event);  // Publish event
    }
}

// Query Service
@Service
public class OrderQueryService {
    
    @Autowired
    private ElasticsearchRepository elasticRepo;
    
    @KafkaListener(topics = "order-events")
    public void handleOrderEvent(OrderEvent event) {
        if ("ORDER_CREATED".equals(event.getType())) {
            OrderView view = createOrderView(event);
            elasticRepo.save(view);  // Update read model (Elasticsearch)
        }
    }
    
    public List<OrderView> searchOrders(String query) {
        return elasticRepo.search(query);  // Fast search on read model
    }
}
```

---

## 8. Best Practices for Microservices

1.  **Start with a monolith**: Don't over-engineer early.
2.  **Define service boundaries**: Use domain-driven design (DDD).
3.  **API versioning**: Version APIs to avoid breaking changes.
4.  **Centralized logging**: Use ELK stack or similar for distributed tracing.
5.  **Service mesh**: Consider Istio or Linkerd for complex service topologies.
