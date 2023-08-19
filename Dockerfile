# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16-alpine

# Create and change to the app directory.
WORKDIR /app

# to the app directory
COPY package*.json ./


# Run the web service on container startup.
CMD [ "npm", "run", "dev" ]