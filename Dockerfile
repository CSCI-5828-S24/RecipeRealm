# Stage 1: Build React frontend
FROM node:14-alpine as react-build
WORKDIR /app
COPY my-form-app/package*.json ./
RUN npm install
COPY my-form-app .
RUN npm run build

# Stage 2: Build Node.js backend
FROM node:14-alpine as node-build
WORKDIR /app
COPY nodeserver/package*.json ./
RUN npm install
COPY nodeserver .
RUN npm run build

# Stage 3: Combine React frontend and Node.js backend
FROM node:14-alpine
WORKDIR /app

# Copy built React frontend
COPY --from=react-build /app/build ./my-form-app/build

# Copy built Node.js backend
COPY --from=node-build /app/build ./nodeserver/build

# Expose port 3002 for the Node.js backend
EXPOSE 3002

# Start Node.js server
CMD ["node", "./nodeserver/build/server.js"]
