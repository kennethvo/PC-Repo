# Week 10 - Tuesday: Apache JMeter - Performance and Load Testing

## 1. What is Apache JMeter?

**Apache JMeter** is an open-source Java application designed to load test functional behavior and measure performance.

### History
- Created by Apache Software Foundation
- Originally designed for testing web applications
- Now supports multiple protocols and applications

### Key Characteristics
- **100% Pure Java**: Cross-platform (Windows, Linux, macOS)
- **Open Source**: Free to use, active community
- **Protocol Support**: HTTP, HTTPS, SOAP, REST, FTP, JDBC, JMS, LDAP, TCP, and more
- **GUI and CLI**: Interactive design in GUI, execution in CLI
- **Extensible**: Plugin architecture for custom functionality

---

## 2. Functions of Apache JMeter

### Primary Functions

#### 1. Performance Testing
Measure system performance under specific load:
- Response times
- Throughput (requests per second)
- Resource utilization

#### 2. Load Testing
Simulate multiple users accessing the system concurrently:
- Identify bottlenecks
- Determine maximum capacity
- Test scalability

#### 3. Stress Testing
Push system beyond normal operational capacity:
- Find breaking points
- Test recovery mechanisms
- Identify failure modes

#### 4. Functional Testing
Verify application functionality:
- API contract testing
- Response validation
- End-to-end workflows

### What JMeter Can Test

| Application Type | Examples | Protocol |
|------------------|----------|----------|
| **Web Applications** | E-commerce sites, portals | HTTP/HTTPS |
| **REST APIs** | Microservices, JSON APIs | HTTP/REST |
| **SOAP Web Services** | Enterprise services | SOAP/XML |
| **Databases** | CRUD operations, queries | JDBC |
| **Message Queues** | Kafka, RabbitMQ, ActiveMQ | JMS |
| **FTP Servers** | File uploads/downloads | FTP |
| **Mail Servers** | Email services | SMTP, POP3, IMAP |
| **TCP Services** | Custom protocols | TCP |

---

## 3. How Does Apache JMeter Work?

### JMeter Architecture

```
┌────────────────────────────────────────────────────────┐
│                    JMeter Client                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │             Test Plan (XML)                      │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │ │
│  │  │Thread Group│  │  Samplers  │  │ Listeners  │ │ │
│  │  └────────────┘  └────────────┘  └────────────┘ │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │    Target Application          │
        │  (Web Server, API, Database)   │
        └────────────────────────────────┘
```

### Execution Flow

```
1. Create Test Plan
   └─▶ Define what to test

2. Add Thread Group
   └─▶ Simulate users/load

3. Add Samplers
   └─▶ Define requests (HTTP, JDBC, etc.)

4. Add Listeners
   └─▶ Collect and visualize results

5. Run Test
   └─▶ Execute test plan

6. Analyze Results
   └─▶ Identify issues and bottlenecks
```

### Key Components

#### Thread Group
Simulates concurrent users:
```
Number of Threads (Users): 100
Ramp-Up Period: 10 seconds
Loop Count: 10

= 100 users added over 10 seconds, each executing 10 iterations
= Total requests: 100 × 10 = 1000
```

#### Samplers
Generate requests to the server:
- **HTTP Request**: REST API calls
- **JDBC Request**: Database queries
- **JMS Publisher**: Message queue
- **FTP Request**: File operations

#### Assertions
Validate responses:
- Response code (200, 404, 500)
- Response text contains expected data
- Response time < threshold
- JSON/XML structure

#### Listeners
Collect and display results:
- **View Results Tree**: Individual request/response
- **Summary Report**: Aggregate statistics
- **Graph Results**: Visual charts
- **Aggregate Graph**: Performance metrics

---

## 4. Installing Apache JMeter

### Prerequisites
- **Java JDK 8+** (JMeter is a Java application)

### Installation Steps

#### Method 1: Download Binary

**Windows/Linux/macOS**:
```bash
# 1. Download from Apache JMeter website
wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.zip

# 2. Extract
unzip apache-jmeter-5.6.3.zip

# 3. Navigate to bin directory
cd apache-jmeter-5.6.3/bin

# 4. Run JMeter
# Windows:
jmeter.bat

# Linux/macOS:
./jmeter.sh
```

#### Method 2: Package Manager

**macOS (Homebrew)**:
```bash
brew install jmeter
jmeter
```

**Linux (APT)**:
```bash
sudo apt update
sudo apt install jmeter
jmeter
```

### Verification

```bash
# Check Java version first
java -version  # Should be 8+

# Launch JMeter GUI
jmeter

# Check JMeter version
jmeter --version
```

---

## 5. Running JMeter

### GUI Mode (Design Phase)

**Use for**: Creating and debugging test plans

```bash
# Start GUI
jmeter
```

**GUI Features**:
- Visual test plan design
- Real-time results viewing
- Debugging requests
- Configuration

**⚠️ Important**: Don't use GUI mode for actual load testing (resource-intensive)

### CLI Mode (Execution Phase)

**Use for**: Running actual load tests

```bash
# Basic execution
jmeter -n -t test_plan.jmx -l results.jtl

# With options
jmeter -n \
  -t test_plan.jmx \
  -l results.jtl \
  -j jmeter.log \
  -e \
  -o report_output

# Options explained:
# -n : Non-GUI mode
# -t : Test plan file
# -l : Results file
# -j : Log file
# -e : Generate HTML report
# -o : Output folder for report
```

### Distributed Testing (Multiple Machines)

```bash
# On master machine
jmeter -n -t test.jmx -R server1,server2,server3

# For large-scale tests with thousands of users
```

---

## 6. Creating Your First Test Plan

### Scenario: Test a REST API

**Goal**: Load test a Spring Boot REST API endpoint

```
GET http://localhost:8080/api/users
```

### Step-by-Step Guide

#### Step 1: Create Test Plan

1. Launch JMeter
2. Right-click **Test Plan** → Add → Threads (Users) → Thread Group

#### Step 2: Configure Thread Group

```
Name: User Load Simulation
Number of Threads (users): 50
Ramp-Up Period (seconds): 10
Loop Count: 5

= 50 users added over 10 seconds
= Each user makes 5 requests
= Total requests: 250
```

#### Step 3: Add HTTP Request Sampler

1. Right-click Thread Group → Add → Sampler → HTTP Request

Configuration:
```
Name: Get All Users
Protocol: http
Server Name or IP: localhost
Port Number: 8080
HTTP Request: GET
Path: /api/users
```

#### Step 4: Add Listeners

Right-click Thread Group → Add → Listener → Select:
- **View Results Tree** (for debugging)
- **Summary Report** (for metrics)
- **Graph Results** (for visualization)

#### Step 5: Add Assertion (Optional)

Right-click HTTP Request → Add → Assertions → Response Assertion

```
Field to Test: Response Code
Pattern Matching Rules: Equals
Patterns to Test: 200
```

#### Step 6: Run Test

1. Click **Run** button (green triangle)
2. View results in listeners

---

## 7. Complete Example: Testing Spring Boot API

### Sample Spring Boot Endpoint

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        // Simulated delay
        Thread.sleep(100);
        return ResponseEntity.ok(userService.findAll());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userService.save(user);
        return ResponseEntity.status(201).body(saved);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
```

### JMeter Test Plan Structure

```
Test Plan: User API Load Test
│
├── Thread Group: Light Load
│   ├── Number of Threads: 10
│   ├── Ramp-Up: 5 seconds
│   └── Loop Count: 10
│
├── Thread Group: Heavy Load
│   ├── Number of Threads: 100
│   ├── Ramp-Up: 30 seconds
│   └── Loop Count: 20
│
├── HTTP Request Defaults
│   ├── Protocol: http
│   ├── Server: localhost
│   └── Port: 8080
│
├── HTTP Cookie Manager
│
├── Samplers
│   ├── GET /api/users (List all)
│   ├── GET /api/users/1 (Get by ID)
│   └── POST /api/users (Create user)
│
├── Assertions
│   ├── Response Assertion (status = 200)
│   └── Duration Assertion (< 500ms)
│
└── Listeners
    ├── View Results Tree
    ├── Summary Report
    ├── Aggregate Report
    └── Response Time Graph
```

### Setting Up HTTP Header Manager

For JSON APIs:
```
Right-click Thread Group → Add → Config Element → HTTP Header Manager

Add:
Content-Type: application/json
Accept: application/json
```

### POST Request with JSON Body

```
Name: Create User
Method: POST
Path: /api/users

Body Data:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe${__Random(1,10000)}@example.com"
}
```

**Note**: `${__Random(1,10000)}` generates unique emails for each request

---

## 8. JMeter Functions and Variables

### Built-in Functions

```
${__Random(1,100)}           # Random number 1-100
${__RandomString(10,abc)}    # Random string of length 10
${__time(yyyy-MM-dd)}        # Current date
${__UUID()}                  # Random UUID
${__counter(,)}              # Incrementing counter
${__threadNum}               # Current thread number
```

### Example: Dynamic Test Data

```json
{
  "userId": "${__UUID()}",
  "username": "user${__counter(,)}",
  "email": "user${__threadNum}@test.com",
  "createdAt": "${__time(yyyy-MM-dd'T'HH:mm:ss)}"
}
```

### Using CSV Data Set Config

**users.csv**:
```csv
firstName,lastName,email
John,Doe,john@example.com
Jane,Smith,jane@example.com
Bob,Johnson,bob@example.com
```

**Configuration**:
```
Right-click Thread Group → Add → Config Element → CSV Data Set Config

Filename: users.csv
Variable Names: firstName,lastName,email
```

**Usage in HTTP Request**:
```json
{
  "firstName": "${firstName}",
  "lastName": "${lastName}",
  "email": "${email}"
}
```

---

## 9. Understanding JMeter Reports

### Summary Report Metrics

| Metric | Description | Good Value |
|--------|-------------|------------|
| **Samples** | Number of requests sent | - |
| **Average** | Average response time (ms) | < 200ms |
| **Min** | Fastest response time | - |
| **Max** | Slowest response time | - |
| **Std. Dev.** | Standard deviation | Lower = consistent |
| **Error %** | Percentage of failed requests | < 1% |
| **Throughput** | Requests per second | Higher is better |
| **Received KB/sec** | Data received rate | - |
| **Sent KB/sec** | Data sent rate | - |

### Sample Report Analysis

```
Label         Samples  Avg    Min   Max   Std.Dev  Error%  Throughput
GET /users    1000     150ms  50ms  2000ms  200ms   0.5%    100/sec
POST /users   500      300ms  100ms 3000ms  400ms   2.0%    50/sec
GET /users/1  1000     80ms   30ms  1000ms  100ms   0.0%    120/sec
```

**Analysis**:
- GET `/users`: Good average (150ms), but high max (2s) suggests occasional slowness
- POST `/users`: Higher error rate (2%) needs investigation
- GET `/users/1`: Best performance, consistent (low std. dev.)

---

## 10. Performance Testing Best Practices

### 1. Define Clear Objectives

```
Good: "API should handle 100 req/sec with <200ms avg response time"
Bad:  "Make it fast"
```

### 2. Use Realistic Test Data

- **Production-like data volumes**
- **Varied input data**
- **Edge cases** (empty, null, very long strings)

### 3. Ramp-Up Users Gradually

```
Bad:  0 → 1000 users instantly (unrealistic spike)
Good: 0 → 1000 users over 5 minutes (realistic ramp-up)
```

### 4. Monitor Server Resources

While JMeter runs, monitor:
- CPU usage
- Memory consumption
- Database connections
- Thread pools
- Network I/O

### 5. Run Tests from Multiple Locations

- Simulate geographic distribution
- Test network latency
- Identify region-specific issues

### 6. Establish Baselines

```
Test 1 (Baseline): 50 users, 100ms avg response time
Test 2 (After changes): 50 users, 150ms avg response time
= 50% performance degradation
```

### 7. Test Incrementally

```
Test 1: 10 users
Test 2: 50 users
Test 3: 100 users
Test 4: 500 users
= Find exact breaking point
```

---

## 11. Common JMeter Patterns

### Pattern 1: Spike Testing

```
Thread Group 1: Baseline (10 users, continuous)
Thread Group 2: Spike (1000 users, 5 seconds ramp-up)

Schedule:
0-60s:   Baseline running
60-65s:  Add 1000 users (spike)
65-120s: Both running
120s:    End
```

### Pattern 2: Endurance Testing

```
Thread Group: 100 users
Duration: 8 hours
Loop: Forever

= Tests for memory leaks, resource exhaustion
```

### Pattern 3: Workflow Testing

```
1. Login (POST /auth/login)
2. Get User Profile (GET /api/users/me)
3. Update Profile (PUT /api/users/me)
4. Logout (POST /auth/logout)

= Tests complete user journey
```

---

## 12. Integrating JMeter with CI/CD

### Running in Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        
        stage('Deploy to Test') {
            steps {
                sh './deploy-test.sh'
            }
        }
        
        stage('Performance Test') {
            steps {
                sh '''
                    jmeter -n \
                      -t tests/load-test.jmx \
                      -l results.jtl \
                      -e -o report
                '''
                
                // Publish HTML report
                publishHTML([
                    reportDir: 'report',
                    reportFiles: 'index.html',
                    reportName: 'JMeter Report'
                ])
            }
        }
        
        stage('Validate Performance') {
            steps {
                script {
                    // Fail build if error rate > 1%
                    def errorRate = sh(
                        script: "awk -F',' 'NR>1 {sum+=$7; count++} END {print sum/count}' results.jtl",
                        returnStdout: true
                    ).trim().toFloat()
                    
                    if (errorRate > 1.0) {
                        error("Error rate ${errorRate}% exceeds threshold")
                    }
                }
            }
        }
    }
}
```

---

## 13. Troubleshooting Common Issues

### Issue 1: Connection Refused

**Error**: `java.net.ConnectException: Connection refused`

**Solutions**:
- Check server is running
- Verify host and port
- Check firewall rules
- Test with curl/browser first

### Issue 2: Out of Memory

**Error**: `java.lang.OutOfMemoryError`

**Solutions**:
```bash
# Increase JMeter heap size
export HEAP="-Xms1g -Xmx4g"
jmeter -n -t test.jmx
```

### Issue 3: Too Many Open Files

**Error**: `java.net.SocketException: Too many open files`

**Solution (Linux)**:
```bash
# Increase file descriptor limit
ulimit -n 10000
```

### Issue 4: Inconsistent Results

**Solutions**:
- Run multiple test iterations
- Ensure server resources are stable
- Check for external factors (network, other processes)
- Use consistent test environment

---

## 14. Advanced Topics Preview

### JMeter Plugins
- **Plugins Manager**: Install additional features
- **Custom Samplers**: Protocol support
- **Advanced Graphs**: Better visualization

### Distributed Testing
- Master-slave architecture
- Test with 10,000+ users
- Coordinate multiple JMeter instances

### Performance Tuning
- JMeter configuration optimization
- Java tuning for JMeter
- Network optimization

---

## 15. Hands-On Exercise

### Exercise: Load Test Your Spring Boot Application

**Objective**: Create a complete JMeter test plan for a REST API

**Requirements**:
1. Thread Group: 50 users, 10 second ramp-up, 5 loops
2. Test 3 endpoints: GET all, GET by ID, POST create
3. Add assertions for response codes
4. Generate HTML report
5. Analyze results and identify bottlenecks

**Acceptance Criteria**:
- All requests return 2xx status codes
- Average response time < 500ms
- Error rate < 1%
- Throughput > 50 req/sec

---

## Summary

Apache JMeter is a powerful tool for:
✅ **Load testing** web applications and APIs  
✅ **Measuring performance** under various conditions  
✅ **Identifying bottlenecks** before production  
✅ **Automating performance tests** in CI/CD  
✅ **Generating detailed reports** for analysis  

**Next**: We'll explore the ELK Stack for centralized logging and monitoring! 🚀
