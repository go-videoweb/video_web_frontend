FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN npm install -g pnpm@11.25.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:stable-alpine
ENV API_UPSTREAM=vw-gateway:8001
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf.template /opt/videoweb/nginx.conf.template
COPY deploy/start-web.sh /opt/videoweb/start-web.sh
USER 101:101
EXPOSE 8080
ENTRYPOINT ["/bin/sh", "/opt/videoweb/start-web.sh"]
