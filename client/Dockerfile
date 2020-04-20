FROM node:13.12.0

ENV PATH /app/node_modules/.bin:$PATH
ENV BIND_HOST=0.0.0.0

# Pusher Configuration
ENV REACT_APP_PUSHER_CHANNEL_KEY=7e706af4c123d518ccb5
ENV REACT_APP_PUSHER_CHANNEL_CLUSTER=ap1
ENV NVM_DIR /usr/local/nvm

# Add Maintainer info
LABEL maintainer="tigrowtecheven@gmail.com"

# # avoid container running as 'root'
# RUN addgroup tigrow && adduser tigrowdev tigrow

# set /app directory as default working directory
WORKDIR /app

COPY package.json /app/package.json
#for production
# RUN npm ci --only=production

# copy all file from current dir to /app in container
COPY . /app
RUN yarn install

# FROM nginx:1.16.0-alpine
# COPY --from=client /app/build /usr/share/nginx/html
EXPOSE 3000

CMD ["yarn", "start"]