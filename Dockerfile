FROM node:14-alpine as node-build
WORKDIR /app
COPY nodeserver/package*.json ./
RUN npm install
COPY nodeserver .
RUN npm run build


FROM node:14-alpine
WORKDIR /app


# Copy built Node.js backend
COPY --from=node-build /app/build ./nodeserver/build

# Expose port 3002 for the Node.js backend
EXPOSE 8080

# Start Node.js server
CMD ["node", "./nodeserver/build/server.js"]
