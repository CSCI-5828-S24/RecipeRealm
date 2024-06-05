# Stage 2: Build Node.js backend
FROM node:14-alpine as node-build
WORKDIR /app
COPY nodeserver/package*.json ./
RUN npm install
COPY nodeserver .

WORKDIR /app

# Expose port 3002 for the Node.js backend
#EXPOSE 3002

# Start Node.js server
CMD ["node", "./nodeserver/server.js"]