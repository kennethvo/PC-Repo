# Week 10 - Wednesday: ELK Stack Introduction - Centralized Logging and Monitoring

## 1. What is the ELK Stack?

**ELK** is an acronym for three open-source projects:
- **E**lasticsearch: Search and analytics engine
- **L**ogstash: Data processing pipeline
- **K**ibana: Visualization and dashboard tool

Together, they provide a complete solution for **collecting**, **processing**, **storing**, **searching**, and **visualizing** log data.

### Modern ELK Stack

The stack has evolved to include **Beats**:

**Full Stack** = **Beats + Elasticsearch + Logstash + Kibana** = **Elastic Stack**

```
Beats → Logstash → Elasticsearch → Kibana
(Collect) (Process)  (Store/Search) (Visualize)
```

---

## 2. Why Use the ELK Stack?

### The Problem: Distributed Logging Challenges

**Traditional Logging Issues**:
```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Server 1 │   │ Server 2 │   │ Server 3 │
│  app.log │   │  app.log │   │  app.log │
└──────────┘   └──────────┘   └──────────┘
     ↓              ↓              ↓
   SSH in       SSH in         SSH in
   grep logs    grep logs      grep logs
```

**Problems**:
- Logs scattered across multiple servers
- Manual SSH to each server
- No centralized search
- Hard to correlate events across services
- No real-time monitoring
- Difficult to troubleshoot distributed systems

### The ELK Solution

```
Multiple Sources → Centralized Platform → Unified View
                   
┌──────────┐                                        
│Apps      │──┐                                     
│Servers   │  │      ┌─────────────────────┐         ┌─────────┐
│Containers│  ├─────▶│   ELK Stack         │────────▶│ Single  │
│Databases │  │      │ (Unified Platform)  │         │Dashboard│
│Network   │──┘      └─────────────────────┘         └─────────┘
└──────────┘                                        
```

**Benefits**:
✅ **Centralized**: All logs in one place  
✅ **Searchable**: Full-text search across all logs  
✅ **Real-time**: See events as they happen  
✅ **Scalable**: Handle billions of log events  
✅ **Visual**: Beautiful dashboards and graphs  
✅ **Alerting**: Get notified of issues automatically  

---

## 3. How Does the ELK Stack Work?

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DATA SOURCES                            │
│  Applications • Servers • Containers • Databases • IoT      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    1. DATA COLLECTION                       │
│                     ┌──────────┐                            │
│                     │  Beats   │  Lightweight shippers      │
│                     └──────────┘                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  2. DATA PROCESSING                         │
│                    ┌──────────┐                             │
│                    │ Logstash │  Parse, transform, enrich   │
│                    └──────────┘                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   3. DATA STORAGE                           │
│                  ┌───────────────┐                          │
│                  │ Elasticsearch │  Index and search        │
│                  └───────────────┘                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  4. DATA VISUALIZATION                      │
│                     ┌────────┐                              │
│                     │ Kibana │  Dashboards and analytics    │
│                     └────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Collection with Beats

### What are Beats?

**Beats** are lightweight data shipper agents that send data from edge machines to Logstash or Elasticsearch.

### Types of Beats

| Beat | Purpose | Data Source |
|------|---------|-------------|
| **Filebeat** | Log files | Application logs, system logs |
| **Metricbeat** | System metrics | CPU, memory, disk, network |
| **Packetbeat** | Network traffic | HTTP, DNS, MySQL packets |
| **Auditbeat** | Audit data | File integrity, Linux auditd |
| **Heartbeat** | Uptime monitoring | Service availability |
| **Winlogbeat** | Windows events | Windows event logs |
| **Functionbeat** | Cloud data | AWS Lambda, CloudWatch |

### Filebeat Architecture

```
┌─────────────────────────────────────┐
│         Application Server          │
│  ┌──────────────────────────────┐  │
│  │  /var/log/app/application.log│  │
│  │  /var/log/nginx/access.log   │  │
│  │  /var/log/mysql/error.log    │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│          ┌────▼────┐                │
│          │Filebeat │                │
│          │ Agent   │                │
│          └────┬────┘                │
└───────────────┼─────────────────────┘
                │
                ▼
        ┌───────────────┐
        │  Logstash or  │
        │ Elasticsearch │
        └───────────────┘
```

### Filebeat Configuration Example

```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/app/*.log
    fields:
      service_name: user-service
      environment: production
    multiline:
      pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
      negate: true
      match: after

output.logstash:
  hosts: ["logstash:5044"]
```

---

## 5. Data Processing with Logstash

### What is Logstash?

**Logstash** is a server-side data processing pipeline that:
- **Ingests** data from multiple sources
- **Transforms** and enriches data
- **Sends** data to a "stash" (usually Elasticsearch)

### Logstash Pipeline

```
Input → Filter → Output
        
┌─────────┐    ┌────────┐    ┌──────────┐
│ Ingest  │───▶│Transform│───▶│  Store   │
└─────────┘    └────────┘    └──────────┘
```

### Logstash Configuration

**Structure**:
```conf
input {
  # Where data comes from
}

filter {
  # How to process data
}

output {
  # Where to send data
}
```

### Example: Processing Application Logs

```conf
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  # Parse JSON logs
  json {
    source => "message"
  }
  
  # Extract fields from timestamp
  date {
    match => ["timestamp", "ISO8601"]
  }
  
  # Add geolocation from IP
  geoip {
    source => "client_ip"
  }
  
  # Categorize log level
  mutate {
    add_field => {
      "severity" => "%{[log][level]}"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "application-logs-%{+YYYY.MM.dd}"
  }
  
  # Also output to stdout for debugging
  stdout {
    codec => rubydebug
  }
}
```

### Common Logstash Filters

#### 1. Grok (Pattern Matching)

Extract structured data from unstructured logs:

```conf
filter {
  grok {
    match => {
      "message" => "%{IP:client_ip} - - \[%{HTTPDATE:timestamp}\] \"%{WORD:http_method} %{URIPATHPARAM:request_path} HTTP/%{NUMBER:http_version}\" %{NUMBER:response_code} %{NUMBER:bytes}"
    }
  }
}
```

**Input**:
```
192.168.1.100 - - [10/Dec/2024:08:30:15 +0000] "GET /api/users HTTP/1.1" 200 1234
```

**Output** (parsed fields):
```json
{
  "client_ip": "192.168.1.100",
  "timestamp": "10/Dec/2024:08:30:15 +0000",
  "http_method": "GET",
  "request_path": "/api/users",
  "http_version": "1.1",
  "response_code": "200",
  "bytes": "1234"
}
```

#### 2. JSON

Parse JSON-formatted logs:

```conf
filter {
  json {
    source => "message"
  }
}
```

#### 3. Mutate

Modify fields:

```conf
filter {
  mutate {
    add_field => { "environment" => "production" }
    remove_field => ["_temp_field"]
    rename => { "old_name" => "new_name" }
    convert => { "response_time" => "integer" }
  }
}
```

#### 4. Date

Parse timestamps:

```conf
filter {
  date {
    match => ["log_timestamp", "yyyy-MM-dd HH:mm:ss"]
    target => "@timestamp"
  }
}
```

---

## 6. Data Storage with Elasticsearch

### What is Elasticsearch?

**Elasticsearch** is a distributed, RESTful search and analytics engine built on Apache Lucene.

### Key Characteristics

- **Distributed**: Data spread across nodes/shards
- **Scalable**: Add nodes to handle more data
- **Near Real-Time**: Sub-second search latency
- **Schema-Free**: No predefined schema (dynamic mapping)
- **RESTful API**: Interact via HTTP/JSON

### Elasticsearch Concepts

| Concept | Description | Relational DB Equivalent |
|---------|-------------|-------------------------|
| **Cluster** | Collection of nodes | Database cluster |
| **Node** | Single Elasticsearch instance | Database server |
| **Index** | Collection of documents | Database |
| **Document** | JSON object | Row/Record |
| **Field** | Key-value pair | Column |
| **Shard** | Subset of index data | Partition |
| **Replica** | Copy of shard | Replication |

### Elasticsearch Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Elasticsearch Cluster               │
│                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │  Node 1    │  │  Node 2    │  │  Node 3    │  │
│  │            │  │            │  │            │  │
│  │ Shard 0    │  │ Shard 1    │  │ Shard 2    │  │
│  │ Shard 1(R) │  │ Shard 2(R) │  │ Shard 0(R) │  │
│  └────────────┘  └────────────┘  └────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
        ↑                                    ↑
        │                                    │
    Write/Index                          Read/Search
```

### Indexing Documents

**Create Index**:
```bash
PUT /application-logs
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "level": { "type": "keyword" },
      "message": { "type": "text" },
      "service_name": { "type": "keyword" },
      "user_id": { "type": "keyword" }
    }
  }
}
```

**Index Document**:
```bash
POST /application-logs/_doc
{
  "timestamp": "2024-12-10T08:30:15Z",
  "level": "ERROR",
  "message": "Failed to connect to database",
  "service_name": "user-service",
  "user_id": "user123"
}
```

###  Searching Data

**Basic Search**:
```bash
GET /application-logs/_search
{
  "query": {
    "match": {
      "message": "database"
    }
  }
}
```

**Advanced Search**:
```bash
GET /application-logs/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "service_name": "user-service" } },
        { "range": { "timestamp": { "gte": "now-1h" } } }
      ],
      "filter": [
        { "term": { "level": "ERROR" } }
      ]
    }
  },
  "aggs": {
    "errors_per_service": {
      "terms": { "field": "service_name" }
    }
  },
  "sort": [
    { "timestamp": "desc" }
  ]
}
```

---

## 7. Data Visualization with Kibana

### What is Kibana?

**Kibana** is a data visualization and exploration tool for Elasticsearch.

### Key Features

- **Dashboards**: Create custom visualizations
- **Discover**: Explore and search data interactively
- **Visualize**: Charts, graphs, maps, and more
- **Canvas**: Create infographic-style presentations
- **Alerts**: Set up notifications based on data patterns
- **Machine Learning**: Detect anomalies automatically

### Kibana Workflow

```
1. Connect to Elasticsearch
   └─▶ Kibana reads index pattern

2. Discover Data
   └─▶ Explore logs interactively

3. Create Visualizations
   └─▶ Line charts, bar charts, pie charts, etc.

4. Build Dashboards
   └─▶ Combine multiple visualizations

5. Set up Alerts
   └─▶ Get notified of issues
```

### Creating Visualizations

#### Example: Error Rate Over Time

1. **Select Visualization Type**: Line Chart
2. **Configure Metrics**:
   - Y-axis: Count of documents
   - Filter: `level: ERROR`
3. **Configure Buckets**:
   - X-axis: Date Histogram
   - Field: `@timestamp`
   - Interval: 5 minutes
4. **Apply**: Generate chart

#### Example: Top Error Messages

1. **Visualization Type**: Table
2. **Metrics**: Count
3. **Buckets**:
   - Split Rows: Terms aggregation
   - Field: `message.keyword`
   - Size: 10
4. **Result**: Top 10 most frequent error messages

---

## 8. Complete ELK Workflow Example

### Scenario: Monitoring Spring Boot Microservices

**Stack Configuration**:
```
Spring Boot Apps (3 services)
    ↓
Filebeat (on each server)
    ↓
Logstash (parse and enrich)
    ↓
Elasticsearch (store and search)
    ↓
Kibana (visualize and alert)
```

### Step 1: Configure Spring Boot Logging

```yaml
# application.yml
logging:
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
  file:
    name: /var/log/app/application.log
  level:
    root: INFO
    com.example: DEBUG
```

**Logback Configuration** (logback-spring.xml):
```xml
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>/var/log/app/application.log</file>
    <encoder class="net.logstash.logback.encoder.LogstashEncoder" />
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>/var/log/app/application.%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
  </appender>
  
  <root level="INFO">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

### Step 2: Deploy Filebeat

```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    paths:
      - /var/log/app/application.log
    json.keys_under_root: true
    json.add_error_key: true
    fields:
      service: user-service
      environment: production

output.logstash:
  hosts: ["logstash:5044"]
```

### Step 3: Configure Logstash

```conf
input {
  beats {
    port => 5044
  }
}

filter {
  # Add service metadata
  mutate {
    add_field => {
      "[@metadata][index_prefix]" => "spring-%{[fields][service]}"
    }
  }
  
  # Parse exception stack traces
  if [level] == "ERROR" {
    mutate {
      add_tag => ["error"]
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "%{[@metadata][index_prefix]}-%{+YYYY.MM.dd}"
  }
}
```

### Step 4: Create Kibana Dashboard

**Visualizations to Create**:
1. **Log Volume Over Time**: Line chart showing log count per 5 minutes
2. **Error Rate**: Area chart of ERROR level logs
3. **Top Services**: Pie chart of log distribution across services
4. **Recent Errors**: Table of last 10 errors with timestamps
5. **Response Time**: Avg response time line chart (if logged)

**Dashboard Layout**:
```
┌──────────────────────────────────────────────────┐
│          Application Logs Dashboard              │
├───────────────────┬──────────────────────────────┤
│ Log Volume        │  Error Rate                  │
│ (Line Chart)      │  (Area Chart)                │
├───────────────────┼──────────────────────────────┤
│ Top Services      │  Recent Errors               │
│ (Pie Chart)       │  (Table)                     │
├───────────────────┴──────────────────────────────┤
│ Response Time Metrics                            │
│ (Multi-line Chart)                               │
└──────────────────────────────────────────────────┘
```

---

## 9. Benefits of Centralized Logging

### 1. Faster Troubleshooting

**Without ELK**:
```
Problem: User reports login failure
→ SSH to web server → check logs
→ SSH to auth server → check logs
→ SSH to database server → check logs
→ 30 minutes to find root cause
```

**With ELK**:
```
Problem: User reports login failure
→ Search Kibana: "user_id:12345 AND level:ERROR"
→ See all related logs across services
→ 2 minutes to find root cause
```

### 2. Real-Time Monitoring

- **Detect issues immediately**: Alert on error spike
- **Monitor trends**: Track metrics over time
- **Proactive response**: Fix before users complain

### 3. Compliance and Auditing

- **Audit trails**: Who accessed what and when
- **Data retention**: Keep logs for regulatory requirements
- **Security**: Detect unauthorized access attempts

### 4. Performance Analysis

- **Identify slow operations**: Track response times
- **Capacity planning**: Analyze usage patterns
- **Optimize resources**: Find inefficiencies

---

## 10. Best Practices

### Logging Best Practices

1. **Use Structured Logging (JSON)**:
   ```json
   {
     "timestamp": "2024-12-10T08:30:15Z",
     "level": "ERROR",
     "service": "user-service",
     "message": "Database connection failed",
     "user_id": "user123",
     "error": "ConnectionTimeout"
   }
   ```

2. **Include Context**:
   - User ID
   - Request ID (for tracking across services)
   - Session ID
   - Timestamp

3. **Log Levels**:
   - **ERROR**: Failures requiring attention
   - **WARN**: Issues that don't stop execution
   - **INFO**: Important events (login, checkout)
   - **DEBUG**: Detailed diagnostic information

4. **Don't Log Sensitive Data**:
   - ❌ Passwords
   - ❌ Credit card numbers
   - ❌ Personal identifiable information (PII)

### ELK Stack Best Practices

1. **Index Lifecycle Management**:
   - Delete old indices (e.g., after 30 days)
   - Archive to cheaper storage
   - Rollover when index gets too large

2. **Shard Strategy**:
   - Don't over-shard (performance impact)
   - Aim for 20-40GB per shard
   - Use index templates

3. **Security**:
   - Enable authentication (X-Pack Security)
   - Use HTTPS
   - Role-based access control

4. **Monitoring**:
   - Monitor Elasticsearch cluster health
   - Track disk usage
   - Set up alerts for critical issues

---

## 11. Common Use Cases

### 1. Application Performance Monitoring (APM)

Track application metrics:
- Response times
- Error rates
- Slow queries
- Resource usage

### 2. Security Information and Event Management (SIEM)

Detect security threats:
- Failed login attempts
- Unusual access patterns
- Suspicious network traffic

### 3. Business Analytics

Analyze business metrics:
- User behavior patterns
- Conversion funnels
- A/B test results

### 4. Infrastructure Monitoring

Track system health:
- Server metrics (CPU, memory, disk)
- Container metrics (Docker, Kubernetes)
- Network metrics

---

## Summary

The ELK Stack provides a complete solution for:
✅ **Collecting** logs from distributed systems  
✅ **Processing** and enriching log data  
✅ **Storing** massive amounts of data efficiently  
✅ **Searching** logs in real-time  
✅ **Visualizing** data with beautiful dashboards  
✅ **Alerting** on important events  

**Next**: We'll dive deep into each ELK component (Elasticsearch, Logstash, Beats, Kibana) and set up a complete logging pipeline for Spring Boot! 🚀
