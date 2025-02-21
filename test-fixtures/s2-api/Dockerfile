# Use Node.js LTS
FROM node:20-slim as builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/
COPY shared/src ./shared/src

# Copy service files
COPY s2-api/package*.json ./s2-api/
COPY s2-api/tsconfig.json ./s2-api/
COPY s2-api/src ./s2-api/src

# Install and build
RUN npm install -w shared && npm run build -w shared
RUN npm install -w s2-api && npm run build -w s2-api

# Production image
FROM node:20-slim

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/shared/package*.json ./shared/
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/s2-api/package*.json ./s2-api/
COPY --from=builder /app/s2-api/dist ./s2-api/dist

# Install production dependencies
RUN npm install --omit=dev

# Expose port
EXPOSE 8080

# Start service
CMD ["node", "s2-api/dist/index.js"]