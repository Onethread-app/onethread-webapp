# Use leightweight linux distrubution
# Choose alpine because it's size only 5MB 
FROM alpine:3.22.0

ENV NVM_DIR /usr/local/nvm
ENV NODE_ENV=local
ENV PORT=4044
ENV JWT_ACCESS_TOKEN=iamdeveloper
ENV JWT_REFRESH_TOKEN=iamdevelopertoo
ENV JWT_EXPIRATION=60m
ENV JWT_REFRESH_EXPIRATION=5h
ENV EMAIL_ADDRESS=tigrowtecheven@gmail.com
ENV EMAIL_PASSWORD=techtigrow0605##
ENV INSTANCE_LOCATOR=v1:us1:974a7dac-df42-45e6-90ae-d95d1afd7968
ENV PUSHER_KEY=de094b23-51d1-45f7-83fd-2b318e953229:rj9fDegQ20Iy+DCgC88w+D4ciKOMheheziZgP2GAAc4=
ENV AWS_ACCESS_KEY=AKIAQLNXACVPCZ2YUF3L 
ENV AWS_SECRET_ACCESS_KEY=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
ENV S3_REGION=ap-southeast-1
ENV AWS_UPLOADED_FILE_URL_LINK=https://tigrow.s3-ap-southeast-1.amazonaws.com/
# ENV ELASTIC_SEARCH_ADDRESS=http://localhost:9200/
ENV BUCKET_NAME=tigrow-file

# RUN apk add nodejs=12.14.0-r0
RUN apk add --no-cache --virtual .gyp python make g++ 
RUN apk add --update nodejs
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
RUN npm install

#for production
# RUN npm ci --only=production

# copy all file from current dir to /app in container
COPY . /app

# expose port 4044
EXPOSE 4044

# cmd to start service
CMD [ "npm", "start" ]
