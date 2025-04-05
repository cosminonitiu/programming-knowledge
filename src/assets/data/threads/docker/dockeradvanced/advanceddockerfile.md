## 1. Multi-Stage Builds

### What Are Multi-Stage Builds?
- **Concept:**  
  Multi-stage builds allow you to use multiple `FROM` statements in your Dockerfile. This enables you to separate the build environment from the runtime environment, ensuring that only the necessary artifacts are included in the final image.
  
### Benefits:
- **Smaller Final Image:**  
  Excludes build tools and unnecessary dependencies.
- **Simpler Maintenance:**  
  Keeps the runtime environment lean and secure.

### Example:
```dockerfile
# Stage 1: Build
FROM node:14 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:14-slim
WORKDIR /app
# Copy only the build artifacts from the builder stage
COPY --from=builder /app/dist ./dist
# Install only production dependencies if necessary
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**2. Leveraging Build Cache and Layer Optimization
Optimize Layer Caching:**
**Order of Instructions:**
Place commands that change infrequently (like installing dependencies) before commands that change frequently (like copying application code). This allows Docker to cache layers effectively.

**Combine RUN Commands:**
Combine multiple commands into a single RUN statement using shell operators (e.g., &&) to minimize the number of layers created.

Example:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
# Install dependencies first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && rm requirements.txt
# Copy application code after dependencies are installed
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]
```

**3. Minimizing Image Size
Strategies to Reduce Size:
Use Minimal Base Images:**
Opt for slim or Alpine-based images when possible (e.g., node:14-alpine or python:3.9-alpine).

**Remove Unnecessary Files:**
Delete temporary files, package caches, or build artifacts that are not needed in the final image.

**Multi-Stage Builds:**
As discussed, separate the build and runtime stages to strip away build-time dependencies.

Example:
```dockerfile
FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN npm run build

FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

**4. Security Best Practices
Secure Your Dockerfile:
Avoid Sensitive Data:**
Do not hardcode secrets or credentials. Use environment variables and secret management tools.

**Run as a Non-Root User:**
Create and switch to a non-root user within your Dockerfile to reduce security risks.

Example:
```dockerfile
FROM node:14-alpine
WORKDIR /app
# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --chown=appuser:appgroup . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**5. Advanced Dockerfile Directives**
ARG vs. ENV
ARG:
Define build-time variables that are only available during the build process.

ENV:
Set environment variables that persist in the final image and are available at runtime.

Example:
```dockerfile
FROM python:3.9-slim
ARG APP_VERSION=1.0.0
ENV APP_VERSION=${APP_VERSION}
WORKDIR /app
COPY . .
RUN echo "Building version ${APP_VERSION}"
CMD ["python", "app.py"]
```

**Utilizing LABELS for Metadata**
Purpose:
Use the LABEL directive to add metadata to your image. This can include version information, maintainer contact, and other details useful for documentation and automation.

Example:
```dockerfile
FROM ubuntu:20.04
LABEL maintainer="your.email@example.com"
LABEL version="1.0"
LABEL description="A sample Docker image for demonstrating advanced Dockerfile techniques."
RUN apt-get update && apt-get install -y curl
CMD ["curl", "--version"]
```