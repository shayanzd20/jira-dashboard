# FROM node:22.9.0-slim
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./server/package*.json ./

COPY ./server/.env.template ./.env

# Install app dependencies
RUN npm install

# Bundle app source
COPY ./server .

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["npm", "run", "dev"]