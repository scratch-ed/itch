FROM mhart/alpine-node:15

ARG PORT
ENV PORT $PORT
ENV PUPPETEER_BROWSER_PATH=/usr/bin/chromium-browser

RUN \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && apk --no-cache  update \
  && apk --no-cache  upgrade \
  && apk add --no-cache --virtual .build-deps \
    gifsicle pngquant optipng libjpeg-turbo-utils \
    udev ttf-opensans chromium \
  && rm -rf /var/cache/apk/* /tmp/*

# For caching purposes first copy all package.json files
COPY ./package*.json  /app/
COPY packages/api/package.json /app/packages/api/
COPY packages/core/package.json /app/packages/core/
COPY packages/runner/package.json /app/packages/runner/
COPY packages/test-utils/package.json /app/packages/test-utils/

RUN cd /app && npm install 

# Copy the rest of the app
COPY . ./app

WORKDIR /app

RUN rm -f ./.env.example && rm -rf ./packages/api/.env && rm -rf ./packages/api/.env.example 

ENTRYPOINT ["npm", "run", "api"]