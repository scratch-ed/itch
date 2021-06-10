FROM node:15.14.0-alpine3.13

ARG PORT
ARG NODE_ENV
ARG PUPPETEER_BROWSER_PATH
ARG JUDGE_SERVICE_NOTIFY_URL
ENV PORT $PORT
ENV NODE_ENV $NODE_ENV
ENV PUPPETEER_BROWSER_PATH $PUPPETEER_BROWSER_PATH
ENV JUDGE_SERVICE_NOTIFY_URL $JUDGE_SERVICE_NOTIFY_URL

RUN apk add chromium

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

RUN npm run build

RUN rm -f ./.env.example && rm -rf ./packages/api/.env && rm -rf ./packages/api/.env.example 

ENTRYPOINT ["npm", "run", "api"]