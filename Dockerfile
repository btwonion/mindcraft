# Build stage
FROM node:20-slim AS builder
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY patches ./patches

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libx11-dev \
    libxext-dev \
    libxrender-dev \
    libxtst-dev \
    libxi-dev \
    libgl1-mesa-dev \
    libglu1-mesa-dev \
    && npm ci \
    && apt-get clean

# Copy source code
COPY . .

# Production stage
FROM node:20-slim AS runtime
WORKDIR /usr/src/app

# Install only production dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/patches ./patches
COPY . .

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    libx11-6 \
    libxext6 \
    libxrender1 \
    libxtst6 \
    libxi6 \
    libgl1-mesa-glx \
    libglu1-mesa \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /root/.npm \
    && rm -rf /root/.cache

EXPOSE 8080 3000
CMD [ "npm", "start" ]