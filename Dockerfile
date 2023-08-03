# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container's working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application source code to the container's working directory
COPY . .

# Expose the port that your Node.js app will listen on
EXPOSE 3001

# Set the command to run your Node.js app when the container starts
CMD ["npm", "start"]

# docker build -t application-server .
# docker run -p 3001:3001 application-server
