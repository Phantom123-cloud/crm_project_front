FROM node:22-alpine AS builder
WORKDIR /app

# зависимости
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# исходники
COPY . .

# билд фронта
RUN yarn build


FROM nginx:alpine

# билд в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
