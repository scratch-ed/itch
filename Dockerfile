FROM mhart/alpine-node:15

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

ARG PORT
ENV PORT=$PORT
ENV PUPPETEER_BROWSER_PATH /usr/bin/chromium-browser

COPY . ./app

WORKDIR /app

RUN rm -f ./.env.example && rm -rf ./packages/api/.env && rm -rf ./packages/api/.env.example 

RUN npm install

ENTRYPOINT ["npm", "run", "api"]