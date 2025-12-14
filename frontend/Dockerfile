FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 5173

# Start command (Host 0.0.0.0 is needed for Docker)
CMD ["npm", "run", "dev", "--", "--host"]
