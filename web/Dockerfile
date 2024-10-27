# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

COPY .env .

# Use the build script to create the production build
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary build output
COPY --from=builder /app/dist ./build

EXPOSE 3000

CMD ["npx", "serve", "-s", "build"]
