# Use Node.js 18 Alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for production
RUN apk add --no-cache dumb-init

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with production optimizations
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (Render uses PORT environment variable)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
