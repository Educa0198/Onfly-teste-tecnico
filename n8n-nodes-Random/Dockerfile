FROM node:22 AS builder



# Set working directory
WORKDIR /workspace

# Copy package.json and lock file
COPY package.json package-lock.json tsconfig.json ./

# COPY jest config
COPY jest.config.js ./

# Install dependencies
RUN npm install

# Copy source code
COPY nodes ./nodes

#Run test before starting
RUN npm test

# Build TypeScript
RUN npm run build

