# Use Node.js LTS
FROM node:20-slim as builder

WORKDIR /app

# Copy root workspace files first
COPY package.json .
COPY package-lock.json .

# Copy all workspace packages
COPY shared ./shared
COPY s1-frontend ./s1-frontend

# Install all dependencies
RUN npm install

# Build shared package first
RUN npm run build -w @test-fixtures/shared

# Build frontend
RUN npm run build -w @test-fixtures/s1-frontend

# Production image
FROM node:20-slim

WORKDIR /app

# Copy package files and built assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/s1-frontend/package.json ./s1-frontend/
COPY --from=builder /app/s1-frontend/dist ./s1-frontend/dist

# Install production dependencies only
RUN npm install --omit=dev

# Expose port
EXPOSE 3000

# Start service
CMD ["node", "s1-frontend/dist/server/index.js"]