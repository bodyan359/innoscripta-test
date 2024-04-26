# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/srv/app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Bundle app source inside Docker image
COPY . .

# Expose port 8000 to the outside once the container has launched
EXPOSE 8000

# Command to run
CMD ["yarn", "dev"]