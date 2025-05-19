# Dockerfile

# ---- Base Stage ----
# Use an official Node.js runtime as a parent image.
# Alpine Linux is used for its small size. Choose a specific LTS version.
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Optional: Install OS-level dependencies if your Node.js app needs them
# (e.g., python3, make, g++ for some native addons, or utilities like 'dumb-init').
# RUN apk add --no-cache python3 make g++ dumb-init


# ---- Development Stage ----
# This stage is targeted when NODE_ENV is 'development'.
# The 'command' in docker-compose.yml for development handles 'npm install' and 'npm run dev'.
# Code will be mounted as a volume from your host.
FROM base AS development
ENV NODE_ENV=development

# Copy package.json and package-lock.json (or yarn.lock)
# These are needed for the 'npm install' command run by docker-compose.
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the default command for this stage.
# This will be overridden by the 'command' in docker-compose.yml for development,
# but it's good practice for clarity if the stage is run standalone.
# Assumes 'npm run dev' starts your development server (e.g., with nodemon).
CMD ["npm", "run", "dev"]


# ---- Production Dependencies Stage ----
# This stage installs *only* production dependencies.
# Using 'npm ci' is recommended for faster, more reliable builds from package-lock.json.
FROM base AS prod-deps
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --production --no-audit --progress=false


# ---- Production Stage ----
# This stage builds the final, lean image for production.
FROM base AS production
ENV NODE_ENV=production

# Create a non-root user and group for security.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production dependencies from the 'prod-deps' stage.
COPY --from=prod-deps --chown=appuser:appgroup /usr/src/app/node_modules ./node_modules

# Copy the rest of your application code into the image.
# Ensure you have a .dockerignore file to exclude unnecessary files (like .git, host node_modules, .env).
COPY --chown=appuser:appgroup . .

# Switch to the non-root user.
USER appuser

# Expose the application port defined by APP_PORT (or default to 3000).
# This is informational; docker-compose handles the actual port mapping.
ARG APP_PORT=3000
ENV PORT=${APP_PORT}
EXPOSE ${PORT}

# Default command to run the application in production.
# This should align with the 'start:prod' script in your package.json.
# This will be effectively used by the 'npm run start:prod' part of the
# 'command' in your docker-compose.yml for the production environment.
# Optional: Use 'dumb-init' as an entrypoint if you installed it, for better signal handling.
# ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "start:prod"]