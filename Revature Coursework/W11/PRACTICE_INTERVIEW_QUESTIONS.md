# Practice Interview Questions

## DevOps, CI/CD, Jenkins, Micro-Frontends, AWS, and Java Memory Management

This document contains comprehensive interview practice questions spanning topics covered across Weeks 8-10, designed for interview preparation.

---

## Section 1: DevOps Fundamentals

### Q1: What is DevOps and how does it differ from traditional software development?

**Keywords:** Culture, Collaboration, Automation, Continuous Improvement
<details>
<summary>Click to Reveal Answer</summary>

**DevOps** is a cultural and technical practice that bridges development and operations teams:

**Traditional Development:**

- Siloed teams (Dev vs Ops)
- Manual handoffs and deployments
- Long release cycles (months)
- "Throw it over the wall" mentality

**DevOps Approach:**

- Shared responsibility for the entire lifecycle
- Automation of build, test, and deployment
- Shorter release cycles (days/hours)
- Continuous feedback and improvement

**Key Pillars:**

1. **Culture**: Collaboration and shared ownership
2. **Automation**: Reduce manual tasks
3. **Measurement**: Metrics-driven decisions
4. **Sharing**: Knowledge and best practices

</details>

---

### Q2: Explain the DevOps lifecycle and its key stages

**Keywords:** Plan, Code, Build, Test, Release, Deploy, Operate, Monitor
<details>
<summary>Click to Reveal Answer</summary>

The DevOps lifecycle is a continuous loop:

1. **Plan**: Define requirements, user stories, sprint planning
2. **Code**: Develop features, code review, version control
3. **Build**: Compile, package, create artifacts
4. **Test**: Unit tests, integration tests, security scans
5. **Release**: Prepare for deployment, approval gates
6. **Deploy**: Push to staging/production environments
7. **Operate**: Infrastructure management, scaling
8. **Monitor**: Logging, metrics, alerting, feedback

**Tools per stage:**

- Plan: Jira, Azure DevOps
- Code: Git, GitHub, GitLab
- Build/Test: Maven, Jenkins, SonarQube
- Deploy: Docker, Kubernetes, Ansible
- Monitor: Prometheus, Grafana, ELK Stack

</details>

---

### Q3: What is Infrastructure as Code (IaC) and why is it important?

**Keywords:** Terraform, Ansible, Version Control, Reproducibility
<details>
<summary>Click to Reveal Answer</summary>

**Infrastructure as Code (IaC)** manages infrastructure using code files rather than manual processes.

**Benefits:**

1. **Version Control**: Track infrastructure changes in Git
2. **Reproducibility**: Same infrastructure every time
3. **Automation**: Reduce human error
4. **Documentation**: Code serves as documentation
5. **Testing**: Test infrastructure changes before applying

**Common Tools:**

| Tool | Type | Use Case |
|------|------|----------|
| Terraform | Declarative | Cloud provision (AWS, Azure) |
| Ansible | Configuration | Server configuration |
| CloudFormation | Declarative | AWS-specific |
| Pulumi | Imperative | Multiple clouds |

**Example Terraform:**

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "WebServer"
  }
}
```

</details>

---

### Q4: What are the key metrics to measure DevOps success?

**Keywords:** DORA Metrics, Deployment Frequency, Lead Time, MTTR
<details>
<summary>Click to Reveal Answer</summary>

**DORA Metrics** (DevOps Research and Assessment):

1. **Deployment Frequency**: How often code is deployed to production
   - Elite: Multiple times per day
   - Low: Less than once per month

2. **Lead Time for Changes**: Time from commit to production
   - Elite: Less than one hour
   - Low: More than six months

3. **Change Failure Rate**: % of deployments causing failures
   - Elite: 0-15%
   - Low: 46-60%

4. **Mean Time to Recovery (MTTR)**: Time to restore service
   - Elite: Less than one hour
   - Low: More than one week

**Additional Metrics:**

- Code coverage percentage
- Number of defects escaped to production
- Infrastructure uptime (SLA)

</details>

---

### Q5: Explain the concept of "Shift Left" in DevOps

**Keywords:** Early Testing, Security, Quality Gates, Prevention
<details>
<summary>Click to Reveal Answer</summary>

**"Shift Left"** means moving activities earlier in the development lifecycle:

**Traditional (Shift Right):**

```
Code → Build → Deploy → Test → Security → Monitor
                              ↑
                        Find issues late (expensive to fix)
```

**Shift Left:**

```
Security → Test → Code → Build → Test → Deploy → Monitor
    ↑              ↑
Find issues early (cheaper to fix)
```

**Applications:**

- **Shift Left Testing**: Write tests before/during development
- **Shift Left Security**: Security scanning in IDE and CI
- **Shift Left Quality**: Static analysis before code review

**Benefits:**

- Faster feedback loops
- Lower cost to fix defects
- Higher quality releases
- Reduced production incidents

</details>

---

## Section 2: CI/CD Pipelines

### Q6: What is the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment?

**Keywords:** Automation, Pipeline, Production, Manual Approval
<details>
<summary>Click to Reveal Answer</summary>

**Continuous Integration (CI):**

- Developers merge code frequently (multiple times/day)
- Automated build and test on every commit
- Goal: Catch integration issues early
- `Code → Build → Test`

**Continuous Delivery (CD):**

- Extends CI with automated deployment to staging
- Code is always in a deployable state
- **Manual approval** required for production
- `Code → Build → Test → Staging → [Manual] → Production`

**Continuous Deployment:**

- Extends Continuous Delivery
- **Automatic deployment** to production
- No manual approval needed
- Requires comprehensive automated testing
- `Code → Build → Test → Staging → Production (auto)`

**Key Difference:**

- Delivery: Human decision to deploy
- Deployment: Machine deploys automatically

</details>

---

### Q7: What are the essential stages of a CI/CD pipeline?

**Keywords:** Build, Test, Static Analysis, Package, Deploy
<details>
<summary>Click to Reveal Answer</summary>

**Standard Pipeline Stages:**

1. **Checkout**: Pull source code from repository

2. **Build**: Compile and package application
   - `mvn compile` or `npm build`

3. **Unit Tests**: Run fast, isolated tests
   - Fail fast if tests fail

4. **Static Analysis**: Code quality checks
   - SonarQube, ESLint, Checkstyle

5. **Security Scan**: Vulnerability detection
   - OWASP Dependency Check, Snyk

6. **Integration Tests**: Test component interactions

7. **Package**: Create deployable artifact
   - JAR, WAR, Docker image

8. **Deploy to Staging**: Deploy to test environment

9. **Acceptance Tests**: End-to-end validation

10. **Deploy to Production**: Final deployment

**Best Practices:**

- Run stages in parallel when possible
- Fail fast (quick tests first)
- Cache dependencies between builds

</details>

---

### Q8: How do you handle environment-specific configurations in CI/CD?

**Keywords:** Environment Variables, Secrets, Config Files, Profiles
<details>
<summary>Click to Reveal Answer</summary>

**Strategies:**

1. **Environment Variables:**

```groovy
stage('Deploy') {
    environment {
        DB_URL = credentials('db-url-prod')
    }
    steps {
        sh 'deploy.sh'
    }
}
```

1. **Configuration Profiles:**

```yaml
# application-prod.yml
spring:
  datasource:
    url: ${DB_URL}
```

1. **External Secrets Management:**

- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault

1. **Per-Environment Config Files:**

```
config/
├── dev.env
├── staging.env
└── prod.env
```

**Best Practices:**

- Never commit secrets to version control
- Use secrets scanners in CI pipeline
- Encrypt sensitive values
- Rotate secrets regularly

</details>

---

### Q9: Explain blue-green deployment strategy

**Keywords:** Zero Downtime, Rollback, Load Balancer, Environment Swap
<details>
<summary>Click to Reveal Answer</summary>

**Blue-Green Deployment** maintains two identical production environments:

```
                    ┌─────────────┐
                    │ Load        │
                    │ Balancer    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
     ┌─────▼─────┐   ┌─────▼─────┐
     │   BLUE    │   │   GREEN   │
     │  (v1.0)   │   │  (v1.1)   │
     │  ACTIVE   │   │  STANDBY  │
     └───────────┘   └───────────┘
```

**Process:**

1. Blue is current production (serving traffic)
2. Deploy new version to Green
3. Run health checks on Green
4. Switch load balancer to Green
5. Green becomes production
6. Blue becomes standby (rollback option)

**Benefits:**

- Zero downtime deployment
- Instant rollback (switch back to Blue)
- Full testing in production-like environment

**Drawbacks:**

- Double infrastructure cost
- Database migrations can be complex

</details>

---

### Q10: What is canary deployment and when would you use it?

**Keywords:** Gradual Rollout, Risk Mitigation, Percentage Traffic
<details>
<summary>Click to Reveal Answer</summary>

**Canary Deployment** gradually rolls out changes to a small subset of users:

```
                    ┌─────────────┐
                    │ Load        │
                    │ Balancer    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌────▼────┐
        │   v1.0    │ │  v1.1   │
        │   90%     │ │  10%    │
        │ (Stable)  │ │(Canary) │
        └───────────┘ └─────────┘
```

**Process:**

1. Deploy new version alongside stable
2. Route 5-10% of traffic to new version
3. Monitor for errors, latency, user feedback
4. Gradually increase traffic (25%, 50%, 100%)
5. Roll back if issues detected

**Use Cases:**

- High-risk changes
- Large user bases
- Performance-sensitive applications
- Feature testing with real users

**Comparison with Blue-Green:**

| Aspect | Blue-Green | Canary |
|--------|------------|--------|
| Rollout | Instant switch | Gradual |
| Risk | Higher (all users) | Lower (subset) |
| Complexity | Simpler | More complex |

</details>

---

## Section 3: Jenkins

### Q11: What is Jenkins and what are its key features?

**Keywords:** CI/CD Server, Pipeline as Code, Plugins, Distributed Builds
<details>
<summary>Click to Reveal Answer</summary>

**Jenkins** is an open-source automation server for CI/CD:

**Key Features:**

1. **Pipeline as Code**: Define pipelines in Jenkinsfile
2. **Plugin Ecosystem**: 1800+ plugins for integrations
3. **Distributed Builds**: Master-agent architecture
4. **Extensibility**: Customizable via Groovy scripts
5. **SCM Integration**: Git, SVN, Mercurial support

**Core Concepts:**

- **Job/Project**: Runnable task
- **Build**: Single execution of a job
- **Pipeline**: Series of connected jobs
- **Node/Agent**: Machine that runs builds
- **Executor**: Thread that runs builds

**Common Plugins:**

- Git, GitHub
- Docker
- Blue Ocean (UI)
- Pipeline
- Credentials
- SonarQube Scanner

</details>

---

### Q12: Explain the difference between Declarative and Scripted Pipeline in Jenkins

**Keywords:** Jenkinsfile, Groovy, Syntax, Flexibility
<details>
<summary>Click to Reveal Answer</summary>

**Declarative Pipeline** (Recommended):

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'mvn compile'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
    }
    post {
        always {
            junit 'target/surefire-reports/*.xml'
        }
    }
}
```

**Scripted Pipeline:**

```groovy
node {
    stage('Build') {
        sh 'mvn compile'
    }
    stage('Test') {
        try {
            sh 'mvn test'
        } finally {
            junit 'target/surefire-reports/*.xml'
        }
    }
}
```

**Comparison:**

| Aspect | Declarative | Scripted |
|--------|-------------|----------|
| Syntax | Structured, predefined | Groovy-based, flexible |
| Learning Curve | Easier | Steeper |
| Error Handling | Built-in post section | Manual try/catch |
| Validation | Syntax checked early | Runtime validation |
| Flexibility | Less flexible | Full Groovy power |

**Recommendation:** Use Declarative for most cases; Scripted for complex logic.
</details>

---

### Q13: How do you handle credentials securely in Jenkins?

**Keywords:** Credentials Plugin, Binding, Secret Text, SSH Keys
<details>
<summary>Click to Reveal Answer</summary>

**Credential Types:**

- Username/Password
- Secret text
- Secret file
- SSH private key
- Certificate

**Storing Credentials:**

1. Navigate to: Manage Jenkins → Credentials
2. Add credentials with unique ID
3. Reference by ID in pipeline

**Using in Pipeline:**

```groovy
pipeline {
    agent any
    environment {
        DB_CREDS = credentials('database-credentials')
        // Creates: DB_CREDS_USR and DB_CREDS_PSW
    }
    stages {
        stage('Deploy') {
            steps {
                sh 'deploy.sh -u $DB_CREDS_USR -p $DB_CREDS_PSW'
            }
        }
    }
}
```

**With withCredentials block:**

```groovy
withCredentials([usernamePassword(
    credentialsId: 'docker-hub',
    usernameVariable: 'DOCKER_USER',
    passwordVariable: 'DOCKER_PASS'
)]) {
    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
}
```

**Best Practices:**

- Never print credentials in logs
- Use unique credential IDs
- Limit credential scope when possible
- Rotate credentials regularly

</details>

---

### Q14: How do you set up a multi-branch pipeline in Jenkins?

**Keywords:** Branch Discovery, Automatic Builds, Pull Requests
<details>
<summary>Click to Reveal Answer</summary>

**Multi-branch Pipeline** automatically creates jobs for each branch containing a Jenkinsfile.

**Setup:**

1. Create new item → Multibranch Pipeline
2. Configure branch sources (GitHub, GitLab, Bitbucket)
3. Set scan triggers (periodic or webhook)

**Benefits:**

- Automatic branch discovery
- Separate build history per branch
- PR/MR integration
- Clean up old branches automatically

**Branch-specific logic:**

```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy-production.sh'
            }
        }
        stage('Deploy Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh './deploy-staging.sh'
            }
        }
    }
}
```

**Branch filtering:**

```groovy
when {
    anyOf {
        branch 'main'
        branch 'release/*'
    }
}
```

</details>

---

### Q15: How do you parallelize stages in a Jenkins pipeline?

**Keywords:** Parallel, Stages, Performance, Matrix
<details>
<summary>Click to Reveal Answer</summary>

**Parallel Stages:**

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'mvn test'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'mvn verify -Pintegration'
                    }
                }
                stage('Security Scan') {
                    steps {
                        sh 'dependency-check.sh'
                    }
                }
            }
        }
    }
}
```

**Matrix Builds** (run same steps with different configurations):

```groovy
stage('Test') {
    matrix {
        axes {
            axis {
                name 'JAVA_VERSION'
                values '11', '17', '21'
            }
            axis {
                name 'OS'
                values 'linux', 'windows'
            }
        }
        stages {
            stage('Test') {
                steps {
                    sh "test-${JAVA_VERSION}-${OS}.sh"
                }
            }
        }
    }
}
```

**Benefits:**

- Faster pipeline execution
- Better resource utilization
- Comprehensive test coverage

</details>

---

## Section 4: Micro-Frontends (iframes and Single-SPA)

### Q16: What are Micro-Frontends and what problems do they solve?

**Keywords:** Independent Teams, Technology Agnostic, Vertical Slices
<details>
<summary>Click to Reveal Answer</summary>

**Micro-Frontends** apply microservices principles to the frontend:

**Problems with Monolithic Frontends:**

- Single large codebase difficult to maintain
- One team owns entire frontend
- Technology lock-in
- Long release cycles
- Difficult to parallelize development

**Micro-Frontend Solution:**

- Break UI into independent, deployable pieces
- Each team owns a vertical slice (UI + Backend)
- Independent technology choices
- Independent deployments

**Example - E-commerce:**

```
┌──────────────────────────────────────┐
│           Shell Application          │
├──────────┬───────────┬───────────────┤
│ Header   │ Products  │ Cart          │
│ (React)  │ (Angular) │ (Vue)         │
│ Team A   │ Team B    │ Team C        │
└──────────┴───────────┴───────────────┘
```

**Benefits:**

- Team autonomy
- Independent deployments
- Technology flexibility
- Easier maintenance

</details>

---

### Q17: Compare iframe-based Micro-Frontends with Single-SPA

**Keywords:** Isolation, Communication, Performance, Integration
<details>
<summary>Click to Reveal Answer</summary>

**iframe Approach:**

```html
<iframe src="https://products.example.com"></iframe>
<iframe src="https://cart.example.com"></iframe>
```

**Single-SPA Approach:**

```javascript
registerApplication({
  name: '@company/products',
  app: () => System.import('@company/products'),
  activeWhen: '/products'
});
```

**Comparison:**

| Aspect | iframes | Single-SPA |
|--------|---------|------------|
| **Isolation** | Complete (separate DOM) | Shared context |
| **Communication** | postMessage API | Custom events, props |
| **Performance** | Slower (multiple DOMs) | Better (shared resources) |
| **SEO** | Poor | Good |
| **Styling** | Completely isolated | May have CSS conflicts |
| **Complexity** | Low | Medium |
| **Debugging** | Harder | Easier |

**When to use iframes:**

- Strong security isolation required
- Legacy application integration
- Third-party content

**When to use Single-SPA:**

- Custom applications
- Need shared state/styling
- SEO important

</details>

---

### Q18: How do Micro-Frontends communicate with each other?

**Keywords:** Custom Events, Event Bus, postMessage, Props
<details>
<summary>Click to Reveal Answer</summary>

**1. Custom Events (Single-SPA):**

```javascript
// MFE A (Publisher)
window.dispatchEvent(new CustomEvent('cart:itemAdded', {
  detail: { productId: 123, quantity: 1 }
}));

// MFE B (Subscriber)
window.addEventListener('cart:itemAdded', (event) => {
  console.log('Item added:', event.detail);
  updateCartCount(event.detail);
});
```

**2. postMessage (iframes):**

```javascript
// Parent to iframe
iframe.contentWindow.postMessage({ type: 'UPDATE_USER', user: userData }, '*');

// Iframe to parent
window.parent.postMessage({ type: 'CART_UPDATED', count: 5 }, '*');

// Receiving messages
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://trusted.com') return;
  handleMessage(event.data);
});
```

**3. Shared State Store:**

```javascript
// Using a simple event bus
const eventBus = {
  events: {},
  subscribe: (event, callback) => { /*...*/ },
  publish: (event, data) => { /*...*/ }
};
```

**4. URL/Query Parameters:**

```javascript
// Navigate with state
window.history.pushState({}, '', '/products?category=electronics');
```

**Best Practices:**

- Minimize coupling between MFEs
- Use backend API as source of truth
- Document event contracts

</details>

---

### Q19: What is the Single-SPA lifecycle and how do you implement it?

**Keywords:** Bootstrap, Mount, Unmount, Application State
<details>
<summary>Click to Reveal Answer</summary>

**Single-SPA Lifecycle Functions:**

```javascript
// Required lifecycle functions
export function bootstrap(props) {
  // Called once when app first loads
  return Promise.resolve();
}

export function mount(props) {
  // Called when app should render
  // Render your app to the DOM
  return Promise.resolve();
}

export function unmount(props) {
  // Called when navigating away
  // Clean up: remove event listeners, DOM elements
  return Promise.resolve();
}
```

**React Example:**

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export function bootstrap() {
  return Promise.resolve();
}

export function mount(props) {
  ReactDOM.render(<App {...props} />, document.getElementById('products-container'));
  return Promise.resolve();
}

export function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('products-container'));
  return Promise.resolve();
}
```

**Application States:**

```
NOT_LOADED → LOADING_SOURCE_CODE → NOT_BOOTSTRAPPED
    → BOOTSTRAPPING → NOT_MOUNTED
    → MOUNTING → MOUNTED
    → UNMOUNTING → NOT_MOUNTED
```

</details>

---

### Q20: How do you handle routing in a Micro-Frontend architecture?

**Keywords:** Shell Router, Child Routers, Navigation Events
<details>
<summary>Click to Reveal Answer</summary>

**Two-Level Routing:**

**1. Shell Router (Single-SPA):**

```javascript
// Decides which MFE to load
registerApplication({
  name: '@company/products',
  app: () => System.import('@company/products'),
  activeWhen: ['/products', '/product/:id']
});

registerApplication({
  name: '@company/checkout',
  app: () => System.import('@company/checkout'),
  activeWhen: '/checkout'
});
```

**2. MFE Internal Router:**

```javascript
// React Router inside Products MFE
<Routes>
  <Route path="/products" element={<ProductList />} />
  <Route path="/product/:id" element={<ProductDetail />} />
</Routes>
```

**Navigation Between MFEs:**

```javascript
// Using Single-SPA's navigateToUrl
import { navigateToUrl } from 'single-spa';

// In Products MFE
function goToCheckout() {
  navigateToUrl('/checkout');
}
```

**iframe Routing:**

```javascript
// Parent controls navigation
function navigateToProduct(id) {
  document.getElementById('product-iframe').src = `/products/${id}`;
}
```

**Best Practices:**

- Shell owns top-level routes
- MFEs own their internal routes
- Use consistent navigation API
- Handle browser back/forward buttons

</details>

---

## Section 5: AWS (EC2, S3, Elastic Beanstalk)

### Q21: What is Amazon EC2 and what are its key features?

**Keywords:** Virtual Server, Instance Types, AMI, Elastic IP
<details>
<summary>Click to Reveal Answer</summary>

**EC2 (Elastic Compute Cloud)** provides resizable virtual servers in the cloud.

**Key Features:**

1. **Instance Types**: Different CPU/Memory/Storage configurations
   - t2.micro, m5.large, c5.xlarge, etc.
2. **AMI (Amazon Machine Image)**: Pre-configured templates
3. **Elastic IP**: Static public IP addresses
4. **Security Groups**: Virtual firewall for instances
5. **Key Pairs**: SSH authentication

**Instance Categories:**

| Type | Use Case |
|------|----------|
| General Purpose (t, m) | Web servers, dev environments |
| Compute Optimized (c) | Batch processing, gaming |
| Memory Optimized (r, x) | Databases, caching |
| Storage Optimized (i, d) | Data warehousing |
| Accelerated Computing (p, g) | Machine learning, GPU |

**Pricing Models:**

- On-Demand: Pay per hour/second
- Reserved: 1-3 year commitment, up to 72% savings
- Spot: Bid on unused capacity, up to 90% savings
- Savings Plans: Flexible commitment

</details>

---

### Q22: Explain EC2 Security Groups and their best practices

**Keywords:** Stateful Firewall, Inbound/Outbound Rules, Least Privilege
<details>
<summary>Click to Reveal Answer</summary>

**Security Groups** are virtual firewalls controlling traffic to EC2 instances.

**Characteristics:**

- **Stateful**: Return traffic automatically allowed
- **Default**: Deny all inbound, allow all outbound
- **Instance Level**: Applied to individual instances
- **Multiple**: Instance can have multiple security groups

**Rule Components:**

- Protocol (TCP, UDP, ICMP)
- Port range (22, 80, 443, 3000-3100)
- Source/Destination (IP, CIDR, Security Group ID)

**Best Practices:**

```
┌─────────────────────────────────────────────────────┐
│ Web Tier SG                                         │
│ - Inbound: 443 from 0.0.0.0/0                      │
│ - Inbound: 80 from 0.0.0.0/0                       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│ App Tier SG                                         │
│ - Inbound: 8080 from Web-Tier-SG                   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│ Database Tier SG                                    │
│ - Inbound: 5432 from App-Tier-SG                   │
└─────────────────────────────────────────────────────┘
```

**Rules:**

1. Apply principle of least privilege
2. Use security group references instead of IPs
3. Never open all ports (0-65535)
4. Restrict SSH (22) to specific IPs
5. Regularly audit security group rules

</details>

---

### Q23: What is Amazon S3 and what are its key features?

**Keywords:** Object Storage, Buckets, Durability, Storage Classes
<details>
<summary>Click to Reveal Answer</summary>

**S3 (Simple Storage Service)** is object storage with 11 9's durability (99.999999999%).

**Key Concepts:**

- **Bucket**: Container for objects (globally unique name)
- **Object**: File + metadata (up to 5TB)
- **Key**: Unique identifier within bucket

**Storage Classes:**

| Class | Use Case | Availability |
|-------|----------|--------------|
| Standard | Frequently accessed | 99.99% |
| Intelligent-Tiering | Unknown access patterns | 99.9% |
| Standard-IA | Infrequent access | 99.9% |
| One Zone-IA | Infrequent, non-critical | 99.5% |
| Glacier Instant | Archive, instant retrieval | 99.9% |
| Glacier Deep Archive | Long-term archive (12hr) | 99.99% |

**Features:**

- Versioning: Keep multiple versions of objects
- Lifecycle policies: Automate storage class transitions
- Static website hosting
- Cross-region replication
- Event notifications (Lambda, SNS, SQS)
- Server-side encryption

</details>

---

### Q24: How do you host a static website on S3?

**Keywords:** Static Hosting, Bucket Policy, Index Document, CloudFront
<details>
<summary>Click to Reveal Answer</summary>

**Steps to Host Static Website:**

1. **Create Bucket:**
   - Name matches domain (e.g., example.com)
   - Uncheck "Block all public access"

2. **Enable Static Website Hosting:**
   - Properties → Static website hosting → Enable
   - Set index document: `index.html`
   - Set error document: `error.html`

3. **Configure Bucket Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}
```

1. **Upload Files:**

```bash
aws s3 sync ./build s3://your-bucket-name --delete
```

1. **Access Website:**
   - Endpoint: `http://bucket-name.s3-website-region.amazonaws.com`

**Optional - Add CloudFront:**

- HTTPS support
- Custom domain
- Global CDN caching
- Better performance

</details>

---

### Q25: What is AWS Elastic Beanstalk and when would you use it?

**Keywords:** PaaS, Managed Infrastructure, Auto Scaling, Zero Configuration
<details>
<summary>Click to Reveal Answer</summary>

**Elastic Beanstalk** is a Platform as a Service (PaaS) that automatically handles:

- Capacity provisioning
- Load balancing
- Auto-scaling
- Application health monitoring

**Supported Platforms:**

- Java (Tomcat, Corretto)
- .NET (Windows Server)
- Node.js
- Python
- Ruby
- Go
- PHP
- Docker

**Components:**

- **Application**: Logical collection of components
- **Environment**: Version running on AWS resources
- **Application Version**: Deployable code package

**Deployment Methods:**

| Method | Description |
|--------|-------------|
| All at once | Deploy to all instances simultaneously |
| Rolling | Deploy in batches |
| Rolling with additional batch | Maintain full capacity |
| Immutable | Deploy to new instances, swap |
| Blue/Green | Separate environment, DNS swap |

**When to use:**

- Quick deployment without infrastructure expertise
- Standard web applications
- Want managed infrastructure with access to underlying resources
- Rapid prototyping

</details>

---

### Q26: How do you deploy a Spring Boot application to Elastic Beanstalk?

**Keywords:** JAR Deployment, Environment Variables, EB CLI
<details>
<summary>Click to Reveal Answer</summary>

**Method 1: Console Upload**

1. Build JAR: `mvn clean package`
2. Create Elastic Beanstalk application
3. Choose "Java" platform
4. Upload JAR file
5. Configure environment variables

**Method 2: EB CLI**

```bash
# Initialize
eb init my-app --platform java-17 --region us-east-1

# Create environment
eb create my-env

# Deploy
eb deploy

# View logs
eb logs

# Open in browser
eb open
```

**Configuration (.ebextensions/options.config):**

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    SPRING_PROFILES_ACTIVE: prod
    DB_URL: jdbc:postgresql://rds-endpoint:5432/mydb
  aws:elasticbeanstalk:container:java:
    Xms: 256m
    Xmx: 512m
```

**Procfile (optional):**

```
web: java -jar application.jar --server.port=5000
```

**Best Practices:**

- Use environment variables for configuration
- Set health check path in EB console
- Configure proper instance type
- Enable enhanced health monitoring

</details>

---

## Section 6: Java Memory Management and Garbage Collection

### Q27: Explain the Java Memory Model and its main areas

**Keywords:** Heap, Stack, Metaspace, Thread-Local
<details>
<summary>Click to Reveal Answer</summary>

**JVM Memory Areas:**

```
┌─────────────────────────────────────────────────────┐
│                    JVM Memory                        │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │                   HEAP                       │   │
│  │  ┌──────────────┐  ┌──────────────────────┐ │   │
│  │  │ Young Gen    │  │     Old Gen          │ │   │
│  │  │ ┌────┬────┐  │  │                      │ │   │
│  │  │ │Eden│ S0 │  │  │  Long-lived objects  │ │   │
│  │  │ │    │ S1 │  │  │                      │ │   │
│  │  │ └────┴────┘  │  └──────────────────────┘ │   │
│  │  └──────────────┘                           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │   Stack     │  │  Metaspace  │  │ Code Cache │  │
│  │ (per thread)│  │ (Classes)   │  │ (JIT)      │  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Areas:**

| Area | Contents | Thread |
|------|----------|--------|
| Heap | Objects, arrays | Shared |
| Stack | Local variables, method calls | Per-thread |
| Metaspace | Class metadata, method info | Shared |
| Code Cache | JIT compiled code | Shared |

**Key Settings:**

- `-Xms`: Initial heap size
- `-Xmx`: Maximum heap size
- `-Xss`: Stack size per thread
- `-XX:MetaspaceSize`: Initial metaspace

</details>

---

### Q28: What is Garbage Collection and how does it work?

**Keywords:** Mark, Sweep, Compact, GC Roots, Reachability
<details>
<summary>Click to Reveal Answer</summary>

**Garbage Collection** automatically reclaims memory from unreachable objects.

**Process:**

1. **Mark Phase:**
   - Start from GC roots (stack references, static fields)
   - Traverse object graph
   - Mark all reachable objects as "live"

2. **Sweep Phase:**
   - Remove unmarked (dead) objects
   - Reclaim memory

3. **Compact Phase (optional):**
   - Move live objects together
   - Reduce fragmentation

**GC Roots:**

- Local variables on thread stacks
- Active Java threads
- Static variables
- JNI references

**Example:**

```java
public void example() {
    Object a = new Object();  // Reachable via 'a'
    Object b = new Object();  // Reachable via 'b'
    a = null;                 // First object now unreachable → GC eligible
    // 'b' still reachable → not collected
}
```

**Types of GC:**

- **Minor GC**: Collects Young Generation (fast)
- **Major/Full GC**: Collects entire heap (slower)

</details>

---

### Q29: Explain the generational garbage collection approach

**Keywords:** Young Generation, Old Generation, Survivor Spaces, Promotion
<details>
<summary>Click to Reveal Answer</summary>

**Generational Hypothesis:** Most objects die young.

**Young Generation:**

- **Eden**: Where new objects are created
- **Survivor Spaces (S0, S1)**: Objects that survive Minor GC

**Object Lifecycle:**

```
1. Object created in Eden
   ↓ (Minor GC)
2. Survives → Moves to S0, age = 1
   ↓ (Minor GC)
3. Survives → Moves to S1, age = 2
   ↓ (Minor GC, age >= threshold)
4. Promoted to Old Generation
```

**Tuning Parameters:**

- `-XX:NewRatio=N`: Ratio of Old/Young
- `-XX:SurvivorRatio=N`: Ratio of Eden/Survivor
- `-XX:MaxTenuringThreshold=N`: Age for promotion

**Why Generations?**

- Short-lived objects collected quickly
- Long-lived objects not repeatedly scanned
- Different GC strategies per generation
- Better overall performance

**Default Settings (Java 17+):**

- Young Gen: ~1/3 of heap
- Tenuring threshold: 15

</details>

---

### Q30: Compare different Java Garbage Collectors

**Keywords:** G1GC, ZGC, Parallel GC, Serial GC
<details>
<summary>Click to Reveal Answer</summary>

**Available Garbage Collectors:**

| GC | Target | Pause Time | Best For |
|----|--------|------------|----------|
| Serial GC | Single-threaded | High | Small apps, single CPU |
| Parallel GC | Throughput | Medium | Batch processing |
| G1GC | Balanced | Low (<10ms) | General purpose |
| ZGC | Low latency | Very low (<1ms) | Large heaps, low latency |
| Shenandoah | Low latency | Very low (<1ms) | Similar to ZGC |

**G1GC (Default in Java 9+):**

```bash
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:G1HeapRegionSize=16m
```

**ZGC (Java 15+):**

```bash
-XX:+UseZGC
-XX:+ZGenerational    # Java 21+
```

**When to use each:**

- **Serial**: Containers with limited CPU, small heaps
- **Parallel**: Batch jobs, throughput-focused
- **G1GC**: Default choice, balanced performance
- **ZGC**: Sub-millisecond pauses, multi-TB heaps

</details>

---

### Q31: How do you diagnose and fix memory leaks in Java?

**Keywords:** Heap Dump, MAT, VisualVM, Profiling
<details>
<summary>Click to Reveal Answer</summary>

**Symptoms of Memory Leaks:**

- Gradual increase in heap usage
- Frequent Full GC without reclaiming memory
- `OutOfMemoryError: Java heap space`
- Application slowdown over time

**Diagnosis Steps:**

1. **Monitor Heap Usage:**

```bash
# Enable GC logging
-Xlog:gc*:file=gc.log:time
```

1. **Capture Heap Dump:**

```bash
# On OOM
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/tmp/dump.hprof

# Manually
jmap -dump:format=b,file=dump.hprof <pid>
```

1. **Analyze with Tools:**

- **Eclipse MAT**: Find leak suspects
- **VisualVM**: Real-time monitoring
- **JProfiler**: Commercial, detailed analysis

**Common Leak Causes:**

```java
// 1. Static collections that grow
private static List<Object> cache = new ArrayList<>();

// 2. Unclosed resources
InputStream is = new FileInputStream(file);
// Never closed!

// 3. Event listeners not removed
button.addActionListener(listener);
// Never removeActionListener()

// 4. ThreadLocal not cleaned
threadLocal.set(object);
// Never threadLocal.remove()
```

**Fixes:**

- Use `try-with-resources` for closeable resources
- Clear static collections when done
- Use weak references for caches
- Remove event listeners in cleanup

</details>

---

### Q32: What JVM flags are important for production applications?

**Keywords:** Heap Size, GC Tuning, Logging, OOM Handling
<details>
<summary>Click to Reveal Answer</summary>

**Essential Production Flags:**

**Memory Settings:**

```bash
-Xms4g                    # Initial heap (set equal to Xmx)
-Xmx4g                    # Maximum heap
-XX:MaxMetaspaceSize=256m # Limit metaspace
```

**GC Selection and Tuning:**

```bash
-XX:+UseG1GC              # Use G1 collector
-XX:MaxGCPauseMillis=200  # Target pause time
-XX:ParallelGCThreads=4   # GC thread count
```

**GC Logging:**

```bash
-Xlog:gc*:file=gc.log:time,level,tags:filecount=5,filesize=10m
```

**Error Handling:**

```bash
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/dumps/
-XX:+ExitOnOutOfMemoryError
```

**Performance:**

```bash
-XX:+UseStringDeduplication  # Save memory on duplicate strings
-XX:+UseCompressedOops       # Compress 64-bit pointers
```

**Example Production Configuration:**

```bash
java -Xms4g -Xmx4g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=200 \
     -Xlog:gc*:file=/logs/gc.log:time \
     -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/dumps/ \
     -jar application.jar
```

</details>

---

## Section 7: Scenario-Based Questions

### Q33: Your application is experiencing long GC pauses in production. How do you troubleshoot?

**Keywords:** GC Logs, Heap Analysis, Tuning, Collector Selection
<details>
<summary>Click to Reveal Answer</summary>

**Troubleshooting Steps:**

1. **Enable GC Logging:**

```bash
-Xlog:gc*:file=gc.log:time,uptime,level,tags
```

1. **Analyze GC Logs:**

- Look for Full GC frequency
- Check pause times
- Monitor heap usage patterns

1. **Identify Issues:**
| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Frequent Full GC | Heap too small | Increase -Xmx |
| Long pause times | Large heap, old GC | Switch to G1GC/ZGC |
| High CPU in GC | Too many threads | Adjust -XX:ParallelGCThreads |
| Memory not reclaimed | Memory leak | Heap dump analysis |

2. **Potential Fixes:**

```bash
# Switch to low-latency collector
-XX:+UseZGC

# Tune G1GC
-XX:+UseG1GC
-XX:MaxGCPauseMillis=100
-XX:G1HeapRegionSize=16m

# Increase heap
-Xms8g -Xmx8g
```

1. **Application Code Review:**

- Check for object allocation hotspots
- Review large object creation
- Look for memory leaks

</details>

---

### Q34: Design a CI/CD pipeline for a microservices application

**Keywords:** Build, Test, Deploy, Environments, Rollback
<details>
<summary>Click to Reveal Answer</summary>

**Pipeline Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────┐   ┌─────┐   ┌──────┐   ┌────────┐   ┌─────────┐  │
│  │Build│ → │Test │ → │Scan  │ → │Package │ → │Push     │  │
│  │     │   │     │   │      │   │        │   │Registry │  │
│  └─────┘   └─────┘   └──────┘   └────────┘   └─────────┘  │
│                                                             │
│       ┌──────────────────────────────────────────────┐     │
│       │                Deployment                     │     │
│       │  ┌───────┐   ┌─────────┐   ┌─────────────┐   │     │
│       │  │ Dev   │ → │ Staging │ → │ Production  │   │     │
│       │  │(auto) │   │ (auto)  │   │ (approval)  │   │     │
│       │  └───────┘   └─────────┘   └─────────────┘   │     │
│       └──────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**Jenkinsfile Example:**

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            parallel {
                stage('User Service') {
                    steps { sh 'mvn -f user-service/pom.xml package' }
                }
                stage('Order Service') {
                    steps { sh 'mvn -f order-service/pom.xml package' }
                }
            }
        }
        stage('Test') {
            parallel {
                stage('Unit Tests') { steps { sh 'mvn test' } }
                stage('Integration Tests') { steps { sh 'mvn verify' } }
            }
        }
        stage('Security Scan') {
            steps { sh 'trivy image my-app:${BUILD_NUMBER}' }
        }
        stage('Deploy Staging') {
            steps { sh 'kubectl apply -f k8s/staging/' }
        }
        stage('Deploy Production') {
            when { branch 'main' }
            input { message 'Deploy to production?' }
            steps { sh 'kubectl apply -f k8s/prod/' }
        }
    }
}
```

</details>

---

### Q35: How would you migrate a monolithic frontend to micro-frontends?

**Keywords:** Strangler Pattern, Module Federation, Incremental Migration
<details>
<summary>Click to Reveal Answer</summary>

**Migration Strategy (Strangler Fig Pattern for Frontend):**

**Phase 1: Preparation**

1. Identify feature boundaries
2. Choose MFE framework (Single-SPA, Module Federation)
3. Create shell application
4. Set up shared design system

**Phase 2: Incremental Extraction**

```
Month 1: Deploy shell + monolith
┌────────────────────┐
│  Shell Application │
│  ┌──────────────┐  │
│  │   Monolith   │  │
│  │   (iframe)   │  │
│  └──────────────┘  │
└────────────────────┘

Month 3: Extract first feature
┌────────────────────────────┐
│    Shell Application       │
│  ┌───────┐  ┌───────────┐ │
│  │Header │  │ Monolith  │ │
│  │(React)│  │ (iframe)  │ │
│  └───────┘  └───────────┘ │
└────────────────────────────┘

Month 6: Multiple MFEs
┌────────────────────────────────────┐
│       Shell Application            │
│ ┌───────┐ ┌────────┐ ┌──────────┐ │
│ │Header │ │Products│ │ Monolith │ │
│ │(React)│ │(React) │ │ (legacy) │ │
│ └───────┘ └────────┘ └──────────┘ │
└────────────────────────────────────┘
```

**Phase 3: Complete Migration**

- Extract all features
- Decommission monolith
- Optimize shared dependencies

**Key Considerations:**

- Shared authentication
- Consistent styling
- Performance monitoring
- Gradual rollout per feature

</details>

---

### Q36: Your EC2 instances are being overwhelmed during peak traffic. How do you handle this?

**Keywords:** Auto Scaling, Load Balancer, Monitoring, Capacity Planning
<details>
<summary>Click to Reveal Answer</summary>

**Immediate Actions:**

1. **Add instances manually:**
   - Launch more EC2 instances from AMI
   - Register with load balancer

2. **Scale vertically:**
   - Stop instance, change instance type
   - Start with larger instance

**Long-term Solutions:**

1. **Auto Scaling Group:**

```yaml
MinSize: 2
MaxSize: 10
DesiredCapacity: 4

Scaling Policies:
  - ScaleUp:
      Metric: CPUUtilization
      Threshold: 70%
      Action: Add 2 instances
  - ScaleDown:
      Metric: CPUUtilization
      Threshold: 30%
      Action: Remove 1 instance
```

1. **Application Load Balancer:**
   - Distribute traffic across instances
   - Health checks remove unhealthy instances
   - Target group with multiple AZs

2. **Architecture Improvements:**
   - Add caching (ElastiCache)
   - Use CDN for static content (CloudFront)
   - Optimize database (read replicas, connection pooling)
   - Consider serverless for burst traffic (Lambda)

3. **Monitoring:**
   - CloudWatch alarms
   - Application metrics
   - Capacity planning based on trends

</details>

---

## Section 8: Additional DevOps Questions

### Q37: What is GitOps and how does it differ from traditional DevOps?

**Keywords:** Git as Source of Truth, Declarative, Pull-Based, Reconciliation
<details>
<summary>Click to Reveal Answer</summary>

**GitOps** is an operational framework that applies DevOps best practices using Git as the single source of truth.

**Traditional DevOps (Push-Based):**

```
Developer → CI Pipeline → Push to Cluster
```

- Pipeline directly applies changes
- Imperative commands
- Credentials stored in CI system

**GitOps (Pull-Based):**

```
Developer → Git Repo ← Agent (ArgoCD/Flux) → Cluster
```

- Agent pulls desired state from Git
- Declarative configuration
- Self-healing: automatically reconciles drift

**Key Principles:**

1. **Declarative**: Describe desired state, not steps
2. **Versioned**: All changes tracked in Git
3. **Automated**: Changes applied automatically
4. **Auditable**: Full history of who changed what

**Tools:**

- ArgoCD
- Flux
- Jenkins X

</details>

---

### Q38: Explain the concept of Immutable Infrastructure

**Keywords:** Replace vs Modify, Consistency, Phoenix Servers
<details>
<summary>Click to Reveal Answer</summary>

**Immutable Infrastructure** means servers are never modified after deployment - they are replaced.

**Mutable (Traditional):**

```
Server v1 → SSH → Apply patches → Server v1.1 → Config changes → Server v1.2
```

- Configuration drift over time
- "Snowflake servers" - each unique
- Difficult to reproduce

**Immutable:**

```
Server v1 → Terminate → Deploy new Server v2
```

- Instances are disposable
- Always start from known state
- Easy to reproduce and scale

**Benefits:**

- Consistency across environments
- Easy rollback (revert to previous image)
- Eliminates configuration drift
- Simplified troubleshooting

**Implementation:**

```bash
# Build new AMI with changes
packer build app-image.json

# Update Auto Scaling Group
aws autoscaling update-auto-scaling-group \
  --launch-template Version=2
```

</details>

---

### Q39: What is Chaos Engineering and how do you implement it?

**Keywords:** Resilience, Failure Injection, Netflix Chaos Monkey
<details>
<summary>Click to Reveal Answer</summary>

**Chaos Engineering** is the discipline of experimenting on a system to build confidence in its ability to withstand turbulent conditions.

**Principles:**

1. Define steady state (normal behavior metrics)
2. Hypothesize steady state will continue
3. Introduce real-world events (failures)
4. Try to disprove hypothesis

**Common Experiments:**

| Experiment | Tools |
|------------|-------|
| Kill instances | Chaos Monkey |
| Network latency | Toxiproxy |
| CPU/Memory stress | stress-ng |
| Dependency failure | Gremlin |

**Example - AWS Fault Injection:**

```json
{
  "targets": { "Instances": "ec2-instances" },
  "actions": {
    "StopInstances": {
      "actionId": "aws:ec2:stop-instances",
      "duration": "PT5M"
    }
  }
}
```

**Best Practices:**

- Start in non-production
- Start small, increase blast radius
- Have rollback ready
- Monitor closely

</details>

---

### Q40: How do you implement feature flags in a CI/CD pipeline?

**Keywords:** LaunchDarkly, Gradual Rollout, Kill Switch
<details>
<summary>Click to Reveal Answer</summary>

**Feature Flags** (Feature Toggles) allow enabling/disabling features without deployment.

**Types:**

| Type | Purpose | Duration |
|------|---------|----------|
| Release | Gradual rollout | Short |
| Experiment | A/B testing | Medium |
| Ops | Kill switch | Permanent |
| Permission | Premium features | Permanent |

**Implementation:**

```java
// Using LaunchDarkly SDK
LDClient client = new LDClient("sdk-key");

if (client.boolVariation("new-checkout", user, false)) {
    showNewCheckout();
} else {
    showOldCheckout();
}
```

**CI/CD Integration:**

```groovy
stage('Deploy') {
    steps {
        // Deploy with feature disabled
        sh 'kubectl apply -f deployment.yaml'
        
        // Enable for 10% of users
        sh '''
            curl -X PATCH "https://app.launchdarkly.com/api/v2/flags/proj/new-feature" \
                 -d '{"kind": "updateFallthroughVariationOrRollout", "rolloutPercentage": 10}'
        '''
    }
}
```

**Benefits:**

- Decouple deployment from release
- Instant rollback (toggle off)
- Gradual rollout
- A/B testing

</details>

---

### Q41: What are the differences between containers and virtual machines?

**Keywords:** Hypervisor, Kernel Sharing, Isolation, Startup Time
<details>
<summary>Click to Reveal Answer</summary>

**Comparison:**

```
Virtual Machines:
┌─────┬─────┬─────┐
│App A│App B│App C│
├─────┼─────┼─────┤
│Guest│Guest│Guest│
│ OS  │ OS  │ OS  │
├─────┴─────┴─────┤
│   Hypervisor    │
├─────────────────┤
│   Host OS       │
├─────────────────┤
│   Hardware      │
└─────────────────┘

Containers:
┌─────┬─────┬─────┐
│App A│App B│App C│
├─────┴─────┴─────┤
│  Container      │
│  Runtime        │
├─────────────────┤
│   Host OS       │
├─────────────────┤
│   Hardware      │
└─────────────────┘
```

| Aspect | VM | Container |
|--------|-----|-----------|
| **Isolation** | Full (separate OS) | Process-level |
| **Size** | GBs | MBs |
| **Startup** | Minutes | Seconds |
| **Overhead** | High | Minimal |
| **Portability** | Less portable | Highly portable |
| **Security** | Stronger isolation | Shared kernel |

**When to use:**

- **VMs**: Different OS requirements, strong isolation
- **Containers**: Microservices, CI/CD, rapid scaling

</details>

---

## Section 9: Additional CI/CD Questions

### Q42: How do you implement rollback strategies in CI/CD?

**Keywords:** Version Control, Database Migrations, Feature Flags
<details>
<summary>Click to Reveal Answer</summary>

**Rollback Strategies:**

1. **Deployment Rollback:**

```bash
# Kubernetes
kubectl rollout undo deployment/my-app

# Elastic Beanstalk
eb deploy --version previously-working-version

# Docker Swarm
docker service rollback my-service
```

1. **Blue-Green Rollback:**

```
Switch load balancer back to Blue environment
```

1. **Database Rollback:**

```sql
-- Use versioned migrations that support down
-- Flyway example: V2__add_column.sql
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- V2__add_column_UNDO.sql
ALTER TABLE users DROP COLUMN email;
```

1. **Feature Flag Rollback:**

```javascript
// Instant disable without deployment
flagsmith.disableFeature('new-feature');
```

**Best Practices:**

- Keep previous versions available
- Make database changes backward compatible
- Test rollback procedures regularly
- Automate rollback in pipeline

</details>

---

### Q43: Explain the concept of Pipeline Orchestration

**Keywords:** DAG, Dependencies, Fan-out/Fan-in, Approval Gates
<details>
<summary>Click to Reveal Answer</summary>

**Pipeline Orchestration** coordinates multiple related pipelines or complex multi-stage workflows.

**Patterns:**

**1. Sequential:**

```
Build → Test → Deploy
```

**2. Parallel (Fan-out):**

```
       ┌→ Unit Tests     ─┐
Build ─┼→ Integration Tests ─┼→ Deploy
       └→ Security Scan  ─┘
```

**3. Fan-out/Fan-in:**

```
           ┌→ Service A Build ─┐
Checkout ─┼→ Service B Build ─┼→ Integration Test → Deploy
           └→ Service C Build ─┘
```

**Jenkins Example:**

```groovy
pipeline {
    stages {
        stage('Build All') {
            parallel {
                stage('Service A') { steps { build 'service-a-build' } }
                stage('Service B') { steps { build 'service-b-build' } }
            }
        }
        stage('Integration Test') {
            steps { build 'integration-tests' }
        }
        stage('Deploy') {
            input { message 'Deploy to production?' }
            steps { build 'deploy-all' }
        }
    }
}
```

**Tools:**

- Jenkins Pipeline
- GitLab CI/CD
- GitHub Actions
- AWS CodePipeline

</details>

---

### Q44: How do you manage secrets in a CI/CD pipeline?

**Keywords:** Vault, AWS Secrets Manager, Encryption, Rotation
<details>
<summary>Click to Reveal Answer</summary>

**Secret Management Approaches:**

**1. CI/CD Built-in Secrets:**

```groovy
// Jenkins
environment {
    DB_PASSWORD = credentials('db-password-id')
}
```

**2. External Secret Managers:**

```groovy
// HashiCorp Vault
withVault([
    vaultSecrets: [[
        path: 'secret/myapp',
        secretValues: [[vaultKey: 'db_password', envVar: 'DB_PASS']]
    ]]
]) {
    sh './deploy.sh'
}
```

**3. Cloud-Native:**

```bash
# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id myapp/db
```

**Best Practices:**

| Do | Don't |
|----|-------|
| Use dedicated secret manager | Store in code/config files |
| Rotate regularly | Use same password across envs |
| Encrypt at rest and transit | Log secret values |
| Limit access (RBAC) | Share via email/chat |
| Audit access | Hard-code in Dockerfiles |

**Detection:**

```yaml
# Pre-commit hook with gitleaks
- repo: https://github.com/gitleaks/gitleaks
  hooks:
    - id: gitleaks
```

</details>

---

### Q45: What is trunk-based development and how does it affect CI/CD?

**Keywords:** Short-Lived Branches, Feature Flags, Continuous Integration
<details>
<summary>Click to Reveal Answer</summary>

**Trunk-Based Development** is a branching model where developers frequently integrate into a single main branch.

**Comparison:**

```
GitFlow:
main ─────────────────────────────
      \           /     \        /
       develop ─────────────────
        \    /   \    /
         feat1    feat2

Trunk-Based:
main ─┬─┬─┬─┬─┬─┬─┬─┬─┬─►
      │ │ │ │ │ │ │ │ │
      commits (multiple per day)
```

**Key Practices:**

1. **Short-lived branches**: < 1 day
2. **Feature flags**: Hide incomplete features
3. **Pair programming**: Reduce review time
4. **Continuous integration**: Merge to main often

**Benefits for CI/CD:**

- Faster feedback loops
- Fewer merge conflicts
- Always-deployable main branch
- Simplified pipeline (only main to deploy)

**Challenges:**

- Requires feature flags
- Need comprehensive automated tests
- Cultural shift from long-lived branches

</details>

---

### Q46: How do you implement quality gates in a CI/CD pipeline?

**Keywords:** SonarQube, Code Coverage, Security Scan, Blockers
<details>
<summary>Click to Reveal Answer</summary>

**Quality Gates** are checkpoints that block deployment if quality criteria aren't met.

**Common Quality Gates:**

| Gate | Threshold | Tool |
|------|-----------|------|
| Code Coverage | > 80% | JaCoCo |
| Code Smells | 0 Critical | SonarQube |
| Security Vulnerabilities | 0 High/Critical | Snyk, OWASP |
| Unit Test Pass Rate | 100% | JUnit |
| Performance | < 2s response | JMeter |

**SonarQube Integration:**

```groovy
stage('Quality Gate') {
    steps {
        withSonarQubeEnv('sonar-server') {
            sh 'mvn sonar:sonar'
        }
        timeout(time: 5, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
        }
    }
}
```

**Custom Quality Gate:**

```groovy
stage('Coverage Check') {
    steps {
        script {
            def coverage = readFile('target/coverage.txt').trim()
            if (coverage.toFloat() < 80) {
                error "Code coverage ${coverage}% is below 80% threshold"
            }
        }
    }
}
```

</details>

---

## Section 10: Additional Jenkins Questions

### Q47: How do you configure Jenkins agents for distributed builds?

**Keywords:** Master-Agent, SSH, JNLP, Docker Agent
<details>
<summary>Click to Reveal Answer</summary>

**Agent Types:**

**1. Permanent Agents (SSH):**

```
Manage Jenkins → Nodes → New Node
- Launch method: SSH
- Host: agent-hostname
- Credentials: SSH key
```

**2. JNLP Agents (Inbound):**

```bash
# On agent machine
java -jar agent.jar -url http://jenkins-url \
     -secret <secret> -name <agent-name>
```

**3. Docker Agents:**

```groovy
pipeline {
    agent {
        docker {
            image 'maven:3.9-jdk-17'
            args '-v $HOME/.m2:/root/.m2'
        }
    }
}
```

**4. Kubernetes Agents:**

```groovy
pipeline {
    agent {
        kubernetes {
            yaml '''
                apiVersion: v1
                kind: Pod
                spec:
                  containers:
                  - name: maven
                    image: maven:3.9-jdk-17
            '''
        }
    }
}
```

**Best Practices:**

- Label agents by capability (java, docker, windows)
- Use ephemeral agents when possible
- Monitor agent health
- Secure agent communication

</details>

---

### Q48: How do you implement shared libraries in Jenkins?

**Keywords:** vars/, src/, Global Pipeline Libraries
<details>
<summary>Click to Reveal Answer</summary>

**Shared Libraries** provide reusable pipeline code.

**Directory Structure:**

```
shared-library/
├── vars/
│   └── buildJavaApp.groovy    # Global functions
├── src/
│   └── com/company/
│       └── Pipeline.groovy    # Classes
└── resources/
    └── templates/             # Config files
```

**vars/buildJavaApp.groovy:**

```groovy
def call(Map config) {
    pipeline {
        agent any
        stages {
            stage('Build') {
                steps {
                    sh "mvn clean package -P${config.profile}"
                }
            }
            stage('Test') {
                steps {
                    sh 'mvn test'
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
    }
}
```

**Using in Jenkinsfile:**

```groovy
@Library('my-shared-library') _

buildJavaApp(profile: 'production')
```

**Configuration:**

- Manage Jenkins → Configure System → Global Pipeline Libraries
- Name: my-shared-library
- Source: Git repository URL

</details>

---

### Q49: How do you implement Jenkins pipeline triggers?

**Keywords:** Webhooks, Polling, Cron, Upstream
<details>
<summary>Click to Reveal Answer</summary>

**Trigger Types:**

**1. SCM Webhook (Recommended):**

```groovy
pipeline {
    triggers {
        githubPush()  // For GitHub
    }
}
```

GitHub: Settings → Webhooks → Add `http://jenkins/github-webhook/`

**2. Polling SCM:**

```groovy
triggers {
    pollSCM('H/5 * * * *')  // Every 5 minutes
}
```

**3. Scheduled (Cron):**

```groovy
triggers {
    cron('0 2 * * *')  // Daily at 2 AM
}
```

**4. Upstream Job:**

```groovy
triggers {
    upstream(upstreamProjects: 'build-job', threshold: SUCCESS)
}
```

**5. Remote Trigger:**

```bash
# Trigger via API
curl -X POST "http://jenkins/job/my-job/build" \
     --user admin:api-token
```

**Best Practices:**

- Use webhooks over polling
- Use `H` for distributed load
- Limit concurrent builds

</details>

---

### Q50: How do you implement post-build actions in Jenkins?

**Keywords:** Post Section, Notifications, Artifacts, Cleanup
<details>
<summary>Click to Reveal Answer</summary>

**Post Section Conditions:**

```groovy
pipeline {
    agent any
    stages {
        stage('Build') { steps { sh 'mvn package' } }
    }
    post {
        always {
            // Always runs
            archiveArtifacts artifacts: 'target/*.jar'
            junit 'target/surefire-reports/*.xml'
        }
        success {
            // Only on success
            slackSend color: 'good', message: "Build succeeded"
        }
        failure {
            // Only on failure
            slackSend color: 'danger', message: "Build failed"
            emailext to: 'team@company.com',
                     subject: 'Build Failed',
                     body: 'Check ${BUILD_URL}'
        }
        unstable {
            // Test failures
            slackSend color: 'warning', message: "Tests failed"
        }
        cleanup {
            // Clean workspace
            cleanWs()
        }
    }
}
```

**Conditions:**

| Condition | When |
|-----------|------|
| always | Every execution |
| success | SUCCESS status |
| failure | FAILURE status |
| unstable | UNSTABLE (test failures) |
| changed | Status changed from previous |
| fixed | Previous was failure, now success |
| regression | Previous was success, now failure |
| cleanup | After all other post conditions |

</details>

---

### Q51: How do you secure a Jenkins installation?

**Keywords:** RBAC, HTTPS, Audit, Hardening
<details>
<summary>Click to Reveal Answer</summary>

**Security Best Practices:**

**1. Authentication:**

```
Manage Jenkins → Security → Authentication
- Use LDAP/Active Directory
- Enable CSRF protection
- Disable "Allow users to sign up"
```

**2. Authorization (RBAC):**

```
- Role-based Strategy plugin
- Define roles: admin, developer, viewer
- Assign users to roles
- Project-based permissions
```

**3. Secure Communication:**

```bash
# Enable HTTPS
--httpPort=-1 --httpsPort=8443 \
--httpsKeyStore=/path/to/keystore.jks \
--httpsKeyStorePassword=changeit
```

**4. Agent Security:**

```
- Use SSH or TLS for agent communication
- Restrict agent permissions
- Use ephemeral agents
```

**5. Audit Logging:**

```
- Install Audit Trail plugin
- Log all configuration changes
- Monitor with SIEM
```

**6. Additional Hardening:**

- Run as non-root user
- Limit plugin installations
- Regular security updates
- Disable Jenkins CLI (if not needed)

</details>

---

## Section 11: Additional Micro-Frontend Questions

### Q52: How do you handle shared dependencies in Micro-Frontends?

**Keywords:** Import Maps, Module Federation, Externals
<details>
<summary>Click to Reveal Answer</summary>

**Strategies:**

**1. Import Maps (Single-SPA):**

```html
<script type="systemjs-importmap">
{
  "imports": {
    "react": "https://cdn.example.com/react@18.2.0/umd/react.production.min.js",
    "react-dom": "https://cdn.example.com/react-dom@18.2.0/umd/react-dom.production.min.js"
  }
}
</script>
```

**2. Webpack Module Federation:**

```javascript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'products',
  remotes: {
    shell: 'shell@http://shell.example.com/remoteEntry.js'
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
  }
})
```

**3. Webpack Externals:**

```javascript
externals: {
  react: 'React',
  'react-dom': 'ReactDOM'
}
```

**Trade-offs:**

| Approach | Bundle Size | Complexity | Version Control |
|----------|-------------|------------|-----------------|
| Duplicated deps | Larger | Low | Full control |
| Shared (CDN) | Smaller | Medium | Less control |
| Module Federation | Optimal | Higher | Flexible |

</details>

---

### Q53: How do you implement authentication across Micro-Frontends?

**Keywords:** JWT, Session, SSO, Token Propagation
<details>
<summary>Click to Reveal Answer</summary>

**Authentication Strategies:**

**1. Shell Handles Auth:**

```javascript
// Shell application
const token = await authenticateUser(credentials);
localStorage.setItem('auth_token', token);

// Pass to MFEs via props
registerApplication({
  app: () => System.import('@company/products'),
  customProps: { authToken: () => localStorage.getItem('auth_token') }
});
```

**2. Shared Auth Service:**

```javascript
// @company/auth-service
export const authService = {
  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
  login: async (creds) => { /* ... */ },
  logout: () => localStorage.removeItem('token')
};
```

**3. iframe with postMessage:**

```javascript
// Parent sends token to iframe
iframe.contentWindow.postMessage({
  type: 'AUTH_TOKEN',
  token: authToken
}, 'https://mfe.example.com');

// MFE receives
window.addEventListener('message', (event) => {
  if (event.data.type === 'AUTH_TOKEN') {
    setAuthToken(event.data.token);
  }
});
```

**Best Practices:**

- Use HTTP-only cookies when possible
- Implement token refresh mechanism
- Handle auth expiration gracefully
- Use SSO (OAuth2/OIDC) for enterprise

</details>

---

### Q54: How do you test Micro-Frontends?

**Keywords:** Unit, Integration, Contract, E2E
<details>
<summary>Click to Reveal Answer</summary>

**Testing Pyramid:**

```
        ┌─────────┐
        │   E2E   │  Few, slow, expensive
        ├─────────┤
        │Integration│
        ├─────────────┤
        │   Contract  │
        ├───────────────┤
        │     Unit      │  Many, fast, cheap
        └───────────────┘
```

**1. Unit Tests (Per MFE):**

```javascript
// Jest + Testing Library
test('renders product list', () => {
  render(<ProductList products={mockProducts} />);
  expect(screen.getByText('Product 1')).toBeInTheDocument();
});
```

**2. Integration Tests (Shell + MFE):**

```javascript
// Test MFE mounts correctly
test('products MFE loads', async () => {
  navigateToUrl('/products');
  await waitFor(() => {
    expect(document.querySelector('#products-container')).not.toBeNull();
  });
});
```

**3. Contract Tests:**

```javascript
// Pact - verify event contracts
const interaction = {
  state: 'product added to cart',
  uponReceiving: 'cart:itemAdded event',
  withContent: { productId: 123, quantity: 1 }
};
```

**4. E2E Tests:**

```javascript
// Cypress/Playwright
test('checkout flow', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.goto('/checkout');
  await expect(page.locator('.cart-count')).toHaveText('1');
});
```

</details>

---

### Q55: What are the deployment strategies for Micro-Frontends?

**Keywords:** Independent Deploy, CDN, Versioning
<details>
<summary>Click to Reveal Answer</summary>

**Deployment Options:**

**1. Independent CDN Deployment:**

```
products.example.com → CDN → S3 Bucket A
checkout.example.com → CDN → S3 Bucket B
```

```javascript
// Import map points to MFE URLs
{
  "@company/products": "https://products.example.com/main.js",
  "@company/checkout": "https://checkout.example.com/main.js"
}
```

**2. Versioned Deployments:**

```
products.example.com/v1.2.3/main.js
products.example.com/v1.2.4/main.js
```

**3. Monorepo Build & Deploy:**

```yaml
# Only build changed MFEs
jobs:
  detect-changes:
    outputs:
      products: ${{ steps.filter.outputs.products }}
  build-products:
    if: needs.detect-changes.outputs.products == 'true'
```

**4. Container-Based:**

```yaml
# docker-compose.yml
services:
  shell:
    image: company/shell:latest
  products:
    image: company/products:v1.2.3
  checkout:
    image: company/checkout:v2.0.1
```

**Best Practices:**

- Use content hashing for cache busting
- Implement canary releases per MFE
- Monitor each MFE independently
- Rollback individual MFEs

</details>

---

### Q56: How do you handle CSS conflicts in Micro-Frontends?

**Keywords:** CSS Modules, Shadow DOM, Scoped Styles, BEM
<details>
<summary>Click to Reveal Answer</summary>

**Strategies:**

**1. CSS Modules:**

```javascript
// styles.module.css
.button { background: blue; }

// Compiles to: .button_abc123 { background: blue; }
import styles from './styles.module.css';
<button className={styles.button}>Click</button>
```

**2. CSS-in-JS:**

```javascript
// Styled-components
const Button = styled.button`
  background: blue;
`;
// Generates unique class names
```

**3. Shadow DOM (Web Components):**

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <style>button { background: blue; }</style>
      <button>Click</button>
    `;
  }
}
```

**4. Naming Conventions (BEM):**

```css
/* Each MFE uses unique prefix */
.products-button { }
.checkout-button { }
```

**5. PostCSS Prefixing:**

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-prefix-selector')({
      prefix: '[data-mfe="products"]'
    })
  ]
};
```

</details>

---

## Section 12: Additional AWS Questions

### Q57: What are VPCs and how do you design a secure network architecture?

**Keywords:** Subnets, Route Tables, NAT Gateway, Internet Gateway
<details>
<summary>Click to Reveal Answer</summary>

**VPC (Virtual Private Cloud)** is your isolated network in AWS.

**Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                      VPC (10.0.0.0/16)                      │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │     Availability Zone A  │  │     Availability Zone B  │  │
│  │  ┌───────────────────┐  │  │  ┌───────────────────┐  │  │
│  │  │Public Subnet      │  │  │  │Public Subnet      │  │  │
│  │  │10.0.1.0/24        │  │  │  │10.0.2.0/24        │  │  │
│  │  │  [ALB] [NAT GW]   │  │  │  │  [ALB]            │  │  │
│  │  └───────────────────┘  │  │  └───────────────────┘  │  │
│  │  ┌───────────────────┐  │  │  ┌───────────────────┐  │  │
│  │  │Private Subnet     │  │  │  │Private Subnet     │  │  │
│  │  │10.0.3.0/24        │  │  │  │10.0.4.0/24        │  │  │
│  │  │  [EC2] [EC2]      │  │  │  │  [EC2] [EC2]      │  │  │
│  │  └───────────────────┘  │  │  └───────────────────┘  │  │
│  │  ┌───────────────────┐  │  │  ┌───────────────────┐  │  │
│  │  │DB Subnet          │  │  │  │DB Subnet          │  │  │
│  │  │10.0.5.0/24 [RDS]  │  │  │  │10.0.6.0/24 [RDS]  │  │  │
│  │  └───────────────────┘  │  │  └───────────────────┘  │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Components:**

- **Internet Gateway**: Connects VPC to internet
- **NAT Gateway**: Allows private subnets outbound access
- **Route Tables**: Control traffic routing
- **Network ACLs**: Stateless subnet-level firewall
- **Security Groups**: Stateful instance-level firewall

</details>

---

### Q58: What are IAM best practices?

**Keywords:** Least Privilege, MFA, Roles vs Users, Policies
<details>
<summary>Click to Reveal Answer</summary>

**IAM (Identity and Access Management) Best Practices:**

**1. Least Privilege:**

```json
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::my-bucket/specific-prefix/*"
}
```

**2. Use Roles for AWS Services:**

```json
// EC2 instance role instead of access keys
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::my-bucket/*"
  }]
}
```

**3. Enable MFA:**

```json
{
  "Condition": {
    "Bool": { "aws:MultiFactorAuthPresent": "true" }
  }
}
```

**4. Additional Practices:**

| Practice | Description |
|----------|-------------|
| No root account usage | Create IAM users |
| Password policies | Complexity, rotation |
| Access key rotation | Every 90 days |
| Remove unused credentials | Regular audits |
| Use groups | Assign permissions to groups |
| Enable CloudTrail | Audit all API calls |

</details>

---

### Q59: How does AWS Auto Scaling work?

**Keywords:** Launch Template, Scaling Policies, Target Tracking
<details>
<summary>Click to Reveal Answer</summary>

**Auto Scaling Components:**

**1. Launch Template:**

```json
{
  "ImageId": "ami-12345678",
  "InstanceType": "t3.medium",
  "SecurityGroupIds": ["sg-123"],
  "UserData": "#!/bin/bash\nyum install -y httpd"
}
```

**2. Auto Scaling Group:**

```json
{
  "MinSize": 2,
  "MaxSize": 10,
  "DesiredCapacity": 4,
  "HealthCheckType": "ELB",
  "HealthCheckGracePeriod": 300
}
```

**3. Scaling Policies:**

| Type | Description |
|------|-------------|
| **Target Tracking** | Maintain metric at target value |
| **Step Scaling** | Scale based on alarm thresholds |
| **Scheduled** | Scale at specific times |
| **Predictive** | ML-based forecasting |

**Target Tracking Example:**

```json
{
  "TargetValue": 70.0,
  "PredefinedMetricType": "ASGAverageCPUUtilization"
}
```

**Scaling Process:**

```
CloudWatch Alarm → Auto Scaling → Launch/Terminate → ELB Registration
```

</details>

---

### Q60: What is AWS Lambda and when would you use it?

**Keywords:** Serverless, Event-Driven, Pay-per-Use, Cold Start
<details>
<summary>Click to Reveal Answer</summary>

**AWS Lambda** is serverless compute that runs code in response to events.

**Use Cases:**

- API backends (with API Gateway)
- File processing (S3 triggers)
- Stream processing (Kinesis, DynamoDB)
- Scheduled tasks (CloudWatch Events)
- Microservices

**Example Function:**

```java
public class Handler implements RequestHandler<S3Event, String> {
    @Override
    public String handleRequest(S3Event event, Context context) {
        String bucket = event.getRecords().get(0).getS3().getBucket().getName();
        String key = event.getRecords().get(0).getS3().getObject().getKey();
        // Process file
        return "Processed: " + key;
    }
}
```

**Limits:**

| Resource | Limit |
|----------|-------|
| Timeout | 15 minutes |
| Memory | 128 MB - 10 GB |
| Package size | 50 MB (zipped) |
| Concurrent executions | 1000 (default) |

**Cold Start Mitigation:**

- Use Provisioned Concurrency
- Keep functions warm with scheduled pings
- Optimize package size
- Use SnapStart (Java)

</details>

---

### Q61: How do you monitor and troubleshoot AWS resources?

**Keywords:** CloudWatch, X-Ray, CloudTrail, VPC Flow Logs
<details>
<summary>Click to Reveal Answer</summary>

**Monitoring Tools:**

**1. CloudWatch Metrics:**

```bash
# Create alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "High-CPU" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --period 300 \
    --statistic Average
```

**2. CloudWatch Logs:**

```java
// Application logging
logger.info("Processing order: {}", orderId);
// → CloudWatch Log Group → Insights queries
```

**3. AWS X-Ray (Distributed Tracing):**

```
Request → API Gateway → Lambda → DynamoDB
   └── Trace ID: 1-xxx-yyy
          └── Segments show latency at each step
```

**4. CloudTrail (API Audit):**

```json
{
  "eventName": "TerminateInstances",
  "userIdentity": { "userName": "admin" },
  "sourceIPAddress": "1.2.3.4"
}
```

**5. VPC Flow Logs:**

```
2 123456789 eni-abc123 10.0.1.5 52.94.76.8 443 49761 6 25 20000 ACCEPT
```

**Dashboard Example:**

- EC2 CPU/Memory/Disk
- ALB Request Count/Latency
- Lambda Invocations/Errors
- RDS Connections/IOPS

</details>

---

## Section 13: Additional Java Memory & GC Questions

### Q62: What are common causes of OutOfMemoryError?

**Keywords:** Heap, Metaspace, GC Overhead, Direct Memory
<details>
<summary>Click to Reveal Answer</summary>

**OutOfMemoryError Types:**

**1. Java heap space:**

```java
// Creating too many objects
List<byte[]> list = new ArrayList<>();
while (true) {
    list.add(new byte[1024 * 1024]);  // 1MB each
}
```

**Fix:** Increase `-Xmx`, fix memory leak

**2. Metaspace:**

```java
// Too many classes loaded (common with reflection/proxies)
for (int i = 0; i < 100000; i++) {
    Enhancer.create(MyClass.class, new MyInterceptor());
}
```

**Fix:** Increase `-XX:MaxMetaspaceSize`, check class loading

**3. GC Overhead limit exceeded:**

```java
// GC taking >98% of time, recovering <2% memory
Map<String, String> leakingMap = new HashMap<>();
while (true) {
    leakingMap.put(UUID.randomUUID().toString(), data);
}
```

**Fix:** More heap, fix memory leak

**4. Direct buffer memory:**

```java
// Too many direct ByteBuffers
while (true) {
    ByteBuffer.allocateDirect(1024 * 1024);
}
```

**Fix:** Increase `-XX:MaxDirectMemorySize`

**Diagnosis:**

```bash
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/dumps/
```

</details>

---

### Q63: How do you analyze GC logs?

**Keywords:** GC Log Format, Pause Times, Throughput, Tools
<details>
<summary>Click to Reveal Answer</summary>

**Enable GC Logging:**

```bash
# Java 9+
-Xlog:gc*:file=gc.log:time,uptime,level,tags:filecount=5,filesize=10m

# Java 8
-XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log
```

**Sample GC Log (G1GC):**

```
[2024-01-05T10:30:15.123+0000][info][gc] GC(42) Pause Young (Normal) 
    (G1 Evacuation Pause)
[2024-01-05T10:30:15.125+0000][info][gc] GC(42) 
    Eden regions: 25->0(23)
    Survivor regions: 4->5(4)
    Old regions: 10->12
[2024-01-05T10:30:15.125+0000][info][gc] GC(42) 
    Pause: 2.345ms
    User: 0.008s Sys: 0.001s Real: 0.002s
```

**Key Metrics:**

| Metric | What to Look For |
|--------|------------------|
| Pause time | Should be <= target |
| Frequency | Too frequent = heap too small |
| Reclaimed | If low, possible leak |
| Full GC | Should be rare |

**Analysis Tools:**

- **GCViewer**: Desktop application
- **GCEasy**: Online analyzer
- **JClarity Censum**: Commercial

</details>

---

### Q64: What is the difference between strong, soft, weak, and phantom references?

**Keywords:** Reference Types, GC Behavior, Caching
<details>
<summary>Click to Reveal Answer</summary>

**Reference Types:**

```java
// Strong - Normal reference
Object strong = new Object();
// Never collected while referenced

// Soft - Collected when memory is low
SoftReference<Object> soft = new SoftReference<>(new Object());
// Good for caches

// Weak - Collected at next GC
WeakReference<Object> weak = new WeakReference<>(new Object());
// Good for listeners, canonicalizing mappings

// Phantom - Collected, but finalizer not run
PhantomReference<Object> phantom = new PhantomReference<>(obj, queue);
// Good for cleanup, alternative to finalize()
```

**Comparison:**

| Type | GC Behavior | Use Case |
|------|-------------|----------|
| Strong | Never collected | Normal usage |
| Soft | Collected when OOM imminent | Memory-sensitive caches |
| Weak | Next GC cycle | WeakHashMap, listeners |
| Phantom | After finalization | Resource cleanup |

**Cache Example:**

```java
// Memory-sensitive cache using SoftReference
Map<String, SoftReference<ExpensiveObject>> cache = new HashMap<>();

public ExpensiveObject get(String key) {
    SoftReference<ExpensiveObject> ref = cache.get(key);
    ExpensiveObject obj = (ref != null) ? ref.get() : null;
    if (obj == null) {
        obj = loadExpensive(key);
        cache.put(key, new SoftReference<>(obj));
    }
    return obj;
}
```

</details>

---

### Q65: How does the JIT compiler optimize Java code?

**Keywords:** HotSpot, Tiered Compilation, Inlining, Escape Analysis
<details>
<summary>Click to Reveal Answer</summary>

**JIT (Just-In-Time) Compilation:**

**Tiered Compilation:**

```
Interpreted → C1 (Client) → C2 (Server)
    Quick         Fast         Highly optimized
```

**Common Optimizations:**

**1. Method Inlining:**

```java
// Before
int calculate(int x) { return helper(x) + 1; }
int helper(int x) { return x * 2; }

// After inlining
int calculate(int x) { return x * 2 + 1; }
```

**2. Escape Analysis:**

```java
// Object doesn't escape - allocated on stack
void process() {
    Point p = new Point(1, 2);  // Stack allocation
    int result = p.x + p.y;
}
```

**3. Loop Unrolling:**

```java
// Before
for (int i = 0; i < 4; i++) { sum += a[i]; }

// After
sum += a[0]; sum += a[1]; sum += a[2]; sum += a[3];
```

**Monitoring:**

```bash
-XX:+PrintCompilation
-XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining
```

**JIT Flags:**

```bash
-XX:CompileThreshold=10000    # Invocations before compile
-XX:+TieredCompilation        # Enable tiered (default)
-XX:TieredStopAtLevel=1       # Stop at C1 (faster startup)
```

</details>

---

### Q66: How do you optimize Java applications for containers?

**Keywords:** Container Awareness, CPU Limits, Memory Limits
<details>
<summary>Click to Reveal Answer</summary>

**Container Challenges:**

- JVM may see host resources, not container limits
- Incorrect CPU/memory calculations
- OOMKilled by container runtime

**JVM Container Awareness (Java 10+):**

```bash
# Automatically detects container limits
java -XX:+UseContainerSupport \
     -XX:MaxRAMPercentage=75.0 \
     -jar app.jar
```

**Memory Configuration:**

```dockerfile
# Container limit: 2GB
# JVM should use less to avoid OOMKilled
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0"
```

**CPU Configuration:**

```bash
# Respect CPU limits
-XX:ActiveProcessorCount=2  # Override detected CPUs
```

**Best Practices:**

| Setting | Recommendation |
|---------|----------------|
| MaxRAMPercentage | 75% of container limit |
| Heap dump | Store on mounted volume |
| GC | G1GC or ZGC for containers |
| JVM | Use JRE-slim or distroless |

**Example Dockerfile:**

```dockerfile
FROM eclipse-temurin:17-jre-alpine
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 \
               -XX:+UseG1GC \
               -XX:+ExitOnOutOfMemoryError"
COPY target/app.jar app.jar
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

</details>

---

## Section 14: Additional Scenario-Based Questions

### Q67: Design a CI/CD pipeline for a monorepo with multiple services

**Keywords:** Change Detection, Parallel Builds, Shared Libraries
<details>
<summary>Click to Reveal Answer</summary>

**Monorepo Structure:**

```
monorepo/
├── services/
│   ├── user-service/
│   ├── order-service/
│   └── payment-service/
├── shared/
│   └── common-lib/
└── Jenkinsfile
```

**Pipeline Design:**

```groovy
pipeline {
    agent any
    stages {
        stage('Detect Changes') {
            steps {
                script {
                    def changes = sh(script: '''
                        git diff --name-only HEAD~1 HEAD
                    ''', returnStdout: true).trim().split('\n')
                    
                    env.BUILD_USER = changes.any { it.startsWith('services/user-service') }
                    env.BUILD_ORDER = changes.any { it.startsWith('services/order-service') }
                    env.BUILD_SHARED = changes.any { it.startsWith('shared/') }
                }
            }
        }
        
        stage('Build Shared') {
            when { environment name: 'BUILD_SHARED', value: 'true' }
            steps { sh 'mvn -f shared/common-lib/pom.xml install' }
        }
        
        stage('Build Services') {
            parallel {
                stage('User Service') {
                    when { environment name: 'BUILD_USER', value: 'true' }
                    steps { sh 'mvn -f services/user-service/pom.xml package' }
                }
                stage('Order Service') {
                    when { environment name: 'BUILD_ORDER', value: 'true' }
                    steps { sh 'mvn -f services/order-service/pom.xml package' }
                }
            }
        }
    }
}
```

</details>

---

### Q68: How would you troubleshoot a microservices application that's running slowly?

**Keywords:** Distributed Tracing, Profiling, Resource Monitoring
<details>
<summary>Click to Reveal Answer</summary>

**Troubleshooting Approach:**

**1. Identify the Bottleneck:**

```
Client → Gateway → Service A → Service B → Database
                        ↓
               Where is latency?
```

**2. Distributed Tracing (Zipkin/Jaeger):**

```
Trace ID: abc123
├── Gateway: 5ms
├── Service A: 200ms ← Bottleneck!
│   ├── Database query: 180ms
│   └── Processing: 20ms
└── Service B: 10ms
```

**3. Check Metrics Dashboard:**

| Metric | Service A | Normal |
|--------|-----------|--------|
| CPU | 95% | < 70% |
| Memory | 85% | < 80% |
| GC Time | 15% | < 5% |
| DB Pool | 100% used | < 80% |

**4. Application Profiling:**

```bash
# Async Profiler
./profiler.sh -d 60 -f flamegraph.html <pid>
```

**5. Common Fixes:**

- **High CPU**: Add instances, optimize code
- **Memory pressure**: Increase heap, fix leaks
- **Database slow**: Add indexes, optimize queries
- **Connection exhaustion**: Increase pool size
- **GC pauses**: Tune GC, reduce allocation

</details>

---

### Q69: How would you implement zero-downtime database migrations?

**Keywords:** Backward Compatible, Expand-Contract, Blue-Green
<details>
<summary>Click to Reveal Answer</summary>

**Expand-Contract Pattern:**

**Phase 1: Expand (Add new, keep old)**

```sql
-- Migration 1: Add new column
ALTER TABLE users ADD COLUMN email_new VARCHAR(255);

-- Application: Write to both columns
UPDATE users SET email = ?, email_new = ? WHERE id = ?;
```

**Phase 2: Migrate Data**

```sql
-- Backfill existing data
UPDATE users SET email_new = email WHERE email_new IS NULL;
```

**Phase 3: Switch**

```java
// Application uses new column
String email = user.getEmailNew();
```

**Phase 4: Contract (Remove old)**

```sql
-- Migration 2: Remove old column
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN email_new TO email;
```

**Rules for Zero-Downtime:**

| Change | Safe? | Strategy |
|--------|-------|----------|
| Add column | Yes | Add with default |
| Add index | Yes | CREATE INDEX CONCURRENTLY |
| Drop column | No | Expand-contract |
| Rename column | No | Expand-contract |
| Change type | No | Expand-contract |

**Tools:**

- Flyway/Liquibase for version control
- pt-online-schema-change for MySQL
- gh-ost for GitHub-style migrations

</details>

---

### Q70: How would you set up a disaster recovery plan for a cloud application?

**Keywords:** RTO, RPO, Multi-Region, Backup
<details>
<summary>Click to Reveal Answer</summary>

**Key Metrics:**

- **RPO (Recovery Point Objective)**: Maximum data loss acceptable
- **RTO (Recovery Time Objective)**: Maximum downtime acceptable

**DR Strategies:**

| Strategy | RTO | RPO | Cost |
|----------|-----|-----|------|
| Backup & Restore | Hours | Hours | $ |
| Pilot Light | Minutes | Minutes | $$ |
| Warm Standby | Minutes | Seconds | $$$ |
| Active-Active | Seconds | Zero | $$$$ |

**AWS Multi-Region Setup:**

```
┌─────────────────────┐     ┌─────────────────────┐
│    Primary Region    │     │   Secondary Region   │
│    (us-east-1)       │     │    (us-west-2)       │
│  ┌───────────────┐   │     │  ┌───────────────┐   │
│  │  EC2 (Active) │   │     │  │ EC2 (Standby) │   │
│  └───────────────┘   │     │  └───────────────┘   │
│  ┌───────────────┐   │     │  ┌───────────────┐   │
│  │  RDS (Primary)│ ──┼─────┼→ │ RDS (Replica) │   │
│  └───────────────┘   │     │  └───────────────┘   │
│  ┌───────────────┐   │     │  ┌───────────────┐   │
│  │  S3 (CRR)     │ ──┼─────┼→ │  S3 (Replica) │   │
│  └───────────────┘   │     │  └───────────────┘   │
└─────────────────────┘     └─────────────────────┘
            ↑                         ↑
            └──────── Route 53 ───────┘
                   (Health Checks)
```

**Checklist:**

- [ ] Database replication configured
- [ ] S3 cross-region replication
- [ ] Route 53 health checks and failover
- [ ] Regularly test DR runbooks
- [ ] Document recovery procedures

</details>

---

### Q71: How would you optimize a slow Jenkins pipeline?

**Keywords:** Parallel Stages, Caching, Agent Optimization
<details>
<summary>Click to Reveal Answer</summary>

**Analysis:**

```groovy
// Add timing to identify slow stages
stage('Build') {
    steps {
        script {
            def start = System.currentTimeMillis()
            sh 'mvn package'
            echo "Build took: ${System.currentTimeMillis() - start}ms"
        }
    }
}
```

**Optimizations:**

**1. Parallelize Independent Stages:**

```groovy
stage('Tests') {
    parallel {
        stage('Unit') { steps { sh 'mvn test' } }
        stage('Integration') { steps { sh 'mvn verify' } }
        stage('Security') { steps { sh 'dependency-check' } }
    }
}
```

**2. Cache Dependencies:**

```groovy
// Maven
agent {
    docker {
        image 'maven:3.9'
        args '-v $HOME/.m2:/root/.m2'
    }
}

// npm
sh 'npm ci --cache .npm'
```

**3. Use Ephemeral Agents:**

```groovy
agent {
    kubernetes {
        yaml '''
            spec:
              containers:
              - name: maven
                image: maven:3.9-jdk-17
                resources:
                  requests: { memory: "2Gi", cpu: "2" }
        '''
    }
}
```

**4. Skip Unnecessary Work:**

```groovy
when {
    changeset "src/**"  // Only build if source changed
}
```

**5. Optimize Docker Builds:**

```dockerfile
# Multi-stage + layer caching
COPY pom.xml .
RUN mvn dependency:go-offline  # Cached layer
COPY src ./src
RUN mvn package
```

</details>

---

### Q72: How would you implement observability for a distributed system?

**Keywords:** Logs, Metrics, Traces, Alerting
<details>
<summary>Click to Reveal Answer</summary>

**Three Pillars of Observability:**

**1. Logging (ELK Stack):**

```java
// Structured logging with correlation
MDC.put("traceId", traceId);
logger.info("Processing order", 
    kv("orderId", orderId),
    kv("userId", userId));
// → {"traceId": "abc", "orderId": "123", "userId": "456"}
```

**2. Metrics (Prometheus + Grafana):**

```java
// Micrometer metrics
@Timed(value = "order.processing.time", 
       histogram = true)
public Order processOrder(OrderRequest request) {
    counter.increment("orders.received");
    // ...
}
```

**3. Tracing (Jaeger/Zipkin):**

```java
@Traced
public void processPayment(Payment payment) {
    Span span = tracer.currentSpan();
    span.tag("paymentId", payment.getId());
    // Automatically propagated to downstream calls
}
```

**Architecture:**

```
┌────────────────────────────────────────────────────────┐
│                     Applications                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│  │Service A│  │Service B│  │Service C│               │
│  └────┬────┘  └────┬────┘  └────┬────┘               │
└───────┼────────────┼────────────┼──────────────────────┘
        │ Logs       │ Metrics    │ Traces
        ▼            ▼            ▼
┌─────────────┐ ┌──────────┐ ┌─────────┐
│ Elasticsearch│ │Prometheus│ │ Jaeger  │
└──────┬──────┘ └────┬─────┘ └────┬────┘
       │             │            │
       ▼             ▼            ▼
┌─────────────────────────────────────────┐
│              Grafana Dashboard           │
│  [Logs] [Metrics] [Traces] [Alerts]     │
└─────────────────────────────────────────┘
```

**Alerting Rules:**

```yaml
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 5m
  annotations:
    summary: "High error rate on {{ $labels.service }}"
```

</details>

---
