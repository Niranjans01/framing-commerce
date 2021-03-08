# Use the official image as a parent image.
FROM node:current-slim
ARG flavor

# Set the working directory.
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY src/ ./src
COPY public/ ./public
COPY next.config.js .
COPY .env.${flavor} .env.local

RUN yarn install --pure-lockfile
RUN yarn build

EXPOSE 80

# Run the specified command within the container.
CMD [ "yarn", "start" ]