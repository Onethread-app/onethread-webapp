# Use leightweight linux distrubution
# Choose alpine because it's size only 5MB 
FROM mhart/alpine-node:11 AS builder

ENV PATH /app/node_modules/.bin:$PATH
ENV REACT_APP_PUSHER_INSTANCE_LOCATOR=v1:us1:974a7dac-df42-45e6-90ae-d95d1afd7968
ENV NVM_DIR /usr/local/nvm


# RUN apk add nodejs=12.14.0-r0
RUN apk add --no-cache --virtual .gyp python make g++ 
RUN apk add --update nodejs

RUN apk update
RUN apk add yarn
RUN npm cache verify

# Add Maintainer info
LABEL maintainer="tigrowtecheven@gmail.com"

# avoid container running as 'root'
RUN addgroup -S tigrow && adduser -S -G tigrow tigrow

# set /app directory as default working directory
WORKDIR /app

COPY package.json /app/package.json
#for production
# RUN npm ci --only=production

# copy all file from current dir to /app in container
COPY . /app
RUN yarn run build

# FROM nginx:1.16.0-alpine
# COPY --from=client /app/build /usr/share/nginx/html
EXPOSE 3000

CMD ["yarn", "start"]