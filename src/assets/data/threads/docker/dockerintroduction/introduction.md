## 1. What is Docker?

- **Definition:**  
  Docker is a platform that enables you to build, ship, and run applications in lightweight, isolated environments called containers. It abstracts the underlying infrastructure, allowing developers to focus on writing code without worrying about deployment environments.

- **Key Components:**  
  - **Docker Engine:** The runtime that builds and runs containers.
  - **Docker Images:** Read-only templates used to create containers. They include the application code, libraries, dependencies, and runtime.
  - **Docker Containers:** Executable instances of Docker images that run isolated processes.
  - **Docker Hub:** A public registry where you can find, share, and distribute container images.

---

## 2. What is Containerization?

- **Definition:**  
  Containerization is the process of encapsulating an application and its environment into a container. This includes the code, runtime, system tools, libraries, and settings needed to run the application.

- **Benefits of Containerization:**  
  - **Portability:**  
    Containers run consistently across development, testing, and production environments regardless of differences in underlying infrastructure.
  - **Isolation:**  
    Each container operates independently, reducing conflicts between applications and allowing better security and resource management.
  - **Scalability:**  
    Containers are lightweight and can be started, stopped, and scaled quickly to meet changing demand.
  - **Efficiency:**  
    They use system resources more efficiently than traditional virtual machines since they share the host OS kernel.

---

## 3. How Docker and Containerization Work Together

- **Building an Image:**  
  A Dockerfile is used to define the steps required to build a Docker image. This file specifies the base image, application code, dependencies, and runtime configurations.
  
  **Example Dockerfile:**
```typescript
  # Use an official Node.js runtime as a base image
  FROM node:14

  # Set the working directory inside the container
  WORKDIR /usr/src/app

  # Copy package.json and install dependencies
  COPY package*.json ./
  RUN npm install

  # Bundle the application code
  COPY . .

  # Expose the application port
  EXPOSE 3000

  # Define the command to run your app
  CMD ["node", "server.js"]
  ```

  **Running a Container:**
Once an image is built, you can run it as a container. Docker ensures the container runs in an isolated environment, with its own filesystem, networking, and process space.

Example Command:

```typescript
docker run -d -p 3000:3000 my-node-app
```
This command runs your container in detached mode (-d) and maps port 3000 of the container to port 3000 on the host machine.