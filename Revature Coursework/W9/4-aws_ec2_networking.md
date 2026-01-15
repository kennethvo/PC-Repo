# Week 9 - Thursday: AWS EC2 and Networking

## 1. AWS Regions and Availability Zones

### AWS Global Infrastructure

#### Regions
-   **AWS Region**: A geographical area containing multiple isolated locations known as Availability Zones.
-   Examples: `us-east-1` (N. Virginia), `eu-west-1` (Ireland), `ap-south-1` (Mumbai).
-   **Why Multiple Regions?**
    -   Data sovereignty and compliance.
    -   Reduced latency (deploy close to users).
    -   Disaster recovery (geographic redundancy).

#### Availability Zones (AZs)
-   **Availability Zone**: One or more discrete data centers with redundant power, networking, and connectivity.
-   Each region has multiple AZs (typically 3-6).
-   **Example**: `us-east-1a`, `us-east-1b`, `us-east-1c`.
-   **Purpose**: High availability and fault tolerance.
    -   AZs are physically separated but connected with low-latency links.
    -   If one AZ fails, others continue operating.

#### Edge Locations
-   **Edge Location**: Endpoints for CloudFront (AWS CDN).
-   Used to cache content closer to users.
-   More numerous than regions (hundreds worldwide).

### Choosing a Region
Factors to consider:
1.  **Latency**: Choose the region closest to your users.
2.  **Compliance**: Some data must remain in specific geographic locations.
3.  **Service Availability**: Not all AWS services are available in all regions.
4.  **Cost**: Pricing varies by region.

---

## 2. AWS Common Services Overview

| Service | Category | Description |
| :--- | :--- | :--- |
| **EC2** | Compute | Virtual servers in the cloud |
| **S3** | Storage | Scalable object storage |
| **RDS** | Database | Managed relational databases (MySQL, PostgreSQL, etc.) |
| **Lambda** | Compute | Serverless function execution |
| **VPC** | Networking | Isolated virtual networks |
| **CloudFront** | CDN | Content delivery network |
| **Route 53** | DNS | Domain name system service |
| **IAM** | Security | Identity and access management |
| **CloudWatch** | Monitoring | Logging and monitoring service |
| **Elastic Beanstalk** | Platform | Platform as a Service (PaaS) for app deployment |

**Today's Focus**: EC2 (Elastic Compute Cloud)

---

## 3. AWS EC2 (Elastic Compute Cloud)

### What is EC2?
**Amazon EC2** is a web service that provides resizable compute capacity in the cloud. It's essentially a **virtual server** that you can launch in minutes.

### Key Concepts

#### Instance
-   A virtual server running in AWS.
-   Can run Linux, Windows, or macOS.

#### Instance Types
EC2 instances are categorized by use case:

| Family | Use Case | Example |
| :--- | :--- | :--- |
| **General Purpose** (T, M) | Balanced compute, memory, networking | `t3.micro`, `m5.large` |
| **Compute Optimized** (C) | High-performance processors | `c5.xlarge` |
| **Memory Optimized** (R, X) | Large datasets in memory | `r5.2xlarge` |
| **Storage Optimized** (I, D) | High sequential read/write | `i3.large` |
| **Accelerated Computing** (P, G) | GPU for ML/graphics | `p3.8xlarge` |

**Naming Convention**: `t3.micro`
-   `t` = family
-   `3` = generation
-   `micro` = size

#### AMI (Amazon Machine Image)
-   **AMI**: A template that contains the OS and software configuration.
-   Pre-configured templates:
    -   Amazon Linux 2
    -   Ubuntu Server
    -   Windows Server
    -   Red Hat Enterprise Linux
-   You can create custom AMIs with your own configurations.

#### Key Pairs
-   Public/private key pair for SSH authentication.
-   AWS stores the public key; you download the private key (`.pem` file).
-   **Critical**: You cannot recover a lost private key.

#### Storage Options
1.  **EBS (Elastic Block Store)**:
    -   Persistent block storage.
    -   Survives instance termination (if configured).
    -   Can be attached/detached from instances.

2.  **Instance Store**:
    -   Temporary block storage.
    -   Data lost when instance stops/terminates.
    -   Faster than EBS (physically attached to host).

3.  **EFS (Elastic File System)**:
    -   Shared file storage for multiple instances.

#### Pricing Models
1.  **On-Demand**: Pay by the hour or second. No commitment.
2.  **Reserved Instances**: Commit to 1 or 3 years for significant discounts (up to 75%).
3.  **Spot Instances**: Bid for unused capacity. Up to 90% discount, but can be interrupted.
4.  **Savings Plans**: Flexible pricing model with commitment to usage amount.

---

## 4. EC2 Introduction - Launching an Instance

### Step-by-Step: Launch EC2 Instance

#### Step 1: Choose AMI
-   Select an operating system image.
-   Example: Amazon Linux 2023 AMI (Free Tier eligible).

#### Step 2: Choose Instance Type
-   Select instance size based on workload.
-   Example: `t2.micro` (1 vCPU, 1 GiB RAM) – Free Tier eligible.

#### Step 3: Configure Instance Details
-   **Number of instances**: How many to launch.
-   **Network (VPC)**: Choose your Virtual Private Cloud.
-   **Subnet**: Select Availability Zone.
-   **Auto-assign Public IP**: Enable if you need external access.
-   **IAM Role**: Assign permissions to the instance.
-   **User Data**: Script to run on first boot (e.g., install software).

User Data Example:
```bash
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "Hello from EC2" > /var/www/html/index.html
```

#### Step 4: Add Storage
-   Root volume: Default is 8 GB (increase if needed).
-   **Delete on Termination**: If checked, volume is deleted when instance terminates.

#### Step 5: Add Tags
-   Key-value pairs for organization.
-   Example: `Name: WebServer`, `Environment: Production`.

#### Step 6: Configure Security Group
-   See Security Groups section below.

#### Step 7: Review and Launch
-   Select or create a key pair.
-   Download the `.pem` file (private key).
-   Launch the instance.

---

## 5. Security Groups

### What is a Security Group?
A **Security Group** acts as a virtual firewall for your EC2 instance. It controls **inbound and outbound traffic**.

### Characteristics
-   **Stateful**: If you allow inbound traffic, the response is automatically allowed (even if outbound rules don't explicitly permit it).
-   **Default Deny**: All inbound traffic is denied by default. You must explicitly allow traffic.
-   **Instance-Level**: Applied to EC2 instances (not subnets).
-   **Multiple Rules**: You can have multiple rules per security group.
-   **Multiple Security Groups**: An instance can have multiple security groups.

### Rules Structure
Each rule specifies:
1.  **Type**: Protocol (SSH, HTTP, HTTPS, Custom TCP, etc.).
2.  **Protocol**: TCP, UDP, ICMP.
3.  **Port Range**: Which ports to allow.
4.  **Source/Destination**: Where traffic can come from or go to.
    -   **CIDR Block**: IP range (e.g., `0.0.0.0/0` for anywhere).
    -   **Security Group**: Another security group.

### Common Security Group Rules

#### SSH Access (Linux)
-   **Type**: SSH
-   **Protocol**: TCP
-   **Port**: 22
-   **Source**: Your IP (e.g., `203.0.113.0/32`) or `0.0.0.0/0` (anywhere – not recommended for production).

#### RDP Access (Windows)
-   **Type**: RDP
-   **Protocol**: TCP
-   **Port**: 3389
-   **Source**: Your IP.

#### HTTP Traffic (Web Server)
-   **Type**: HTTP
-   **Protocol**: TCP
-   **Port**: 80
-   **Source**: `0.0.0.0/0` (allow from anywhere).

#### HTTPS Traffic
-   **Type**: HTTPS
-   **Protocol**: TCP
-   **Port**: 443
-   **Source**: `0.0.0.0/0`.

#### Custom Application (e.g., Spring Boot)
-   **Type**: Custom TCP
-   **Protocol**: TCP
-   **Port**: 8080
-   **Source**: Specific IP or security group.

### Example Security Group Configuration
**Web Server Security Group**:

| Type | Protocol | Port Range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| SSH | TCP | 22 | 203.0.113.25/32 | Admin access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Public web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Public HTTPS traffic |
| Custom TCP | TCP | 8080 | sg-0123456789abcdef | Backend service |

### Creating a Security Group
```bash
# Using AWS CLI
aws ec2 create-security-group \
    --group-name WebServerSG \
    --description "Security group for web server" \
    --vpc-id vpc-12345678

# Add SSH rule
aws ec2 authorize-security-group-ingress \
    --group-id sg-0123456789abcdef \
    --protocol tcp \
    --port 22 \
    --cidr 203.0.113.25/32

# Add HTTP rule
aws ec2 authorize-security-group-ingress \
    --group-id sg-0123456789abcdef \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0
```

---

## 6. SSH Into EC2 Instance

### Prerequisites
1.  EC2 instance is running.
2.  Security group allows SSH (port 22) from your IP.
3.  You have the private key (`.pem` file).

### Steps to Connect (Linux/Mac)

#### Step 1: Set Permissions on Key File
```bash
chmod 400 my-key-pair.pem
```
-   This makes the key read-only for the owner (required for SSH).

#### Step 2: Get Public IP
-   Go to EC2 Dashboard → Instances.
-   Copy the **Public IPv4 address** (e.g., `54.123.45.67`).

#### Step 3: SSH Command
```bash
ssh -i /path/to/my-key-pair.pem ec2-user@54.123.45.67
```
-   `-i`: Identity file (private key).
-   `ec2-user`: Default user for Amazon Linux (use `ubuntu` for Ubuntu, `admin` for Debian).
-   `54.123.45.67`: Public IP of instance.

#### Step 4: Accept Fingerprint
-   First time: Type `yes` to accept the host fingerprint.

#### Step 5: You're In!
```bash
[ec2-user@ip-172-31-45-67 ~]$ 
```

### Steps to Connect (Windows)

#### Using PuTTY

**Step 1: Convert `.pem` to `.ppk`**
-   Use PuTTYgen to convert the `.pem` file to `.ppk` format.

**Step 2: Open PuTTY**
-   **Host Name**: `ec2-user@54.123.45.67`.
-   **Connection → SSH → Auth**: Browse for your `.ppk` file.
-   Click **Open**.

#### Using Windows 10/11 (Native SSH Client)
-   Same as Linux/Mac:
```bash
ssh -i C:\path\to\my-key-pair.pem ec2-user@54.123.45.67
```

### Common SSH Issues

#### Permission Denied
-   **Cause**: Wrong username or key.
-   **Solution**: Verify username (e.g., `ec2-user`, `ubuntu`) and key path.

#### Connection Timeout
-   **Cause**: Security group doesn't allow SSH from your IP.
-   **Solution**: Add inbound rule for port 22 from your IP.

#### Bad Permissions
```
Permissions 0644 for 'my-key.pem' are too open.
```
-   **Solution**: `chmod 400 my-key.pem`

---

## 7. Managing EC2 Instances

### Instance States
-   **Pending**: Instance is launching.
-   **Running**: Instance is active.
-   **Stopping**: Instance is shutting down.
-   **Stopped**: Instance is stopped (not terminated). You don't pay for compute, but you pay for storage.
-   **Shutting-down**: Instance is terminating.
-   **Terminated**: Instance is deleted. Cannot be recovered.

### Actions

#### Stop Instance
```bash
# AWS CLI
aws ec2 stop-instances --instance-ids i-0123456789abcdef

# From within instance
sudo shutdown -h now
```

#### Start Instance
```bash
aws ec2 start-instances --instance-ids i-0123456789abcdef
```

#### Reboot Instance
```bash
aws ec2 reboot-instances --instance-ids i-0123456789abcdef
```

#### Terminate Instance
```bash
aws ec2 terminate-instances --instance-ids i-0123456789abcdef
```
-   **Warning**: This is irreversible (unless termination protection is enabled).

### Instance Metadata
-   Access instance information from within the instance.
```bash
# Get instance ID
curl http://169.254.169.254/latest/meta-data/instance-id

# Get public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Get availability zone
curl http://169.254.169.254/latest/meta-data/placement/availability-zone
```

---

## 8. Best Practices

### Security
1.  **Never use `0.0.0.0/0` for SSH**: Restrict SSH to your IP address.
2.  **Use IAM Roles**: Don't hardcode AWS credentials. Attach IAM roles to instances.
3.  **Enable Termination Protection**: Prevent accidental termination.
4.  **Encrypt EBS Volumes**: Use AWS KMS for encryption.
5.  **Keep Software Updated**: Regularly patch the OS and applications.

### Cost Optimization
1.  **Stop Instances When Not in Use**: You only pay for storage.
2.  **Use Reserved Instances**: For predictable workloads.
3.  **Right-Size Instances**: Don't over-provision. Use CloudWatch metrics to monitor usage.
4.  **Use Spot Instances**: For non-critical batch processing.

### Monitoring
1.  **Enable CloudWatch**: Monitor CPU, disk, network.
2.  **Set Up Alarms**: Get notified when thresholds are breached.
3.  **Use CloudWatch Logs**: Collect and monitor log files.

### Backup and Disaster Recovery
1.  **Create AMIs**: Regularly snapshot your instances.
2.  **Multi-AZ Deployment**: Deploy across multiple Availability Zones.
3.  **Automate Backups**: Use AWS Backup or Lambda.
