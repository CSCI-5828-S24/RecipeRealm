# Stage 2: Build Node.js backend
FROM node:latest

COPY nodeserver/package.json /app/
COPY nodeserver/images /app/
COPY nodeserver/server.js /app/
COPY nodeserver/RecipeSchema.js /app/
COPY nodeserver/UserSchema.js /app/


WORKDIR /app

RUN npm install

# Expose port 3002 for the Node.js backend
#EXPOSE 3002

# Start Node.js server
CMD ["node", "server.js"]