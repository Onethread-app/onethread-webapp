# Use leightweight linux distrubution
# Choose alpine because it's size only 5MB 
FROM mhart/alpine-node:latest 

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v10.22.0

ENV NODE_ENV=local
ENV PORT=4044
ENV JWT_ACCESS_TOKEN=iamdeveloper
ENV JWT_REFRESH_TOKEN=iamdevelopertoo
ENV JWT_EXPIRATION=60m
ENV JWT_REFRESH_EXPIRATION=5h
ENV EMAIL_ADDRESS=tigrowtecheven@gmail.com
ENV EMAIL_PASSWORD=techtigrow0605##

# Pusher Configuration
ENV PUSHER_CHANNEL_APP_ID=976471
ENV PUSHER_CHANNEL_KEY=7e706af4c123d518ccb5
ENV PUSHER_CHANNEL_SECRET=14a1635ad7608a2fdc41
ENV PUSHER_CHANNEL_CLUSTER=ap1

# ENV ELASTIC_SEARCH_ADDRESS=http://localhost:9200/
# AWS configuration
ENV BUCKET_NAME=tigrow-file
ENV AWS_ACCESS_KEY=AKIAQLNXACVPCZ2YUF3L 
ENV AWS_SECRET_ACCESS_KEY=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
ENV S3_REGION=ap-southeast-1
ENV AWS_UPLOADED_FILE_URL_LINK=https://tigrow.s3-ap-southeast-1.amazonaws.com/

# RUN apk add nodejs=10.22-alpine3.11
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm rebuild bcrypt --build-from-source
RUN npm cache verify


# Add Maintainer info
LABEL maintainer="tigrowtecheven@gmail.com"

# avoid container running as 'root'
RUN addgroup -S tigrow && adduser -S -G tigrow tigrow

# set /app directory as default working directory
WORKDIR /app

# taking advantages of docker layer cache system
ADD package.json /app/package.json

# install all desired packages
RUN npm rebuild bcrypt --update-binary
RUN npm install

#for production
# RUN npm ci --only=production

# copy all file from current dir to /app in container
COPY . /app

# expose port 4044
EXPOSE 4044

# cmd to start service
CMD [ "npm", "start" ]
