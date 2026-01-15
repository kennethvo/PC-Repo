# Week 10 - Monday: AWS Storage and Platform Services

## 1. AMI (Amazon Machine Image)

### What is an AMI?

An **Amazon Machine Image (AMI)** is a template that contains:

- Operating system (Linux, Windows, macOS)
- Application server
- Applications and configurations
- Permissions (who can use it)

**Purpose**: Quickly launch pre-configured EC2 instances.

### Types of AMIs

#### 1. AWS-Provided AMIs

- Maintained by Amazon.
- Examples: Amazon Linux 2023, Ubuntu Server, Windows Server.
- **Free Tier eligible** options available.

#### 2. AWS Marketplace AMIs

- Third-party software (pre-configured).
- Examples: WordPress, MongoDB, Nginx.
- Often include licensing costs.

#### 3. Community AMIs

- Shared by the AWS community.
- Free but not officially supported.

#### 4. Custom AMIs

- Created by you from your instances.
- Contains your exact configuration and software.

### Creating a Custom AMI

#### Use Case

- You've configured an EC2 instance with your app, libraries, and settings.
- You want to launch identical instances quickly.

#### Steps

1. **Launch and Configure Instance**:
    - Install software, configure settings.

2. **Create Image**:

```bash
# AWS CLI
aws ec2 create-image \
    --instance-id i-0123456789abcdef \
    --name "MyApp-v1.0" \
    --description "Spring Boot app with PostgreSQL"
```

1. **Use the AMI**:
    - Launch new instances from your custom AMI.
    - All configurations are pre-applied.

### AMI Characteristics

- **Region-Specific**: AMIs are tied to a region. You must copy an AMI to use it in another region.
- **Versioning**: Create multiple AMIs for different versions of your app.
- **Snapshot-Based**: Creating an AMI takes a snapshot of attached EBS volumes.

### Copying AMI to Another Region

```bash
aws ec2 copy-image \
    --source-image-id ami-0123456789abcdef \
    --source-region us-east-1 \
    --region us-west-2 \
    --name "MyApp-v1.0-west"
```

### Deregistering an AMI

- When you no longer need an AMI, deregister it to avoid storage costs.

```bash
aws ec2 deregister-image --image-id ami-0123456789abcdef
```

- **Note**: This does NOT delete the underlying snapshots. You must delete those separately.

---

## 2. EBS (Elastic Block Store)

### What is EBS?

**Amazon EBS** provides persistent block storage volumes for EC2 instances. Think of it as a **virtual hard drive**.

### Characteristics

- **Persistent**: Data persists independently of the instance lifecycle.
- **Replicated**: Automatically replicated within an Availability Zone for durability.
- **Resizable**: You can increase volume size without downtime.
- **Snapshots**: Point-in-time backups stored in S3.

### EBS vs. Instance Store

| Feature | EBS | Instance Store |
| :--- | :--- | :--- |
| **Persistence** | Persistent (survives stop/start) | Ephemeral (data lost on stop/terminate) |
| **Performance** | Consistent, customizable | Very high (physically attached) |
| **Use Case** | Databases, file systems | Temporary cache, buffers |
| **Detachable** | Yes | No |

### EBS Volume Types

#### 1. General Purpose SSD (gp3, gp2)

- **Use Case**: Boot volumes, dev/test environments, low-latency apps.
- **IOPS**: Baseline 3,000 (gp3), scales with size (gp2).
- **Throughput**: Up to 1,000 MB/s (gp3).
- **Size**: 1 GiB – 16 TiB.

#### 2. Provisioned IOPS SSD (io2, io1)

- **Use Case**: I/O-intensive workloads (databases, critical apps).
- **IOPS**: Up to 64,000 (configurable).
- **Throughput**: Up to 1,000 MB/s.
- **Size**: 4 GiB – 16 TiB.

#### 3. Throughput Optimized HDD (st1)

- **Use Case**: Big data, data warehouses, log processing.
- **Throughput**: Up to 500 MB/s.
- **IOPS**: Up to 500.
- **Size**: 125 GiB – 16 TiB.
- **Cannot be a boot volume**.

#### 4. Cold HDD (sc1)

- **Use Case**: Infrequent access, lowest cost.
- **Throughput**: Up to 250 MB/s.
- **IOPS**: Up to 250.
- **Size**: 125 GiB – 16 TiB.
- **Cannot be a boot volume**.

### Creating and Attaching an EBS Volume

#### Step 1: Create Volume

```bash
aws ec2 create-volume \
    --availability-zone us-east-1a \
    --size 100 \
    --volume-type gp3
```

#### Step 2: Attach to Instance

```bash
aws ec2 attach-volume \
    --volume-id vol-0123456789abcdef \
    --instance-id i-0123456789abcdef \
    --device /dev/sdf
```

#### Step 3: Format and Mount (from within instance)

```bash
# Check available disks
lsblk

# Format the volume
sudo mkfs -t ext4 /dev/sdf

# Create mount point
sudo mkdir /data

# Mount the volume
sudo mount /dev/sdf /data

# Make it persist on reboot (add to /etc/fstab)
echo "/dev/sdf /data ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab
```

### EBS Snapshots

#### What is a Snapshot?

- **Snapshot**: Point-in-time backup of an EBS volume.
- Stored in S3 (you don't see the S3 bucket).
- Incremental: Only changed blocks are saved.

#### Creating a Snapshot

```bash
aws ec2 create-snapshot \
    --volume-id vol-0123456789abcdef \
    --description "Backup before upgrade"
```

#### Restoring from Snapshot

```bash
# Create volume from snapshot
aws ec2 create-volume \
    --snapshot-id snap-0123456789abcdef \
    --availability-zone us-east-1a

# Attach and mount as usual
```

#### Snapshot Best Practices

1. **Automate**: Use AWS Backup or Lambda to schedule snapshots.
2. **Lifecycle Policies**: Delete old snapshots to save costs.
3. **Cross-Region Copy**: Copy snapshots to another region for disaster recovery.

```bash
aws ec2 copy-snapshot \
    --source-region us-east-1 \
    --source-snapshot-id snap-0123456789abcdef \
    --destination-region us-west-2
```

### EBS Encryption

- Encrypts data at rest, in transit (between instance and volume), and snapshots.
- Enabled via AWS KMS.

```bash
aws ec2 create-volume \
    --availability-zone us-east-1a \
    --size 100 \
    --volume-type gp3 \
    --encrypted
```

---

## 3. EC2 Auto Scaling

### What is Auto Scaling?

**EC2 Auto Scaling** automatically adjusts the number of EC2 instances based on demand.

### Benefits

- **Fault Tolerance**: Replace unhealthy instances automatically.
- **Cost Optimization**: Scale down during low demand.
- **Availability**: Scale up during high demand.

### Components

#### 1. Launch Template / Launch Configuration

- Specifies instance configuration:
  - AMI
  - Instance type
  - Security group
  - Key pair
  - User data

**Launch Template (Recommended)**:

```bash
aws ec2 create-launch-template \
    --launch-template-name MyAppTemplate \
    --version-description "Version 1" \
    --launch-template-data '{
        "ImageId": "ami-0123456789abcdef",
        "InstanceType": "t3.micro",
        "KeyName": "my-key-pair",
        "SecurityGroupIds": ["sg-0123456789abcdef"]
    }'
```

#### 2. Auto Scaling Group (ASG)

- Defines:
  - Minimum instances (e.g., 2)
  - Desired instances (e.g., 3)
  - Maximum instances (e.g., 10)
  - Availability Zones
  - Health checks

```bash
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name MyAppASG \
    --launch-template LaunchTemplateName=MyAppTemplate,Version='$Latest' \
    --min-size 2 \
    --max-size 10 \
    --desired-capacity 3 \
    --availability-zones us-east-1a us-east-1b
```

#### 3. Scaling Policies

- **Target Tracking**: Maintain a metric (e.g., CPU at 50%).
- **Step Scaling**: Add/remove instances in steps based on alarm thresholds.
- **Scheduled Scaling**: Scale at specific times (e.g., lower capacity at night).

**Target Tracking Example**:

```bash
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name MyAppASG \
    --policy-name TargetTrackingCPU \
    --policy-type TargetTrackingScaling \
    --target-tracking-configuration '{
        "PredefinedMetricSpecification": {
            "PredefinedMetricType": "ASGAverageCPUUtilization"
        },
        "TargetValue": 50.0
    }'
```

### Health Checks

- **EC2 Health Check**: Instance is marked unhealthy if it fails EC2 status checks.
- **ELB Health Check**: Instance is marked unhealthy if it fails load balancer health checks.

### Termination Policies

When scaling down, which instance should be terminated?

- **Default**: Terminate instance in the AZ with the most instances, then oldest launch configuration.
- **OldestInstance**: Terminate the oldest instance.
- **NewestInstance**: Terminate the newest instance.

---

## 4. AWS S3 (Simple Storage Service)

### What is S3?

**Amazon S3** is an object storage service. It's designed for storing and retrieving any amount of data from anywhere.

### Key Concepts

#### Bucket

- A container for objects.
- **Globally unique name** (across all AWS accounts).
- Region-specific (you choose where to create it).

#### Object

- A file and its metadata.
- **Key**: Unique identifier (path + filename).
- **Value**: File content.
- **Size**: 0 bytes to 5 TB.

#### Example

- Bucket: `my-app-backups`
- Object Key: `2024/01/backup.zip`
- Full Path: `s3://my-app-backups/2024/01/backup.zip`

### S3 Storage Classes

| Class | Use Case | Availability | Retrieval Time | Cost |
| :--- | :--- | :--- | :--- | :--- |
| **S3 Standard** | Frequently accessed data | 99.99% | Instant | $$ |
| **S3 Intelligent-Tiering** | Unknown access patterns | 99.9% | Instant | Variable |
| **S3 Standard-IA** | Infrequent access | 99.9% | Instant | $ |
| **S3 One Zone-IA** | Infrequent, non-critical | 99.5% | Instant | $ |
| **S3 Glacier Instant** | Archive with instant retrieval | 99.9% | Instant | $ |
| **S3 Glacier Flexible** | Archive | 99.99% | Minutes to hours | ¢ |
| **S3 Glacier Deep Archive** | Long-term archive | 99.99% | 12–48 hours | ¢ |

### Creating a Bucket

```bash
aws s3 mb s3://my-unique-bucket-name --region us-east-1
```

### Uploading Objects

```bash
# Upload a file
aws s3 cp myfile.txt s3://my-unique-bucket-name/

# Upload directory
aws s3 cp mydir/ s3://my-unique-bucket-name/mydir/ --recursive

# Sync directory (only changed files)
aws s3 sync mydir/ s3://my-unique-bucket-name/mydir/
```

### Downloading Objects

```bash
# Download a file
aws s3 cp s3://my-unique-bucket-name/myfile.txt ./

# Download directory
aws s3 cp s3://my-unique-bucket-name/mydir/ ./mydir/ --recursive
```

### Listing Objects

```bash
# List all buckets
aws s3 ls

# List objects in bucket
aws s3 ls s3://my-unique-bucket-name/

# List objects with prefix
aws s3 ls s3://my-unique-bucket-name/2024/
```

### Deleting Objects

```bash
# Delete a file
aws s3 rm s3://my-unique-bucket-name/myfile.txt

# Delete directory
aws s3 rm s3://my-unique-bucket-name/mydir/ --recursive

# Delete bucket (must be empty)
aws s3 rb s3://my-unique-bucket-name
```

---

## 5. S3 Bucket Configuration

### Versioning

- Keeps multiple versions of an object.
- Protects against accidental deletion.
- Can restore previous versions.

```bash
aws s3api put-bucket-versioning \
    --bucket my-unique-bucket-name \
    --versioning-configuration Status=Enabled
```

### Bucket Policies

- Define who can access the bucket and what they can do.
- Written in JSON.

**Example: Public Read Access**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-unique-bucket-name/*"
    }
  ]
}
```

Apply:

```bash
aws s3api put-bucket-policy \
    --bucket my-unique-bucket-name \
    --policy file://policy.json
```

### CORS (Cross-Origin Resource Sharing)

- Allows web applications on one domain to access resources in S3.

```json
[
  {
    "AllowedOrigins": ["https://example.com"],
    "AllowedMethods": ["GET", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### Lifecycle Policies

- Automatically transition objects to cheaper storage classes or delete them.

**Example**: Move to Glacier after 30 days, delete after 90 days.

```json
{
  "Rules": [
    {
      "Id": "ArchiveOldFiles",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
```

### Encryption

- **Server-Side Encryption (SSE)**:
  - SSE-S3: AWS-managed keys.
  - SSE-KMS: AWS Key Management Service keys.
  - SSE-C: Customer-provided keys.

Enable default encryption:

```bash
aws s3api put-bucket-encryption \
    --bucket my-unique-bucket-name \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            }
        }]
    }'
```

---

## 6. Hosting Static Sites on S3

### Use Case

Host static websites (HTML, CSS, JS) directly from S3.

### Steps

#### Step 1: Create Bucket

- Bucket name should match your domain (optional but recommended).

```bash
aws s3 mb s3://www.example.com
```

#### Step 2: Upload Website Files

```bash
aws s3 sync ./website-folder/ s3://www.example.com/ --acl public-read
```

#### Step 3: Enable Static Website Hosting

```bash
aws s3 website s3://www.example.com/ \
    --index-document index.html \
    --error-document error.html
```

#### Step 4: Configure Bucket Policy

Make bucket publicly readable:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::www.example.com/*"
    }
  ]
}
```

#### Step 5: Access Website

- Website URL: `http://www.example.com.s3-website-us-east-1.amazonaws.com`

### Using Custom Domain with Route 53

1. Create hosted zone in Route 53.
2. Create an A record (Alias) pointing to S3 bucket.
3. Access via `http://www.example.com`.

---

## 7. AWS Elastic Beanstalk

### What is Elastic Beanstalk?

**AWS Elastic Beanstalk** is a Platform as a Service (PaaS) that automatically handles:

- Deployment
- Capacity provisioning
- Load balancing
- Auto-scaling
- Health monitoring

**You focus on code**. AWS handles infrastructure.

### Supported Platforms

- Java (Tomcat, JAR)
- .NET
- Node.js
- Python
- Ruby
- Go
- Docker
- PHP

### Key Concepts

#### Application

- Logical container for your project.

#### Environment

- A version of your application running on AWS resources.
- Types:
  - **Web Server Environment**: Handles HTTP requests.
  - **Worker Environment**: Processes background tasks.

#### Application Version

- A specific iteration of deployable code.

### Deploying a Spring Boot App

#### Step 1: Package Application

```bash
mvn clean package
```

- Produces `target/myapp-0.0.1-SNAPSHOT.jar`.

#### Step 2: Initialize Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p java-17 my-spring-app --region us-east-1
```

#### Step 3: Create Environment

```bash
eb create production-env
```

- This creates EC2 instances, load balancer, security groups, etc.

#### Step 4: Deploy

```bash
eb deploy
```

#### Step 5: Open Application

```bash
eb open
```

### Configuration

#### Environment Properties

Set environment variables (e.g., database URL):

```bash
eb setenv DB_URL=jdbc:postgresql://mydb.aws.com:5432/mydb
```

#### Scaling

```bash
# Auto-scaling
eb scale 3  # Set to 3 instances

# Configure scaling rules in .ebextensions/
```

### Monitoring

- Elastic Beanstalk integrates with CloudWatch.
- View logs:

```bash
eb logs
```

### Updating Application

1. Make code changes.
2. Package new JAR.
3. Deploy:

```bash
eb deploy
```

### Deleting Environment

```bash
eb terminate production-env
```

---

## 8. Best Practices

### S3

1. **Enable Versioning**: Protect against accidental deletion.
2. **Use Lifecycle Policies**: Reduce costs by moving old data to Glacier.
3. **Enable Encryption**: Protect sensitive data.
4. **Use IAM Policies**: Grant least privilege access.

### Auto Scaling

1. **Set Appropriate Min/Max**: Ensure you can handle traffic spikes.
2. **Use Target Tracking**: Simplest and most effective.
3. **Multi-AZ**: Deploy across multiple Availability Zones.

### Elastic Beanstalk

1. **Use .ebextensions**: Customize environment (e.g., install packages).
2. **Monitor Health**: Use Elastic Beanstalk dashboard and CloudWatch.
3. **Blue/Green Deployment**: Create new environment, test, then swap URLs.

## Single-SPA Resources

- [Single-SPA Documentation](https://single-spa.js.org/)
- [single-spa-angular](https://single-spa.js.org/docs/ecosystem-angular/)
- [single-spa-react](https://single-spa.js.org/docs/ecosystem-react/)
- [Import Maps](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps)
