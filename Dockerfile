# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16-alpine

# Create and change to the app directory.
WORKDIR /app

# to the app directory
COPY package*.json ./

# Update npm to the latest version
RUN npm install -g npm@latest

# Change to non-root user
USER node

# Copy the desired files from your project to the current directory in the container
COPY --chown=node:node . .

# Install dependencies
RUN npm install
# Run the web service on container startup.
CMD [ "npm", "run", "dev" ]