# Week 9 - Wednesday: Kubernetes Fundamentals

## 1. Kubernetes Theory

### What is Kubernetes?
**Kubernetes (K8s)** is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications.

### Why Use Kubernetes?
-   **Container Orchestration**: Manage hundreds or thousands of containers across multiple hosts.
-   **Self-Healing**: Automatically restarts failed containers, replaces containers, and kills containers that don't respond.
-   **Auto-Scaling**: Scale applications up or down based on demand.
-   **Load Balancing**: Distributes network traffic to ensure stability.
-   **Rolling Updates**: Deploy new versions with zero downtime.
-   **Rollback**: Revert to previous versions if something goes wrong.

### Kubernetes vs. Docker
| Feature | Docker | Kubernetes |
| :--- | :--- | :--- |
| **Purpose** | Containerization platform | Container orchestration platform |
| **Scope** | Single host | Multiple hosts (cluster) |
| **Scaling** | Manual | Automatic |
| **Load Balancing** | Basic | Advanced |
| **Self-Healing** | No | Yes |

**Key Point**: Docker creates containers. Kubernetes manages those containers at scale.

---

## 2. Kubernetes Architecture

Kubernetes follows a **master-worker** architecture.

### Control Plane (Master Node)
The brain of the cluster. Responsible for managing the cluster state.

#### Components:
1.  **API Server** (`kube-apiserver`)
    -   Entry point for all REST commands.
    -   Exposes the Kubernetes API.
    -   All communication goes through the API Server.

2.  **etcd**
    -   Distributed key-value store.
    -   Stores all cluster data (configuration, state, metadata).
    -   The "database" of Kubernetes.

3.  **Scheduler** (`kube-scheduler`)
    -   Assigns Pods to Nodes based on resource availability.
    -   Watches for newly created Pods with no assigned Node.

4.  **Controller Manager** (`kube-controller-manager`)
    -   Runs controller processes.
    -   Examples: Node Controller, Replication Controller, Endpoints Controller.

5.  **Cloud Controller Manager** (optional)
    -   Manages cloud-specific control logic (e.g., AWS, GCP, Azure).

### Worker Nodes
The machines that run your containers.

#### Components:
1.  **Kubelet**
    -   Agent that runs on each node.
    -   Ensures containers are running in Pods.
    -   Communicates with the API Server.

2.  **Kube-Proxy**
    -   Network proxy that runs on each node.
    -   Maintains network rules for communication.
    -   Enables service discovery and load balancing.

3.  **Container Runtime**
    -   Software responsible for running containers.
    -   Examples: Docker, containerd, CRI-O.

### Cluster Diagram
```
┌─────────────────────────────────────┐
│       Control Plane (Master)        │
│  ┌────────┐ ┌──────┐ ┌───────────┐ │
│  │API Svr │ │ etcd │ │ Scheduler │ │
│  └────────┘ └──────┘ └───────────┘ │
│  ┌─────────────────────────────┐   │
│  │   Controller Manager        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
             │
   ┌─────────┴──────────┐
   │                    │
┌──▼──────────┐  ┌──────▼──────┐
│ Worker Node │  │ Worker Node │
│  ┌────────┐ │  │  ┌────────┐ │
│  │Kubelet │ │  │  │Kubelet │ │
│  └────────┘ │  │  └────────┘ │
│  ┌────────┐ │  │  ┌────────┐ │
│  │  Pods  │ │  │  │  Pods  │ │
│  └────────┘ │  │  └────────┘ │
└─────────────┘  └─────────────┘
```

---

## 3. Kubernetes Components

### Pod
-   The **smallest deployable unit** in Kubernetes.
-   A Pod can contain one or more containers (usually one).
-   Containers in a Pod share:
    -   Network namespace (same IP address).
    -   Storage volumes.
-   Pods are **ephemeral**: They can be created and destroyed dynamically.

**Example Pod YAML:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

### ReplicaSet
-   Ensures a specified number of Pod replicas are running at all times.
-   If a Pod dies, the ReplicaSet creates a new one.
-   Rarely created directly; usually managed by a Deployment.

### Deployment
-   Manages ReplicaSets and Pods.
-   Provides declarative updates (rolling updates, rollbacks).
-   The **preferred way** to deploy applications.

**Example Deployment YAML:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

### Service
-   Exposes a set of Pods as a network service.
-   Provides stable IP and DNS name for Pods (which are ephemeral).
-   Types:
    -   **ClusterIP** (default): Exposes the service on an internal IP (only accessible within the cluster).
    -   **NodePort**: Exposes the service on each Node's IP at a static port.
    -   **LoadBalancer**: Exposes the service externally using a cloud provider's load balancer.
    -   **ExternalName**: Maps a service to a DNS name.

**Example Service YAML:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

### ConfigMap
-   Stores configuration data as key-value pairs.
-   Decouples configuration from container images.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
```

### Secret
-   Stores sensitive data (passwords, tokens, SSH keys).
-   Base64 encoded (not encrypted by default).

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded "admin"
  password: cGFzc3dvcmQ=  # base64 encoded "password"
```

### Namespace
-   Virtual clusters within a physical cluster.
-   Provides scope for names (pods, services, etc.).
-   Useful for multi-tenancy (dev, staging, prod).

```bash
# List namespaces
kubectl get namespaces

# Create namespace
kubectl create namespace dev
```

### Volume
-   Directory accessible to containers in a Pod.
-   Types:
    -   **emptyDir**: Temporary storage tied to Pod lifecycle.
    -   **hostPath**: Mounts a file or directory from the host node.
    -   **persistentVolumeClaim (PVC)**: Request for persistent storage.

### Ingress
-   Manages external access to services (typically HTTP/HTTPS).
-   Provides load balancing, SSL termination, and name-based virtual hosting.

---

## 4. Kubernetes Deployment Workflow

### Step 1: Create a Deployment YAML
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spring-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: spring-app
  template:
    metadata:
      labels:
        app: spring-app
    spec:
      containers:
      - name: spring-app
        image: myusername/spring-app:1.0
        ports:
        - containerPort: 8080
```

### Step 2: Apply the Deployment
```bash
kubectl apply -f deployment.yaml
```

### Step 3: Create a Service YAML
```yaml
apiVersion: v1
kind: Service
metadata:
  name: spring-app-service
spec:
  selector:
    app: spring-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

### Step 4: Apply the Service
```bash
kubectl apply -f service.yaml
```

### Step 5: Verify
```bash
# Check deployments
kubectl get deployments

# Check pods
kubectl get pods

# Check services
kubectl get services

# Get detailed info
kubectl describe service spring-app-service
```

---

## 5. Using `kubectl` CLI

### Cluster Information
```bash
# View cluster info
kubectl cluster-info

# View nodes
kubectl get nodes

# View all resources
kubectl get all
```

### Working with Pods
```bash
# List all pods
kubectl get pods

# List pods with more details
kubectl get pods -o wide

# Describe a pod
kubectl describe pod <pod-name>

# View logs
kubectl logs <pod-name>

# Execute command in pod
kubectl exec -it <pod-name> -- /bin/bash

# Delete a pod
kubectl delete pod <pod-name>
```

### Working with Deployments
```bash
# List deployments
kubectl get deployments

# Describe deployment
kubectl describe deployment <deployment-name>

# Scale deployment
kubectl scale deployment <deployment-name> --replicas=5

# Update image
kubectl set image deployment/<deployment-name> container-name=new-image:tag

# Rollout status
kubectl rollout status deployment/<deployment-name>

# Rollback deployment
kubectl rollout undo deployment/<deployment-name>

# Delete deployment
kubectl delete deployment <deployment-name>
```

### Working with Services
```bash
# List services
kubectl get services

# Describe service
kubectl describe service <service-name>

# Delete service
kubectl delete service <service-name>
```

### Applying YAML Files
```bash
# Apply configuration
kubectl apply -f <filename.yaml>

# Apply all YAML files in directory
kubectl apply -f ./k8s/

# Delete using YAML
kubectl delete -f <filename.yaml>
```

### Debugging
```bash
# View events
kubectl get events

# View pod logs
kubectl logs <pod-name>

# Stream logs
kubectl logs -f <pod-name>

# View logs from specific container in pod
kubectl logs <pod-name> -c <container-name>

# Port forwarding (for local testing)
kubectl port-forward pod/<pod-name> 8080:80
```

### ConfigMaps and Secrets
```bash
# Create ConfigMap from literal
kubectl create configmap app-config --from-literal=APP_ENV=production

# Create Secret from literal
kubectl create secret generic db-secret --from-literal=password=mypassword

# View ConfigMap
kubectl get configmap app-config -o yaml

# View Secret (base64 encoded)
kubectl get secret db-secret -o yaml
```

### Namespaces
```bash
# List resources in specific namespace
kubectl get pods -n dev

# Create resource in namespace
kubectl apply -f deployment.yaml -n dev

# Set default namespace
kubectl config set-context --current --namespace=dev
```

---

## 6. Kubernetes Best Practices

### Resource Management
-   **Always set resource requests and limits**:
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Health Checks
-   **Liveness Probe**: Checks if the container is alive.
-   **Readiness Probe**: Checks if the container is ready to accept traffic.

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
```

### Use Labels and Selectors
-   Organize and select resources efficiently.
```yaml
metadata:
  labels:
    app: spring-app
    environment: production
    version: v1
```
