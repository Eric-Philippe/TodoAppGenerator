FROM node:18-alpine

WORKDIR /app

# Install OpenSSL 3.0 and other required libraries for Prisma
RUN apk add --no-cache openssl openssl-dev

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema first
COPY prisma ./prisma/

# Generate Prisma client with correct binary targets
RUN npx prisma generate

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
