# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies (separate layer for caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Next.js app
# Note: BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL should be available in .env
RUN npm run build

# Start the application
# We use a custom start script to handle both web and workers if needed
# or we run them as separate containers in compose
CMD ["npm", "start"]
