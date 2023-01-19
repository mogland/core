FROM node:16-alpine as builder

WORKDIR /app

COPY . .
RUN apk add make g++ alpine-sdk python3 py3-pip && \
    npm i -g pnpm && \
    pnpm install && \
    pnpm build && \
    pnpm bundle


FROM node:16-alpine as runner

RUN apk add zip unzip mongodb-tools rsync

WORKDIR /app

COPY --from=builder /app/out .

ENV TZ=Asia/Shanghai

EXPOSE 2330

CMD echo "Mog Core Image." && sh