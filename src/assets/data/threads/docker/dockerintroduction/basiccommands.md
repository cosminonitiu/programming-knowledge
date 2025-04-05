## 1. Docker Information and Setup

- **`docker version`**  
  Displays the Docker version information for both the client and server (daemon).

- **`docker info`**  
  Provides detailed information about the Docker installation, including the number of containers, images, storage driver, and system resources.

---

## 2. Working with Images

- **`docker pull <image-name>`**  
  Downloads an image from a Docker registry (like Docker Hub) to your local machine.
  ```bash
  docker pull ubuntu
  ```

docker images
Lists all Docker images stored on your local system.

docker rmi <image-id|image-name>
Removes one or more images from your local system.

```bash
docker rmi ubuntu
```

**3. Managing Containers**
docker run [OPTIONS] <image-name> [COMMAND]
Creates and starts a container from a specified image. Common options include:

-d: Run container in detached mode.

-p: Map ports from the container to the host.

--name: Assign a custom name to the container.

```bash
docker run -d -p 80:80 --name mywebserver nginx
docker ps
```
Lists running containers.

docker ps -a: Lists all containers (running and stopped).

docker stop <container-id|container-name>
Stops a running container.

```bash
docker stop mywebserver
```

docker start <container-id|container-name>
Starts a stopped container.

```bash
docker start mywebserver
docker restart <container-id|container-name>
```
Stops and then starts a container.

```docker rm <container-id|container-name>
```
Removes one or more containers. Use -f to force removal.

```bash
docker rm mywebserver
docker logs <container-id|container-name>
```
Displays the logs of a container, useful for debugging.

```bash
docker logs mywebserver
docker exec -it <container-id|container-name> <command>
```
Runs a command in a running container. The -it flag provides an interactive terminal.

```bash
docker exec -it mywebserver bash
```

**4. Building Docker Images**
docker build -t <tag> <path>
Builds a Docker image from a Dockerfile. The -t flag tags the image with a name.

```bash
docker build -t my-app:latest .
docker inspect <container-id|image-name>
```
Returns detailed information about a container or image in JSON format.

**5. Docker Compose**
docker-compose up
Starts and runs multi-container applications defined in a docker-compose.yml file.

docker-compose down
Stops and removes containers, networks, and volumes created by docker-compose up.