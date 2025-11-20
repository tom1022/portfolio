# Development container for VS Code Remote - Containers
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-18

# Use /workspace as working directory (matches devcontainer.json)
WORKDIR /workspace

# Copy package manifests and install dependencies to leverage cache
COPY package*.json ./
RUN npm ci

# Copy the rest of the repository
COPY . ./

# Ensure workspace files are owned by the non-root 'node' user so postCreateCommand
# (which runs as a non-root user) can write into the directory without EACCES.
RUN chown -R node:node /workspace

# Expose Next.js default dev port
EXPOSE 3000

# Default command is handled by devcontainer; keep image ready for "npm run dev"
