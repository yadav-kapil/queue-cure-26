FROM node:20-alpine

WORKDIR /app

# Copy package config files
COPY package*.json ./

# Install only production dependencies (excludes devDependencies like nodemon)
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

EXPOSE 3003

# Start the server
CMD ["node", "server.js"]
