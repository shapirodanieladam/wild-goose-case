# Use Node.js LTS
FROM node:20-slim

WORKDIR /app

# Copy root workspace files first
COPY package.json .
COPY package-lock.json .

# Copy all workspace packages
COPY shared ./shared
COPY s1-frontend ./s1-frontend

# Install dependencies
RUN npm install

# Build shared package
RUN npm run build -w @test-fixtures/shared

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOST=0.0.0.0

# Start the development server
WORKDIR /app/s1-frontend
CMD ["npm", "run", "dev"]