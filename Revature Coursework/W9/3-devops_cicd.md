# Week 8 - Wednesday: DevOps and CI/CD with Jenkins

## 1. DevOps and CI/CD Concepts

### What is DevOps?

**DevOps** is a set of practices that combines software **Dev**elopment and IT **Op**erations to shorten the development lifecycle and deliver high-quality software continuously.

### Traditional Development (Waterfall)

```
Dev Team ──▶ Code ──▶ Handoff ──▶ Ops Team ──▶ Deploy
           (Weeks)   (Wait)      (Manual)    (Months)
        ⚠️ Silos    ⚠️ Delays   ⚠️ Errors
```

### DevOps Approach

```
┌─────────────────────────────────────────┐
│  Dev + Ops Collaborate                  │
│                                         │
│  Code → Build → Test → Deploy           │
│   ▲                           │         │
│   └───── Feedback Loop ◀──────┘         │
│                                         │
│  Automation + Monitoring + Feedback     │
└─────────────────────────────────────────┘
```

---

## 2. DevOps Overview

### DevOps Culture

**CALMS Framework**:

| Principle | Description |
| :--- | :--- |
| **Culture** | Collaboration between Dev and Ops teams |
| **Automation** | Automate repetitive tasks (build, test, deploy) |
| **Lean** | Eliminate waste, continuous improvement |
| **Measurement** | Measure everything (metrics, KPIs) |
| **Sharing** | Share knowledge, tools, and responsibilities |

### DevOps Lifecycle

```
┌────────┐   ┌────────┐    ┌────────┐    ┌────────┐
│  Plan  │──▶│  Code  │──▶│ Build  │──▶│  Test  │
└────────┘   └────────┘    └────────┘    └────────┘
     ▲                                        │
     │                                        ▼
┌────────┐   ┌────────┐    ┌────────┐    ┌────────┐
│Monitor │◀──│Operate │◀──│ Deploy │◀──│Release │
└────────┘   └────────┘    └────────┘    └────────┘
```

### Benefits of DevOps

| Benefit | Impact |
| :--- | :--- |
| **Faster Time to Market** | Deploy features in days instead of months |
| **Higher Quality** | Automated testing catches bugs early |
| **Improved Collaboration** | Dev and Ops work together |
| **Increased Efficiency** | Automation reduces manual work |
| **Better Security** | Security integrated into pipeline (DevSecOps) |
| **Faster Recovery** | Quick rollback and bug fixes |

---

## 3. Continuous Integration (CI)

### What is Continuous Integration?

**Continuous Integration** is a practice where developers frequently integrate code into a shared repository (multiple times per day). Each integration is automatically built and tested.

### Traditional Approach

```
Developer A ──▶ Works for 2 weeks ──▶ Commits code
Developer B ──▶ Works for 2 weeks ──▶ Commits code
                                       ⚠️ Merge conflicts!
                                       ⚠️ Integration issues!
```

### CI Approach

```
Developer A ──▶ Commits daily ──▶ Auto Build + Test
Developer B ──▶ Commits daily ──▶ Auto Build + Test
                                   ✅ Early conflict detection
                                   ✅ Fast feedback
```

### CI Workflow

```
┌──────────────┐
│  Developer   │
│  Commits Code│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Version      │
│ Control (Git)│
└──────┬───────┘
       │ Webhook triggers
       ▼
┌──────────────┐
│   CI Server  │
│   (Jenkins)  │
└──────┬───────┘
       │
       ├──▶ Checkout Code
       │
       ├──▶ Build (Maven/Gradle)
       │
       ├──▶ Run Tests (Unit, Integration)
       │
       ├──▶ Static Analysis (SonarQube)
       │
       └──▶ Generate Reports
              │
              ├── ✅ Success → Notify Team
              └── ❌ Failure → Notify Team + Stop Pipeline
```

### CI Principles

1. **Maintain a Single Source Repository**: All code in version control (Git).
2. **Automate the Build**: Scripts that build the project automatically.
3. **Make Build Self-Testing**: Include automated tests in the build.
4. **Commit Daily**: Developers integrate code frequently.
5. **Build Every Commit**: Every commit triggers a build.
6. **Keep Build Fast**: Builds should complete in < 10 minutes.
7. **Test in Production Clone**: Test environment mirrors production.
8. **Make it Easy to Get Deliverables**: Artifacts readily available.
9. **Everyone Can See Results**: Build status visible to all.
10. **Automate Deployment**: One-click deployment.

---

## 4. Continuous Delivery (CD)

### What is Continuous Delivery?

**Continuous Delivery** extends CI by automatically preparing code for release to production. Code is always in a deployable state.

### Key Difference: Delivery vs Deployment

| Concept | Automation | Production Deploy |
| :--- | :--- | :--- |
| **Continuous Integration** | Build + Test | Manual |
| **Continuous Delivery** | Build + Test + Staging Deploy | Manual (Approval Required) |
| **Continuous Deployment** | Build + Test + Production Deploy | Automatic (No Manual Step) |

### Continuous Delivery Pipeline

```
Code Commit
    │
    ▼
Build + Unit Tests
    │
    ▼
Integration Tests
    │
    ▼
Deploy to Staging
    │
    ▼
Automated Tests on Staging
    │
    ▼
Manual Approval ◀── QA Team Reviews
    │
    ▼
Ready for Production
```

### Characteristics

- **Automated Testing**: Comprehensive test suite.
- **Deployment Automation**: Scripts for deployment.
- **Environment Parity**: Staging mirrors production.
- **Always Deployable**: Main branch is always production-ready.

---

## 5. Continuous Deployment

### What is Continuous Deployment?

**Continuous Deployment** goes further than Continuous Delivery by automatically deploying every change that passes all stages to production.

### Continuous Deployment Pipeline

```
Code Commit
    │
    ▼
Build + Unit Tests
    │
    ▼
Integration Tests
    │
    ▼
Deploy to Staging
    │
    ▼
Automated Tests on Staging
    │
    ▼
Deploy to Production (Automatic)
    │
    ▼
Monitor + Rollback if Needed
```

### Requirements for Continuous Deployment

1. **Comprehensive Test Coverage**: High confidence in automated tests.
2. **Monitoring**: Real-time monitoring to detect issues.
3. **Rollback Strategy**: Quick rollback mechanism.
4. **Feature Flags**: Enable/disable features without redeployment.
5. **Team Discipline**: Team follows best practices.

---

## 6. Introduction To Jenkins

### What is Jenkins?

**Jenkins** is an open-source automation server used to automate parts of the software development process (build, test, deploy).

### Key Features

- **Open Source**: Free and community-driven.
- **Extensible**: 1,800+ plugins.
- **Distributed**: Master-agent architecture for scaling.
- **Platform Agnostic**: Runs on Windows, Linux, macOS.
- **Pipeline as Code**: Define pipelines in version control.

---

## 7. Jenkins Architecture

### Master-Agent Architecture

```
┌──────────────────────┐
│   Jenkins Master     │
│                      │
│ - Schedule jobs      │
│ - Monitor agents     │
│ - Distribute builds  │
│ - Store configs      │
└───────┬──────────────┘
        │
        ├────────────────┬────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Agent 1     │  │  Agent 2     │  │  Agent 3     │
│  (Linux)     │  │  (Windows)   │  │  (macOS)     │
│              │  │              │  │              │
│ - Build Java │  │ - Build .NET │  │ - Build iOS  │
│ - Run Tests  │  │ - Run Tests  │  │ - Run Tests  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Components

| Component | Description |
| :--- | :--- |
| **Master** | Central server that orchestrates builds |
| **Agent (Slave)** | Worker machines that execute jobs |
| **Job/Project** | A buildable task (compile code, run tests) |
| **Build** | A single execution of a job |
| **Plugin** | Extension that adds functionality |
| **Workspace** | Directory where build happens |

---

## 8. Jenkins Installation

### Method 1: War File

```bash
# Download Jenkins
wget https://get.jenkins.io/war-stable/latest/jenkins.war

# Run Jenkins
java -jar jenkins.war --httpPort=8080

# Access: http://localhost:8080
```

### Method 2: Docker

```bash
docker run -d \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  --name jenkins \
  jenkins/jenkins:lts
```

### Method 3: Package Manager (Ubuntu)

```bash
# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Install Jenkins
sudo apt-get update
sudo apt-get install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### Initial Setup

1. **Access Jenkins**: `http://localhost:8080`
2. **Unlock Jenkins**: Use initial admin password from `/var/jenkins_home/secrets/initialAdminPassword`
3. **Install Suggested Plugins**
4. **Create Admin User**

---

## 9. Jenkins Job/Project

### Freestyle Project

**Classic job type** with GUI configuration.

#### Creating a Freestyle Job

1. **New Item** → Enter name → **Freestyle project** → **OK**
2. **Source Code Management** → Git → Repository URL: `https://github.com/yourorg/your-repo`
3. **Build Triggers** → Poll SCM: `H/5 * * * *` (every 5 minutes)
4. **Build Steps** → Add build step → Execute shell:

    ```bash
    mvn clean package
    ```

5. **Post-build Actions** → Archive artifacts: `target/*.jar`

### Pipeline Project

**Modern job type** with code-based configuration (Jenkinsfile).

---

## 10. Jenkins Build

### What is a Build?

A **build** is a single execution of a job. Each build has:

- **Build Number**: Sequential number (#1, #2, #3...).
- **Status**: Success ✅, Failure ❌, Unstable ⚠️, Aborted 🚫.
- **Console Output**: Logs from the build.
- **Artifacts**: Files produced by the build.
- **Test Results**: Unit test reports.

### Build History

```
#42 ✅ 2 hours ago  - All tests passed
#41 ❌ 3 hours ago  - Compilation failed
#40 ✅ 5 hours ago  - All tests passed
#39 ⚠️ 6 hours ago  - Tests passed but warnings
#38 ✅ 8 hours ago  - All tests passed
```

---

## 11. Creating a CI/CD Pipeline with Jenkins

### What is a Pipeline?

A **pipeline** is a suite of automated processes (build, test, deploy) defined as code.

### Pipeline as Code (Jenkinsfile)

**Benefits**:

- Version controlled.
- Code review for pipeline changes.
- Reusable across projects.

### Declarative Pipeline

**Jenkinsfile**:

```groovy
pipeline {
    agent any
    
    environment {
        MAVEN_HOME = tool 'Maven'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/yourorg/your-repo.git'
            }
        }
        
        stage('Build') {
            steps {
                sh '${MAVEN_HOME}/bin/mvn clean compile'
            }
        }
        
        stage('Test') {
            steps {
                sh '${MAVEN_HOME}/bin/mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Package') {
            steps {
                sh '${MAVEN_HOME}/bin/mvn package -DskipTests'
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                sh 'scp target/*.jar user@staging:/opt/app/'
                sh 'ssh user@staging "systemctl restart app"'
            }
        }
    }
    
    post {
        success {
            emailext subject: "Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     body: "The build was successful!",
                     to: "team@example.com"
        }
        failure {
            emailext subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                     body: "The build failed. Check console output.",
                     to: "team@example.com"
        }
    }
}
```

### Scripted Pipeline (Advanced)

```groovy
node {
    try {
        stage('Checkout') {
            git 'https://github.com/yourorg/your-repo.git'
        }
        
        stage('Build') {
            sh 'mvn clean compile'
        }
        
        stage('Test') {
            sh 'mvn test'
            junit 'target/surefire-reports/*.xml'
        }
        
        stage('Deploy') {
            if (env.BRANCH_NAME == 'main') {
                sh 'scp target/*.jar user@prod:/opt/app/'
                sh 'ssh user@prod "systemctl restart app"'
            } else {
                echo "Skipping deployment for branch: ${env.BRANCH_NAME}"
            }
        }
    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        // Cleanup
        cleanWs()
    }
}
```

---

## 12. Jenkins Plugins and Integrations

### Essential Plugins

| Plugin | Purpose |
| :--- | :--- |
| **Git Plugin** | Version control integration |
| **Maven Integration** | Build Java projects |
| **Pipeline** | Pipeline as code support |
| **Docker Pipeline** | Build and publish Docker images |
| **Kubernetes** | Deploy to Kubernetes |
| **SonarQube Scanner** | Code quality analysis |
| **Email Extension** | Enhanced email notifications |
| **Slack Notification** | Send build status to Slack |
| **Blue Ocean** | Modern UI for pipelines |

### Installing Plugins

1. **Manage Jenkins** → **Manage Plugins**
2. **Available** tab → Search for plugin
3. **Install without restart** or **Install and restart**

### Integration Examples

#### SonarQube Integration

**Jenkinsfile**:

```groovy
stage('Code Quality') {
    steps {
        withSonarQubeEnv('SonarQube') {
            sh '${MAVEN_HOME}/bin/mvn sonar:sonar'
        }
    }
}

stage('Quality Gate') {
    steps {
        timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
        }
    }
}
```

#### Docker Integration

**Jenkinsfile**:

```groovy
stage('Build Docker Image') {
    steps {
        script {
            docker.build("myapp:${env.BUILD_NUMBER}")
        }
    }
}

stage('Push to Registry') {
    steps {
        script {
            docker.withRegistry('https://registry.example.com', 'docker-credentials') {
                docker.image("myapp:${env.BUILD_NUMBER}").push()
                docker.image("myapp:${env.BUILD_NUMBER}").push('latest')
            }
        }
    }
}
```

#### Kubernetes Deployment

**Jenkinsfile**:

```groovy
stage('Deploy to Kubernetes') {
    steps {
        kubernetesDeploy(
            configs: 'k8s/deployment.yaml',
            kubeconfigId: 'kubeconfig-credentials',
            enableConfigSubstitution: true
        )
    }
}
```

---

## 13. WebHook

### What is a Webhook?

A **webhook** is an HTTP callback that triggers a Jenkins build when an event occurs (e.g., code push to GitHub).

### Traditional Polling vs Webhook

#### Polling (Inefficient)

```
Jenkins ──every 5 min──▶ GitHub: "Any changes?"
GitHub ◀──────────────── "No"

Jenkins ──every 5 min──▶ GitHub: "Any changes?"
GitHub ◀──────────────── "No"

Jenkins ──every 5 min──▶ GitHub: "Any changes?"
GitHub ◀──────────────── "Yes, there's a new commit"
Jenkins ──────────────▶ Trigger Build
```

#### Webhook (Efficient)

```
Developer pushes code ──▶ GitHub
                          │
                          ▼
                    Webhook triggers
                          │
                          ▼
                       Jenkins ──▶ Start Build Immediately
```

### Setting Up GitHub Webhook

#### Step 1: Configure Jenkins Job

**Build Triggers** → Check **GitHub hook trigger for GITScm polling**

#### Step 2: Configure GitHub Repository

1. Go to **Settings** → **Webhooks** → **Add webhook**
2. **Payload URL**: `http://your-jenkins-url/github-webhook/`
3. **Content type**: `application/json`
4. **Events**: Select **Just the push event**
5. **Active**: Check
6. **Add webhook**

### Webhook Payload Example

```json
{
  "ref": "refs/heads/main",
  "before": "abc123...",
  "after": "def456...",
  "repository": {
    "name": "your-repo",
    "full_name": "yourorg/your-repo",
    "url": "https://github.com/yourorg/your-repo"
  },
  "pusher": {
    "name": "johndoe",
    "email": "john@example.com"
  },
  "commits": [
    {
      "id": "def456",
      "message": "Fix user authentication bug",
      "timestamp": "2024-01-15T10:30:00Z",
      "author": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### Webhook Security

**Add Secret Token**:

```groovy
// Validate webhook signature
pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    stages {
        stage('Validate') {
            steps {
                script {
                    // Jenkins automatically validates GitHub webhook signature
                    echo "Webhook validated"
                }
            }
        }
    }
}
```

---

## 14. Complete CI/CD Pipeline Example

### Repository Structure

```
my-spring-boot-app/
├── src/
│   ├── main/
│   └── test/
├── pom.xml
├── Dockerfile
├── k8s/
│   └── deployment.yaml
└── Jenkinsfile
```

### Jenkinsfile

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        APP_NAME = 'my-spring-boot-app'
        DOCKER_IMAGE = "${DOCKER_REGISTRY}/${APP_NAME}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Code Quality') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Package') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_IMAGE}:${env.BUILD_NUMBER}").push()
                        docker.image("${DOCKER_IMAGE}:${env.BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                kubernetesDeploy(
                    configs: 'k8s/deployment.yaml',
                    kubeconfigId: 'kubeconfig-staging',
                    enableConfigSubstitution: true
                )
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'mvn verify -P integration-tests'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                kubernetesDeploy(
                    configs: 'k8s/deployment.yaml',
                    kubeconfigId: 'kubeconfig-prod',
                    enableConfigSubstitution: true
                )
            }
        }
    }
    
    post {
        success {
            slackSend color: 'good',
                      message: "Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
        failure {
            slackSend color: 'danger',
                      message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
        always {
            cleanWs()
        }
    }
}
```

---

## 15. Best Practices

### Jenkins Administration

1. **Backup**: Regular backups of Jenkins home directory.
2. **Security**: Enable authentication and authorization.
3. **Agent Management**: Use agents for builds, not master.
4. **Plugin Updates**: Keep plugins updated for security.
5. **Resource Limits**: Configure build timeouts and workspace cleanup.

### Pipeline Development

1. **Pipeline as Code**: Store Jenkinsfile in version control.
2. **Fail Fast**: Run quick tests first.
3. **Parallel Execution**: Run independent stages in parallel.
4. **Shared Libraries**: Reuse common pipeline code.
5. **Declarative over Scripted**: Use declarative syntax for simplicity.

### CI/CD Strategy

1. **Commit Frequently**: Integrate code multiple times per day.
2. **Automated Testing**: Comprehensive test coverage.
3. **Fast Feedback**: Keep builds under 10 minutes.
4. **Trunk-Based Development**: Work on main branch with feature flags.
5. **Monitoring**: Monitor pipeline performance and success rates.
