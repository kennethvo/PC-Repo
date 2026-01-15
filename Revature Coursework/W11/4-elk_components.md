# Week 10 - Thursday: ELK Stack Components Deep Dive

## 1. Elasticsearch - The Search and Analytics Engine

### What is Elasticsearch?

**Elasticsearch** is a distributed, RESTful search and analytics engine capable of addressing a growing number of use cases.

### Core Capabilities

1. **Full-Text Search**: Advanced text search with relevance scoring
2. **Analytics**: Aggregations for metrics and analytics
3. **Distributed**: Scales horizontally across multiple nodes
4. **Near Real-Time**: Sub-second search latency
5. **Schema-Free**: Dynamic mapping (no predefined schema required)

---

## 2. Elasticsearch Architecture

### Cluster, Nodes, and Shards

```
┌───────────────────────────────────────────────────────────┐
│              Elasticsearch Cluster (Production)           │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Node 1     │  │   Node 2     │  │   Node 3     │     │
│  │  (Master)    │  │  (Data)      │  │  (Data)      │     │
│  │              │  │              │  │              │     │
│  │ ┌────────┐   │  │ ┌────────┐   │  │ ┌────────┐   │     │
│  │ │Index:  │   │  │ │Index:  │   │  │ │Index:  │   │     │
│  │ │logs    │   │  │ │logs    │   │  │ │logs    │   │     │
│  │ │Shard 0 │   │  │ │Shard 1 │   │  │ │Shard 2 │   │     │
│  │ │(Primary)│  │  │ │(Primary)│  │  │ │(Primary)│  │     │
│  │ └────────┘   │  │ └────────┘   │  │ └────────┘   │     │
│  │              │  │              │  │              │     │
│  │ ┌────────┐   │  │ ┌────────┐   │  │ ┌────────┐   │     │
│  │ │Shard 1 │   │  │ │Shard 2 │   │  │ │Shard 0 │   │     │
│  │ │(Replica)│  │  │ │(Replica)│  │  │ │(Replica)│  │     │
│  │ └────────┘   │  │ └────────┘   │  │ └────────┘   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────────────────────────────────────────┘
```

### Node Types

| Node Type | Role | Responsibility |
|-----------|------|----------------|
| **Master** | Cluster management | Create/delete indices, track nodes, allocate shards |
| **Data** | Store data | Index and search operations, hold shards |
| **Coordinating** | Route requests | Distribute search requests, aggregate results |
| **Ingest** | Pre-process | Transform documents before indexing |

---

## 3. Elasticsearch Operations

### Creating an Index

```bash
PUT /users
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "firstName": { "type": "text" },
      "lastName": { "type": "text" },
      "email": { "type": "keyword" },
      "age": { "type": "integer" },
      "joined_date": { "type": "date" },
      "is_active": { "type": "boolean" }
    }
  }
}
```

### Field Types

| Type | Description | Example |
|------|-------------|---------|
| **text** | Full-text search, analyzed | Product descriptions |
| **keyword** | Exact match, not analyzed | Email, IDs, tags |
| **integer/long** | Numeric values | Age, count |
| **float/double** | Decimal numbers | Price, rating |
| **date** | Timestamps | Created date |
| **boolean** | True/false | Is active |
| **object** | Nested JSON | Address object |
| **geo_point** | Latitude/longitude | Location |

### Indexing Documents

```bash
# Index with auto-generated ID
POST /users/_doc
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "age": 30,
  "joined_date": "2024-01-15",
  "is_active": true
}

# Index with specific ID
PUT /users/_doc/1
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "age": 28,
  "joined_date": "2024-03-01",
  "is_active": true
}
```

### Searching Documents

**Match Query** (full-text search):
```bash
GET /users/_search
{
  "query": {
    "match": {
      "firstName": "john"
    }
  }
}
```

**Term Query** (exact match):
```bash
GET /users/_search
{
  "query": {
    "term": {
      "email": "john@example.com"
    }
  }
}
```

**Bool Query** (combine conditions):
```bash
GET /users/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "firstName": "john" } }
      ],
      "filter": [
        { "range": { "age": { "gte": 25 } } },
        { "term": { "is_active": true } }
      ]
    }
  }
}
```

### Aggregations

```bash
GET /users/_search
{
  "size": 0,
  "aggs": {
    "avg_age": {
      "avg": { "field": "age" }
    },
    "users_by_month": {
      "date_histogram": {
        "field": "joined_date",
        "calendar_interval": "month"
      }
    },
    "active_users": {
      "filter": { "term": { "is_active": true } },
      "aggs": {
        "count": { "value_count": { "field": "email" } }
      }
    }
  }
}
```

---

## 4. Logstash - The Data Processing Pipeline

### Logstash Architecture

```
┌────────────────────────────────────────┐
│          Logstash Pipeline             │
│                                        │
│  ┌────────┐   ┌────────┐  ┌─────────┐  │
│  │ Input  │─▶│ Filter │─▶│ Output  │  │
│  └────────┘   └────────┘  └─────────┘  │
│      ↑            │            ↓       │
│   Ingest    Transform      Send        │
└────────────────────────────────────────┘
```

### Input Plugins

| Plugin | Purpose | Use Case |
|--------|---------|----------|
| **beats** | Receive from Beats | Filebeat, Metricbeat |
| **http** | HTTP endpoint | Webhooks, APIs |
| **tcp/udp** | Network sockets | Syslog, custom protocols |
| **jdbc** | Database polling | Extract DB data |
| **kafka** | Kafka consumer | Event streams |
| **file** | Read files | Log files |
| **s3** | AWS S3 buckets | Cloud storage |

### Filter Plugins

#### Grok Pattern Examples

**Apache Access Log**:
```conf
filter {
  grok {
    match => {
      "message" => "%{COMBINEDAPACHELOG}"
    }
  }
}
```

**Custom Application Log**:
```conf
filter {
  grok {
    match => {
      "message" => "\[%{TIMESTAMP_ISO8601:timestamp}\] %{LOGLEVEL:level} %{GREEDYDATA:message}"
    }
  }
}
```

#### JSON Parsing

```conf
filter {
  json {
    source => "message"
    target => "parsed"
  }
}
```

#### GeoIP Enrichment

```conf
filter {
  geoip {
    source => "client_ip"
    target => "geoip"
    database => "/usr/share/GeoIP/GeoLite2-City.mmdb"
  }
}
```

### Output Plugins

```conf
output {
  # Elasticsearch
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
    user => "elastic"
    password => "${ES_PASSWORD}"
  }
  
  # File (for backup/debugging)
  file {
    path => "/var/log/logstash/output.log"
  }
  
  # Kafka (forward to another system)
  kafka {
    bootstrap_servers => "kafka:9092"
    topic_id => "processed-logs"
  }
  
  # Stdout (debugging)
  stdout {
    codec => rubydebug
  }
}
```

---

## 5. Beats - Lightweight Data Shippers

### Filebeat Configuration

**Complete Example**:
```yaml
# filebeat.yml

###################### Filebeat inputs ######################
filebeat.inputs:
  # Application logs
  - type: log
    id: app-logs
    enabled: true
    paths:
      - /var/log/app/*.log
    fields:
      log_type: application
      environment: production
      service_name: user-service
    multiline.pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
    multiline.negate: true
    multiline.match: after
    
  # Nginx access logs
  - type: log
    id: nginx-access
    enabled: true
    paths:
      - /var/log/nginx/access.log
    fields:
      log_type: nginx_access
      
  # Nginx error logs
  - type: log
    id: nginx-error
    enabled: true
    paths:
      - /var/log/nginx/error.log
    fields:
      log_type: nginx_error

###################### Processors ######################
processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - drop_fields:
      fields: ["agent.ephemeral_id", "agent.hostname"]

###################### Output ######################
output.logstash:
  hosts: ["logstash:5044"]
  ssl.certificate_authorities: ["/etc/pki/root/ca.pem"]
  ssl.certificate: "/etc/pki/client/cert.pem"
  ssl.key: "/etc/pki/client/cert.key"

# Alternative: Direct to Elasticsearch
# output.elasticsearch:
#   hosts: ["elasticsearch:9200"]
#   index: "filebeat-%{+yyyy.MM.dd}"
#   username: "elastic"
#   password: "${ES_PASSWORD}"

###################### Logging ######################
logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
```

### Metricbeat Configuration

```yaml
# metricbeat.yml

###################### Modules ######################
metricbeat.modules:
  # System metrics
  - module: system
    metricsets:
      - cpu
      - load
      - memory
      - network
      - process
      - process_summary
      - uptime
      - socket_summary
      - filesystem
      - fsstat
      - diskio
    enabled: true
    period: 10s
    processes: ['.*']
    
  # Docker metrics
  - module: docker
    metricsets:
      - container
      - cpu
      - diskio
      - memory
      - network
    hosts: ["unix:///var/run/docker.sock"]
    period: 10s
    enabled: true
    
  # Nginx metrics
  - module: nginx
    metricsets:
      - stubstatus
    period: 10s
    hosts: ["http://127.0.0.1"]
    enabled: true

###################### Output ######################
output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "metricbeat-%{+yyyy.MM.dd}"
```

---

## 6. Kibana - Visualization and Dashboards

### Kibana Features

#### 1. Discover

**Purpose**: Interactive log exploration

**Features**:
- Search logs with Kibana Query Language (KQL)
- Filter by fields
- View document details
- Save searches

**Example Search**:
```
service_name:"user-service" AND level:"ERROR" AND @timestamp >= now-1h
```

#### 2. Visualize

**Visualization Types**:
- Line Chart: Trends over time
- Bar Chart: Comparisons
- Pie Chart: Proportions
- Table: List data
- Metric: Single value
- Heat Map: Intensity patterns
- Tag Cloud: Term frequency

#### 3. Dashboard

**Sample Dashboard for Spring Boot App**:

```
┌────────────────────────────────────────────────────────┐
│          Spring Boot Application Dashboard             │
├──────────────────┬─────────────────────────────────────┤
│ Total Requests   │ Error Rate                          │
│ [123,456]        │ [2.5%] ▲                            │
├──────────────────┼─────────────────────────────────────┤
│ Requests/min     │ Top Errors                          │
│ [Line Chart]     │ [Table]                             │
│                  │ NullPointerException    │ 45        │
│                  │ TimeoutException        │ 23        │
│                  │ SQLException            │ 12        │
├──────────────────┴─────────────────────────────────────┤
│ Response Time Percentiles                              │
│ [Multi-line Chart: p50, p95, p99]                      │
└────────────────────────────────────────────────────────┘
```

#### 4. Canvas (Infographic-Style Reports)

Create beautiful presentations with:
- Custom layouts
- Images and shapes
- Live data visualizations
- Markdown text
- Dynamic elements

#### 5. Alerts (Watcher)

**Example Alert Configuration**:
```json
{
  "trigger": {
    "schedule": { "interval": "5m" }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["logs-*"],
        "body": {
          "query": {
            "bool": {
              "must": [
                { "match": { "level": "ERROR" } },
                { "range": { "@timestamp": { "gte": "now-5m" } } }
              ]
            }
          }
        }
      }
    }
  },
  "condition": {
    "compare": { "ctx.payload.hits.total": { "gt": 10 } }
  },
  "actions": {
    "send_email": {
      "email": {
        "to": "devops@example.com",
        "subject": "High error rate detected",
        "body": "More than 10 errors in the last 5 minutes"
      }
    }
  }
}
```

---

## 7. Complete Integration: Spring Boot + ELK

### Spring Boot Application Setup

**Maven Dependencies**:
```xml
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>7.4</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Logback Configuration** (logback-spring.xml):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Console Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsumerAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder"/>
    </appender>
    
    <!-- File Appender with JSON encoding -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>/var/log/app/application.log</file>
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <customFields>{"app_name":"user-service","environment":"production"}</customFields>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>/var/log/app/application.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
            <totalSizeCap>10GB</totalSizeCap>
        </rollingPolicy>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

### Docker Compose for ELK Stack

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
      - xpack.security.enabled=false
    ports:
      - 9200:9200
      - 9300:9300
    volumes:
      - es_data:/usr/share/elasticsearch/data
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: logstash
    ports:
      - 5044:5044
      - 9600:9600
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
    depends_on:
      - elasticsearch
    networks:
      - elk

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: kibana
    ports:
      - 5601:5601
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - elk

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.11.0
    container_name: filebeat
    user: root
    volumes:
      - ./filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/log/app:/var/log/app:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    depends_on:
      - logstash
    networks:
      - elk

networks:
  elk:
    driver: bridge

volumes:
  es_data:
    driver: local
```

**Start the Stack**:
```bash
docker-compose up -d
```

**Verify**:
```bash
# Check Elasticsearch
curl http://localhost:9200

# Access Kibana
open http://localhost:5601
```

---

## 8. Monitoring and Performance

### Elasticsearch Cluster Health

```bash
GET /_cluster/health

# Response
{
  "cluster_name": "my-cluster",
  "status": "green",  # green=healthy, yellow=warning, red=critical
  "number_of_nodes": 3,
  "number_of_data_nodes": 3,
  "active_primary_shards": 15,
  "active_shards": 30
}
```

### Node Stats

```bash
GET /_nodes/stats

# Check specific metrics
GET /_nodes/stats/jvm,os,fs
```

### Index Stats

```bash
GET /logs-*/_stats

# Specific metrics
GET /logs-*/_stats/store,docs
```

---

## 9. Security Best Practices

### 1. Enable Security Features (X-Pack)

```yaml
# elasticsearch.yml
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
```

### 2. Create Users and Roles

```bash
# Create role
POST /_security/role/log_reader
{
  "indices": [
    {
      "names": ["logs-*"],
      "privileges": ["read"]
    }
  ]
}

# Create user
POST /_security/user/log_user
{
  "password": "secure_password",
  "roles": ["log_reader"],
  "full_name": "Log Reader User"
}
```

### 3. Use HTTPS

```yaml
# elasticsearch.yml
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.keystore.path: certs/http.p12
```

### 4. IP Filtering

```yaml
# elasticsearch.yml
xpack.security.http.filter.allow: ["192.168.1.0/24"]
xpack.security.http.filter.deny: ["0.0.0.0/0"]
```

---

## 10. Troubleshooting Common Issues

### Issue 1: Index Not Found

**Error**: `index_not_found_exception`

**Solution**:
```bash
# List all indices
GET /_cat/indices?v

# Create index if missing
PUT /logs-2024.12.10
```

### Issue 2: Circuit Breaker Triggered

**Error**: `Data too large, data for [<http_request>] would be [x], which is larger than the limit`

**Solution**:
```yaml
# elasticsearch.yml - Increase circuit breaker limit
indices.breaker.total.limit: 70%
```

### Issue 3: Shard Allocation Failure

**Check**:
```bash
GET /_cluster/allocation/explain
```

**Fix**:
```bash
# Enable shard allocation
PUT /_cluster/settings
{
  "transient": {
    "cluster.routing.allocation.enable": "all"
  }
}
```

---

## Summary

The ELK Stack components work together to provide:
✅ **Elasticsearch**: Distributed search and analytics engine  
✅ **Logstash**: Data processing and transformation pipeline  
✅ **Beats**: Lightweight data shippers  
✅ **Kibana**: Visualization and dashboard platform  

Together, they enable **centralized logging**, **real-time monitoring**, and **powerful analytics** for modern applications! 🚀

**Next**: We'll explore AI Tooling, LLMs, and Prompt Engineering! 🤖
