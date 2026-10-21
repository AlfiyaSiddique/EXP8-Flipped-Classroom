# Experiment 8 — Deploying Applications, CI/CD Pipeline, and Cluster Monitoring

This is a complete, free-to-run practical for the flipped classroom session. The **ClusterPilot** UI demonstrates all three required tasks and the repository contains the files needed to run the same workload in Docker and Minikube.

## What is included

| Requirement | Implementation |
|---|---|
| Task 1: workload deployment and scaling | [`k8s/deployment.yaml`](k8s/deployment.yaml) starts 5 replicas; the Workloads tab shows rollout state and provides the scale command |
| Task 2: Docker CI/CD | [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) builds, publishes, and validates on every push/PR |
| Task 3: monitoring | Monitoring tab shows CPU, memory, pod health, and restart metrics; Minikube commands below provide live cluster evidence |
| UI | [`index.html`](index.html), [`styles.css`](styles.css), and [`app.js`](app.js) |
| Container | [`Dockerfile`](Dockerfile) and [`nginx.conf`](nginx.conf) |

## 1. Run the UI locally

No package installation is required:

```powershell
start index.html
```

For a container-backed run:

```powershell
docker build -t clusterpilot-web:local .
docker run --rm -p 8080:80 clusterpilot-web:local
```

Open <http://localhost:8080>.

## 2. Deploy to Minikube

Install Docker Desktop, WSL2, `kubectl`, and Minikube before starting. Then:

```powershell
minikube start --driver=docker
docker build -t clusterpilot-web:local .
minikube image load clusterpilot-web:local
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl set image deployment/clusterpilot-web web=clusterpilot-web:local
kubectl rollout status deployment/clusterpilot-web
kubectl get deployment,pods,service -l app=clusterpilot-web
minikube service clusterpilot-web --url
```

The deployment manifest defaults to a Docker Hub image for CI/CD. The `kubectl set image` command overrides it with the local image for a no-registry Minikube run.

### Task 1 evidence

```powershell
kubectl scale deployment clusterpilot-web --replicas=5
kubectl get pods -l app=clusterpilot-web -o wide
kubectl describe deployment clusterpilot-web
```

## 3. Configure GitHub Actions and Docker Hub

1. Create a Docker Hub repository called `clusterpilot-web`.
2. In GitHub repository **Settings → Secrets and variables → Actions**, add:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN` (a Docker Hub access token, not your password)
3. Replace `DOCKERHUB_USERNAME` in [`k8s/deployment.yaml`](k8s/deployment.yaml) with your username.
4. Commit and push to `main`. The workflow builds the image, tags it with the commit SHA and `latest`, pushes it on a branch push, and validates the manifests.

For pull requests, Docker login and pushing are intentionally skipped; this avoids exposing secrets to untrusted PR code.

## 4. Monitoring evidence

For live Minikube metrics:

```powershell
minikube addons enable metrics-server
kubectl top nodes
kubectl top pods -l app=clusterpilot-web
minikube dashboard
```

Capture screenshots of the dashboard, `kubectl top` output, the five running pods, and the successful GitHub Actions run. Paste them into [`REPORT.md`](REPORT.md).

## Pre-lab diagnostic answers

1. **Deployment vs. Pod:** A Deployment declares the desired state and manages ReplicaSets and replacement Pods. A Pod is the smallest runnable unit and can contain one or more containers.
2. **Why use a secret for Docker Hub:** Tokens are credentials and must not be committed to source. GitHub Actions Secrets injects them only during the job.
3. **Why readiness and liveness probes:** Readiness controls whether a Pod receives traffic; liveness detects a stuck process and restarts it.

## Submission checklist

- [ ] GitHub repository URL added to [`REPORT.md`](REPORT.md)
- [ ] Deployment and Service YAML included
- [ ] Successful pipeline screenshot/log included
- [ ] Five-replica rollout screenshot included
- [ ] Monitoring/dashboard screenshot included
- [ ] `REPORT.md` exported to PDF
