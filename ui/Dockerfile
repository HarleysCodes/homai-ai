FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy source
COPY src ./src
COPY public ./public

# Build
RUN npm run build

# Production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
