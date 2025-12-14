FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose port (Optional documentation, Railway ignores this but good for local)
EXPOSE 3000

# Start command using shell form to allow $PORT expansion
# Railway provides PORT env var. 'serve' listens on port 3000 by default but we can specify it.
CMD npx serve -s dist -l $PORT
