# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16-alpine

# Create and change to the app directory.
WORKDIR /app

# Create a user to run the application
RUN adduser -D appuser

# Copy package.json and package-lock.json or yarn.lock (if available)
# to the app directory
COPY package*.json ./

# Install production dependencies.
RUN npm cache clean --force && npm ci && chown -R appuser:appuser /app && chmod -R 755 /app

# Copy local code to the container image.
COPY --chown=appuser:appuser . .

# Change to non-root user
USER appuser

# Run the web service on container startup.
CMD [ "npm", "run", "dev" ]