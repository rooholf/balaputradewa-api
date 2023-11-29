FROM debian:11.6-slim as builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash

COPY package.json .
COPY bun.lockb .

COPY prisma .

RUN /root/.bun/bin/bun install --production 
RUN /root/.bun/bin/bun run prisma migrate deploy


# ? -------------------------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /root/.bun/bin/bun bun
COPY --from=builder /app/node_modules node_modules


COPY src src
COPY tsconfig.json .
COPY prisma prisma
# COPY public public



ENV NODE_ENV production
CMD ["./bun", "src/index.ts"]

EXPOSE 3000