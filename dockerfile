# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install application dependencies
RUN npm install --legacy-peer-deps && npm run build && npx prisma generate


# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your application

CMD ["npm", "run", "start:migrate:prod"]
