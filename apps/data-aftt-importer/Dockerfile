# Base image
ARG NODE_VERSION=20.19.2-slim
ARG APP_NAME=data-aftt-importer

FROM node:${NODE_VERSION} as builder

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN apt-get update && apt-get install -y openssl && npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build use APP_NAME to specify the app name
RUN npm run prisma:generate && npm run build:data-aftt-importer

FROM node:${NODE_VERSION} as production

# Create app directory
WORKDIR /usr/src/app

# Copy the "dist" folder from the previous stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the prisma client
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/prisma ./prisma
# Copy the package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN apt-get update && apt-get install -y openssl && npm i -g prisma && npm install --only=production --legacy-peer-deps

CMD ["sh", "-c", "npm run start:prod:data-aftt-importer"]
