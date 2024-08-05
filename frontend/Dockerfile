# Frontend Dockerfile
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY frontend .

# Build the application
RUN npm run build

# Serve the build output with a static server
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
