# Stage 1: Base stage with Node.js Alpine image
FROM node:20-alpine AS builder

# Install libc6-compat for compatibility and globally install specific npm version
RUN apk add --no-cache libc6-compat && \
  npm install -g npm@10.9.3

# Set the working directory for subsequent instructions
WORKDIR /builder

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies) to build the app and generate Prisma client
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npm run db:generate

# Build the application
RUN npm run build

# Stage 2: Runner stage
FROM node:20-alpine AS runner

# Set the working directory in the container
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev --frozen-lockfile

# Copy the generated Prisma Client and schema from builder
COPY --from=builder /builder/prisma ./prisma
RUN npx --yes prisma generate

# Copy built artifacts from the builder stage
COPY --from=builder /builder/dist ./dist

# Inform Docker that the container is listening on port 8000 at runtime
EXPOSE 8000

# Define the command to run the app
CMD ["npm", "start"]