# Week 9 - Monday: Java Memory Management and Week Overview

## Week 9 Overview

This week focuses on **DevOps, AWS, and Performance Tuning**:

- **DevOps**: Docker containerization and Kubernetes orchestration
- **AWS**: Cloud infrastructure with EC2, S3, and platform services
- **Performance Tuning**: Java memory management and garbage collection optimization

---

## 1. Java Memory Model (JMM)

### What is the Java Memory Model?

The **Java Memory Model** defines how threads interact through memory and what behaviors are allowed in concurrent execution.

### Key Concepts

- **Main Memory**: Shared memory accessible by all threads.
- **Thread Local Memory**: Each thread has its own working memory (cache).
- **Visibility**: Changes made by one thread may not be immediately visible to others.
- **Atomicity**: Certain operations (read/write to primitives except long/double) are atomic.
- **Ordering**: The JMM allows reordering of instructions for optimization.

### Happens-Before Relationship

Guarantees visibility and ordering:

1. **Program Order**: Each action in a thread happens-before every action later in that thread.
2. **Monitor Lock**: Unlock on a monitor happens-before every subsequent lock on that monitor.
3. **Volatile**: Write to a volatile field happens-before every subsequent read of that field.
4. **Thread Start**: `Thread.start()` happens-before any action in the started thread.
5. **Thread Join**: All actions in a thread happen-before `Thread.join()` returns.

### Volatile Keyword

- Ensures visibility of changes across threads.
- Prevents instruction reordering around volatile variables.

```java
private volatile boolean flag = false;

// Thread 1
flag = true;  // Write is visible to all threads

// Thread 2
if (flag) {   // Always sees the latest value
    // do something
}
```

---

## 2. Java Memory Structure Overview

### JVM Memory Architecture

The JVM divides memory into several areas:

```
┌─────────────────────────────────────────┐
│           JVM Memory                    │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │       Heap Memory               │   │
│  │  ┌────────────┐  ┌────────────┐ │   │
│  │  │   Young    │  │    Old     │ │   │
│  │  │ Generation │  │ Generation │ │   │
│  │  └────────────┘  └────────────┘ │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Metaspace (Native)         │   │
│  │ (Class Metadata, Static)        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │ Thread 1 │  │ Thread 2 │  (Stacks) │
│  │  Stack   │  │  Stack   │           │
│  └──────────┘  └──────────┘           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Code Cache (JIT compiled)     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 3. Heap Memory

### Structure

The **Heap** is divided into generations based on object lifetime.

#### Young Generation (Minor GC)

1. **Eden Space**:
    - Where all new objects are allocated.
    - When Eden fills up, a Minor GC occurs.

2. **Survivor Spaces** (S0 and S1):
    - Objects that survive Minor GC move here.
    - Objects "age" by surviving multiple GCs.
    - Survivors are copied between S0 and S1.

#### Old Generation (Major GC / Full GC)

- Long-lived objects that have survived many Minor GCs.
- When Old Gen fills up, a Major GC occurs.
- Major GC is **expensive** ("Stop the World" event).

### Object Lifecycle

```
1. Object created → Eden Space
2. Survives Minor GC → Survivor Space (S0)
3. Survives multiple GCs → Survivor Space (S1) [ages]
4. Reaches age threshold → Old Generation
5. No longer referenced → Garbage Collection
```

### Heap Memory Errors

```
OutOfMemoryError: Java heap space
```

- Cause: Heap is full and no more space for new objects.
- Solutions:
  - Increase heap size: `-Xmx4g`
  - Fix memory leaks.
  - Optimize object creation.

---

## 4. Stack Memory

### Characteristics

- Stores **method frames** (local variables, references to objects).
- **Thread-private**: Each thread has its own stack.
- **LIFO structure**: Last In, First Out.
- **Fixed size**: Can lead to `StackOverflowError`.

### What's Stored in Stack?

- Primitive local variables (int, double, boolean, etc.)
- Object references (not the actual objects)
- Method call information (return address, parameters)

### Stack Frame

Each method call creates a **stack frame** containing:

1. **Local Variable Array**: Method parameters and local variables.
2. **Operand Stack**: For intermediate calculations.
3. **Frame Data**: Reference to constant pool, exception handling info.

### Example

```java
public void calculate() {
    int x = 10;           // x stored in stack
    int y = 20;           // y stored in stack
    Person p = new Person();  // p (reference) in stack, Person object in heap
    int sum = x + y;      // sum stored in stack
}
```

### Stack Memory Errors

```
StackOverflowError
```

- Cause: Too many method calls (usually infinite recursion).
- Solution: Fix recursion or increase stack size: `-Xss1m`

```java
// Bad: Infinite recursion
public void badMethod() {
    badMethod();  // StackOverflowError!
}
```

---

## 5. Metaspace (Java 8+)

### What is Metaspace?

- Stores **class metadata** (class structure, method data, static variables).
- Replaced **PermGen** (Permanent Generation) from Java 7.

### Metaspace vs. PermGen

| Feature | PermGen (Java 7) | Metaspace (Java 8+) |
| :--- | :--- | :--- |
| **Location** | Inside heap | Native memory (outside heap) |
| **Size** | Fixed (rarely expanded) | Auto-expands (up to system memory) |
| **Error** | `OutOfMemoryError: PermGen space` | `OutOfMemoryError: Metaspace` |
| **Tuning** | `-XX:PermSize`, `-XX:MaxPermSize` | `-XX:MetaspaceSize`, `-XX:MaxMetaspaceSize` |

### What's Stored in Metaspace?

- Class definitions
- Method metadata
- Static variables (references, not values)
- Constant pool

### Tuning Metaspace

```bash
# Set initial metaspace size
-XX:MetaspaceSize=128m

# Set maximum metaspace size
-XX:MaxMetaspaceSize=512m
```

### Metaspace Errors

```
OutOfMemoryError: Metaspace
```

- Cause: Too many classes loaded (classloader leaks, dynamic code generation).
- Solutions:
  - Increase metaspace: `-XX:MaxMetaspaceSize=512m`
  - Fix classloader leaks
  - Reduce dynamic class generation

---

## 6. Garbage Collection Deep Dive

### Why Garbage Collection?

- **Manual Memory Management** (C/C++): Programmer allocates and frees memory. Error-prone.
- **Automatic Memory Management** (Java): JVM automatically frees unused objects.

### GC Process

1. **Mark**: Start from GC roots (stack variables, static variables). Mark all reachable objects.
2. **Sweep**: Delete unmarked (unreachable) objects.
3. **Compact** (optional): Move surviving objects together to reduce fragmentation.

### GC Roots

Starting points for GC marking:

- Local variables in stack
- Static variables
- Active threads
- JNI references

### Generational Hypothesis

**Observation**: Most objects die young.
**Strategy**: Focus GC effort on young objects (Minor GC is frequent and fast).

### Types of GC

#### Minor GC

- Cleans **Young Generation** (Eden + Survivor).
- Fast and frequent.
- "Stop the World" but short pause.

#### Major GC / Full GC

- Cleans **Old Generation**.
- Slow and infrequent.
- Long "Stop the World" pause.

---

## 7. Java Garbage Collection Tuning

### Importance of Garbage Collection Tuning

- **Performance**: Reduce GC pause times (improve app responsiveness).
- **Throughput**: Maximize time spent on application work vs. GC.
- **Memory Efficiency**: Optimize heap usage.

### When to Do Garbage Collection Tuning

1. **Frequent GC**: App spends too much time in GC.
2. **Long Pauses**: "Stop the World" pauses impact user experience.
3. **OutOfMemoryError**: Heap or metaspace exhausted.
4. **High Latency**: Response times increase due to GC.

**Rule of Thumb**: Only tune if you have a performance problem. Don't tune prematurely.

---

## 8. How to Tune Java GC

### Step 1: Measure Current Performance

- Enable GC logging:

```bash
# Java 8
-XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log

# Java 9+
-Xlog:gc*:file=gc.log:time,uptime,level,tags
```

- Analyze:
  - GC frequency
  - Pause times
  - Heap usage

### Step 2: Choose the Right GC Algorithm

#### Serial GC (`-XX:+UseSerialGC`)

- **Use Case**: Single-core systems, small heaps (<100 MB), client applications.
- **Pros**: Simple, low overhead.
- **Cons**: Long pause times, single-threaded.

#### Parallel GC (`-XX:+UseParallelGC`)

- **Use Case**: Multi-core systems, batch processing, throughput-focused apps.
- **Pros**: High throughput, multi-threaded Minor and Major GC.
- **Cons**: Long Full GC pauses.

#### Concurrent Mark Sweep (CMS) (`-XX:+UseConcMarkSweepGC`) [Deprecated in Java 9]

- **Use Case**: Low-latency apps.
- **Pros**: Concurrent marking (reduced pause times).
- **Cons**: Fragmentation, complex, deprecated.

#### G1GC (`-XX:+UseG1GC`) [Default in Java 9+]

- **Use Case**: Large heaps (>4 GB), balanced latency and throughput.
- **Pros**: Predictable pause times, region-based, concurrent.
- **Cons**: Higher CPU usage.
- **Goal**: Achieve target pause time (default 200ms).

#### ZGC (`-XX:+UseZGC`) [Java 11+]

- **Use Case**: Very large heaps (multi-TB), ultra-low latency (<10ms).
- **Pros**: Sub-millisecond pauses, scalable.
- **Cons**: Higher memory overhead, experimental (production-ready in Java 15+).

#### Shenandoah (`-XX:+UseShenandoahGC`) [OpenJDK]

- **Use Case**: Low latency, large heaps.
- **Pros**: Concurrent compaction, low pauses.
- **Cons**: Not in Oracle JDK.

### Step 3: Tune Heap Size

```bash
# Set initial heap size
-Xms2g

# Set maximum heap size
-Xmx4g

# Best Practice: Set Xms = Xmx (avoid heap resizing overhead)
-Xms4g -Xmx4g
```

### Step 4: Tune Generations (For Parallel/CMS/G1)

```bash
# Set Young Generation size
-Xmn1g

# Or use ratio
-XX:NewRatio=2  # Old Gen = 2 * Young Gen

# Survivor ratio (Eden / Survivor)
-XX:SurvivorRatio=8  # Eden = 8 * Survivor space
```

### Step 5: G1GC-Specific Tuning

```bash
# Set target pause time (milliseconds)
-XX:MaxGCPauseMillis=200

# Set region size (1, 2, 4, 8, 16, 32 MB)
-XX:G1HeapRegionSize=16m

# Reserve percentage of heap to avoid Full GC
-XX:G1ReservePercent=10

# Initiate Concurrent Mark when heap reaches this %
-XX:InitiatingHeapOccupancyPercent=45
```

### Step 6: Monitor and Iterate

- Use monitoring tools:
  - **VisualVM**: JVM profiler
  - **JConsole**: JMX monitoring
  - **GC logs**: Parse with GCViewer or GCEasy.io
- Adjust parameters based on metrics.

---

## 9. GC Tuning Examples

### Example 1: Throughput-Oriented (Batch Processing)

```bash
java -Xms4g -Xmx4g \
     -XX:+UseParallelGC \
     -XX:ParallelGCThreads=8 \
     -jar myapp.jar
```

### Example 2: Low Latency (Web Application)

```bash
java -Xms4g -Xmx4g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=100 \
     -XX:G1HeapRegionSize=16m \
     -jar myapp.jar
```

### Example 3: Ultra-Low Latency (Real-Time Trading)

```bash
java -Xms8g -Xmx8g \
     -XX:+UseZGC \
     -XX:ZCollectionInterval=5 \
     -jar myapp.jar
```

### Example 4: Small Footprint (IoT/Embedded)

```bash
java -Xms128m -Xmx256m \
     -XX:+UseSerialGC \
     -jar myapp.jar
```

---

## 10. Common GC Parameters Reference

| Parameter | Description | Example |
| :--- | :--- | :--- |
| `-Xms` | Initial heap size | `-Xms2g` |
| `-Xmx` | Maximum heap size | `-Xmx4g` |
| `-Xmn` | Young generation size | `-Xmn1g` |
| `-Xss` | Thread stack size | `-Xss1m` |
| `-XX:NewRatio` | Old/Young ratio | `-XX:NewRatio=2` |
| `-XX:SurvivorRatio` | Eden/Survivor ratio | `-XX:SurvivorRatio=8` |
| `-XX:MaxMetaspaceSize` | Max metaspace | `-XX:MaxMetaspaceSize=256m` |
| `-XX:+UseG1GC` | Use G1 GC | `-XX:+UseG1GC` |
| `-XX:MaxGCPauseMillis` | Target pause time | `-XX:MaxGCPauseMillis=200` |
| `-XX:+PrintGCDetails` | Enable GC logging | `-XX:+PrintGCDetails` |

---

## 11. Best Practices

### Memory Management

1. **Avoid Memory Leaks**: Close resources, clear collections, avoid static references to large objects.
2. **Object Pooling**: Reuse expensive objects (database connections, threads).
3. **Weak References**: Use `WeakReference` for caches to allow GC.
4. **Profiling**: Use profilers to identify memory hotspots.

### GC Tuning

1. **Start Simple**: Use default settings unless you have a problem.
2. **Measure First**: Always measure before and after tuning.
3. **Xms = Xmx**: Avoid heap resizing overhead.
4. **Choose the Right GC**: Match GC to workload (throughput vs. latency).
5. **Monitor in Production**: Use APM tools (New Relic, Datadog, etc.).
