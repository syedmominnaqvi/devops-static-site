# Multi-stage build for Node.js backend

# Stage 1: Dependencies
FROM node:18-alpine AS deps

# Set working directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install production dependencies
# Using npm install instead of npm ci since we don't have a package-lock.json
RUN npm install --only=production

# Stage 2: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Stage 3: Production
FROM node:18-alpine AS runner

# Create app directory
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/config ./config
COPY --from=builder /app/models ./models
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/server.js ./
COPY --from=builder /app/.env* ./

# Expose the port the app will run on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]