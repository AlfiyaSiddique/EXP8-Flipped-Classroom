# Experiment 8 Report

**Title:** Deploying Applications, CI/CD Pipeline, and Cluster Monitoring  
**Student name:** Alfiya Siddique  
**Roll number:** D17 B 68 
**Date:** _Enter date_  
**GitHub repository:** _Paste public repository URL_

## Aim

To deploy a containerized web application on a Kubernetes cluster, scale the application to five replicas, automate Docker image delivery using a GitHub Actions CI/CD pipeline, and monitor cluster and pod health using Kubernetes metrics and a dashboard.

## Theory

### 1. Containerization and Docker

Containerization packages an application and its dependencies into a lightweight, portable unit called a container. Docker uses a `Dockerfile` to create an image. In this experiment, the web application is packaged with Nginx using the `Dockerfile`, and the resulting image can run consistently on a local computer, Docker Desktop, or a Kubernetes cluster.

### 2. Kubernetes Deployment

Kubernetes is a container orchestration platform that automates the deployment, scaling, networking, and recovery of containerized applications. A **Pod** is the smallest deployable Kubernetes unit and contains one or more containers. A **Deployment** describes the desired state of an application and creates and manages Pods through a ReplicaSet.

The Deployment in this experiment uses the label `app: clusterpilot-web` and specifies five replicas. Kubernetes continuously compares the desired state with the actual state. If a Pod fails, Kubernetes creates a replacement automatically. The application is exposed through a **Service**, which provides a stable network endpoint and distributes traffic to Pods selected by the application label.

### 3. Scaling and Probes

Scaling changes the number of running Pod replicas to meet availability or traffic requirements. The command `kubectl scale deployment clusterpilot-web --replicas=5` changes the desired replica count to five.

A **readiness probe** checks whether a Pod is ready to receive traffic. A **liveness probe** checks whether the application is still functioning; Kubernetes restarts the container when the liveness check repeatedly fails. These probes improve reliability during startup and failure recovery.

### 4. CI/CD with GitHub Actions

Continuous Integration (CI) automatically builds and validates application changes whenever code is pushed or a pull request is created. Continuous Delivery or Deployment (CD) automates the packaging and release of a validated application.

The GitHub Actions workflow in this experiment checks out the source code, sets up Docker Buildx, builds the Docker image, pushes the image to Docker Hub for a `main` branch push, and validates the Kubernetes manifests. Docker Hub credentials are stored as GitHub encrypted secrets rather than in the source code. The image is tagged with both the commit SHA and `latest`, which supports traceability and convenient deployment.

### 5. Monitoring and Observability

Monitoring collects information about the health and resource usage of an application and its infrastructure. The Kubernetes Metrics Server provides CPU and memory usage for nodes and Pods. The commands `kubectl top nodes` and `kubectl top pods` display these measurements. The Minikube Dashboard provides a visual view of deployments, Pods, services, and resource usage.

In this experiment, monitoring is used to confirm that all five Pods are running, check CPU and memory consumption, and verify that there are no unexpected restarts. The ClusterPilot UI presents the same operational concepts in a single monitoring view.

## Objective

To deploy a containerized web application on Kubernetes, scale it to five replicas, automate image delivery with GitHub Actions, and observe cluster health and pod metrics.

## Environment

| Item | Value |
|---|---|
| Operating system | _Windows / macOS / Linux_ |
| Container runtime | _Docker Desktop version_ |
| Kubernetes | _Minikube version_ |
| kubectl | _Version_ |
| Docker Hub image | _Paste image URL_ |

## Implementation and Screenshots

The following screenshots should be inserted in this section in the order shown below. Each screenshot should have a figure number and caption.

### Screenshot 1 — Application UI overview

Capture the ClusterPilot landing page showing the **Deploy. Automate. Observe.** heading, the Minikube cluster status, and the three task tabs.

**Suggested caption:** *Figure 1: ClusterPilot user interface for Experiment 8.*

### Screenshot 2 — Docker image and container

Capture the terminal after running the Docker build and container commands. The screenshot should show the successful image build and the application opened at `http://localhost:8080`.

**Suggested commands:**

```text
docker build -t clusterpilot-web:local .
docker run --rm -p 8080:80 clusterpilot-web:local
```

**Suggested caption:** *Figure 2: Building and running the application container with Docker.*

### Screenshot 3 — Kubernetes deployment applied

Capture the terminal showing the Deployment and Service being created successfully.

```text
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl rollout status deployment/clusterpilot-web
```

**Suggested caption:** *Figure 3: Applying Kubernetes Deployment and Service manifests.*

### Screenshot 4 — Five replicas running

Capture either the **Workloads** tab after setting Desired replicas to 5, or the terminal output from:

```text
kubectl scale deployment clusterpilot-web --replicas=5
kubectl get pods -l app=clusterpilot-web
```

The screenshot must clearly show five Pods in `Running` and `Ready` state.

**Suggested caption:** *Figure 4: Scaling clusterpilot-web to five healthy replicas.*

### Screenshot 5 — Kubernetes service access

Capture the browser displaying the application through the Minikube Service URL, together with the command used to obtain the URL:

```text
minikube service clusterpilot-web --url
```

**Suggested caption:** *Figure 5: Accessing the deployed application through a Kubernetes Service.*

### Screenshot 6 — GitHub Actions workflow

Capture the GitHub Actions run page showing the workflow name, commit, and every step completed successfully: Checkout source, Set up Docker Buildx, Log in to Docker Hub, Build and publish image, and Validate Kubernetes manifests.

**Suggested caption:** *Figure 6: Successful GitHub Actions CI/CD pipeline execution.*

### Screenshot 7 — Docker Hub image

Capture the Docker Hub repository page showing the `clusterpilot-web` image and its tags, preferably the commit SHA tag and `latest`.

**Suggested caption:** *Figure 7: Docker image published to Docker Hub by the CI/CD pipeline.*

### Screenshot 8 — Monitoring metrics

Capture the **Monitoring** tab showing the CPU utilization chart, cluster overview, memory usage, running Pods, and workload metrics table.

**Suggested caption:** *Figure 8: ClusterPilot monitoring view showing cluster and Pod health.*

### Screenshot 9 — Kubernetes metrics and dashboard

Capture the terminal output for the following commands and, if available, a second screenshot of the Minikube Dashboard:

```text
minikube addons enable metrics-server
kubectl top nodes
kubectl top pods -l app=clusterpilot-web
minikube dashboard
```

**Suggested caption:** *Figure 9: Kubernetes CPU and memory metrics with Minikube Dashboard monitoring.*

## Task 1 — Deployment and scaling

**Commands executed**

```text
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl scale deployment clusterpilot-web --replicas=5
kubectl rollout status deployment/clusterpilot-web
kubectl get pods -l app=clusterpilot-web
```

**Result:** _Explain that five Pods reached Running/Ready state._

**Screenshot:**  
_Insert screenshot of the UI Workloads tab and/or `kubectl get pods` showing five replicas._

## Task 2 — CI/CD pipeline

**Workflow:** [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)

The pipeline checks out source, builds the Docker image with Buildx, pushes commit and `latest` tags to Docker Hub on a `main` push, and validates the Kubernetes manifests. Pull requests build without pushing.

**Successful run URL:** _Paste GitHub Actions run URL_

**Screenshot:**  
_Insert screenshot showing all workflow steps passed._

## Task 3 — Cluster monitoring

**Commands executed**

```text
minikube addons enable metrics-server
kubectl top nodes
kubectl top pods -l app=clusterpilot-web
minikube dashboard
```

**Observations**

- CPU utilization: _value_
- Memory utilization: _value_
- Running Pods: _value_
- Pod restarts: _value_

**Screenshot:**  
_Insert screenshot of Minikube Dashboard or the ClusterPilot Monitoring tab plus `kubectl top` output._

## Learning outcome

This experiment demonstrated the relationship between declarative Kubernetes configuration, automated container delivery, and operational visibility. Readiness/liveness probes protect traffic flow, replica scaling improves availability, and metrics help identify resource pressure.

## Conclusion

_Write 3–5 sentences describing the completed deployment, successful pipeline, and monitoring result._
