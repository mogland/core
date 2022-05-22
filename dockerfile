FROM node:16-alpine as builder
WORKDIR /app
COPY . .
# Install dependencies
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm bundle

# Build the app
FROM node:16-alpine
RUN apk add bash --no-cache
WORKDIR /app
COPY --from=builder /app/out .
ENV TZ=Asia/Shanghai
EXPOSE 3000

# Run the app
CMD echo "NextSpace Sever Image." && sh
