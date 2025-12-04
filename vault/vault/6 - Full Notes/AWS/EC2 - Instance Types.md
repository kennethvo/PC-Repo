
2025-10-02 16:23

Tags: [[AWS]], [[EC2]], [[Instances]]

# EC2 - Instance Types
You can use different types of EC2 instances for different use cases to stay optimized

Naming convention: ==m5.2xlarge==
- m: instance class
- 5: generation (AWS improves them over time)
- 2xlarge: size within the class

## Types: General Purpose
Great for most workloads like web servers or code repos
Balance between: compute, memory, networking
- In the course we will be using the t2.micro (general purpose EC2 instance)

## Types: Compute Optimized
Great for compute-intensive tasks. needs high performance processors
- Batch processing workloads
- Media transcoding
- High performance web servers
- High performance computing (HPC)
- Scientific modeling & machine learning
- Dedicated gaming servers

## Types: Memory Optimized
Fast performance for workloads that process large data sets in memory
- High performance, relational/non-relational databases
- Distributed web scale cache stores
- In-memory databases optimized for BI
- Apps performing real time processing of data

## Types: Storage Optimized
Great for storage intensive tasks, needs high sequential read and write access to large data sets
- High freq. online transaction processing (OLTP) systems
- Relational & NoSQL databases
- Cache for in memory databases
- Data warehousing apps
- Distributed file systems





# References
https://aws.amazon.com/ec2/instance-types/
https://ec2instances.info - list of all the instances and stats
[[EC2]]