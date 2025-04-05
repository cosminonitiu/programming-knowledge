## 1. Docker Client and Docker Daemon

### Docker Client
- **Role:**  
  The primary interface for users to interact with Docker.
- **Functionality:**  
  - Sends commands (e.g., build, run, stop) to the Docker daemon.
  - Can be a command-line interface (`docker` CLI) or a graphical interface.

### Docker Daemon
- **Role:**  
  The core engine of Docker that manages containers, images, networks, and storage.
- **Functionality:**  
  - Listens for Docker API requests from the client.
  - Manages container lifecycle (creation, starting, stopping, and deletion).
  - Communicates with other daemons to manage Docker services and clusters (e.g., Docker Swarm).

---

## 2. Docker Objects

### Images
- **Definition:**  
  Read-only templates that contain the instructions for creating containers.
- **Key Points:**  
  - Built from a Dockerfile.
  - Can be shared and versioned.
  - Serve as the blueprint for container creation.

### Containers
- **Definition:**  
  Running instances of Docker images that encapsulate an application and its environment.
- **Key Points:**  
  - Isolated from the host system and other containers.
  - Lightweight and fast to start.
  - Can be started, stopped, moved, and deleted independently.

### Volumes
- **Definition:**  
  Persistent storage used by containers to store data outside the container’s writable layer.
- **Key Points:**  
  - Volumes are managed by Docker and can be shared between containers.
  - They provide data persistence, even if the container is removed.

### Networks
- **Definition:**  
  Virtual networks that enable communication between Docker containers and with external systems.
- **Key Points:**  
  - Docker provides several networking modes (bridge, host, overlay, and none).
  - Custom networks can be created to isolate container communications.

---

## 3. Docker Registries

### Public and Private Registries
- **Docker Hub:**  
  The most widely used public registry for Docker images.
- **Private Registries:**  
  Organizations can set up private registries for proprietary images.
- **Functionality:**  
  - Store and distribute Docker images.
  - Support versioning and access controls.

---

## 4. Docker Architecture in Action

### Workflow Example:
1. **Develop:**  
   Write your application code and create a Dockerfile that specifies the base image and steps to install dependencies.
2. **Build:**  
   Use the Docker CLI to build an image from your Dockerfile.
```typescript
   docker build -t my-app:latest .
```

Run:
Create and run a container from your image.

```typescript
docker run -d -p 80:80 my-app:latest 
```
Store:
Push the image to a registry for sharing and deployment.

```typescript
docker push my-app:latest 
```