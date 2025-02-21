# Use Node.js LTS
FROM node:20-slim as builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/
COPY shared/src ./shared/src

# Copy service files
COPY s3-data/package*.json ./s3-data/
COPY s3-data/tsconfig.json ./s3-data/
COPY s3-data/src ./s3-data/src

# Install and build
RUN npm install -w shared && npm run build -w shared
RUN npm install -w s3-data && npm run build -w s3-data

# Production image
FROM node:20-slim

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/shared/package*.json ./shared/
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/s3-data/package*.json ./s3-data/
COPY --from=builder /app/s3-data/dist ./s3-data/dist

# Install production dependencies
RUN npm install --omit=dev

# Expose port
EXPOSE 9090

# Start service
CMD ["node", "s3-data/dist/index.js"]