FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client with the latest schema
RUN npx prisma generate

EXPOSE 5000

# Apply migrations and start server
CMD npx prisma migrate deploy && node index.js