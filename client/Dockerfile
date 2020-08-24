FROM node:13.12.0

ENV PATH /app/node_modules/.bin:$PATH
ENV BIND_HOST=0.0.0.0

# Dev Environment Configuration
ENV REACT_APP_PUSHER_CHANNEL_KEY_DEV=2d2483157c37a8782f19
ENV REACT_APP_PUSHER_CHANNEL_CLUSTER_DEV=ap2
ENV REACT_APP_PUSHER_CHANNEL_KEY=2d2483157c37a8782f19
ENV REACT_APP_PUSHER_CHANNEL_CLUSTER=ap2
ENV PUBLIC_URL=https://stage.tigrow.co/
ENV SKIP_PREFLIGHT_CHECK=true
ENV NOTIFICATION_PUSHER_CHANNEL_CLUSTER=ap2
ENV NOTIFICATION_PUSHER_CHANNEL_KEY=2d2483157c37a8782f19
ENV REACT_APP_STRIPE_PUBLIC_KEY=pk_test_51GuveEJN3n5bhvDVvKqwqOQRlwgIDLAnXFA8Olt69qmWjMb54QgOqKueCta8G0WEyPcTEFOi8mjYdTztSTX42zOV00QuzTN6di
ENV REACT_APP_API_URL=http://172.17.0.2:4044/api/v1/
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
# COPY --from=client ./build /usr/share/nginx/html
EXPOSE 4000

CMD ["yarn", "start"]