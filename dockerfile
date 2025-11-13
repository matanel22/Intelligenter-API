# ----------------------------
# Stage 1: Build the app
# ----------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json tsconfig.json ./

# Install all dependencies (including dev for build)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript into dist/
RUN npm run build

# ----------------------------
# Stage 2: Run the app
# ----------------------------
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port (if your Express app uses 3000)
EXPOSE 3000

# Set environment variables (optional)
# ENV NODE_ENV=production

# Start the app
CMD ["node", "dist/app.js"]
