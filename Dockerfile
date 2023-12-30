FROM oven/bun:latest
WORKDIR /usr/src/app

# Install nodejs using n
RUN apt-get -y update; apt-get -y install curl
ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

COPY bun.lockb package.json ./
RUN bun install
# You must ensure that schema.prisma is already in the directory
COPY . .
RUN bunx prisma generate

ENV NODE_ENV production
ENV PORT 8080
ENTRYPOINT [ "bun", "run", "dev" ]