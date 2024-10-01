FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY .env.template .env

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the app using the compiled JavaScript
CMD ["npm", "run", "dev"]
