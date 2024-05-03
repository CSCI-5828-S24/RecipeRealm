# Use official Node.js 14 image as base
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 (or the port your Node.js application listens on)
EXPOSE 8080

# Command to run your Node.js application
CMD ["node", "server.js"]