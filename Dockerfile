# watsonx-demo-app/Dockerfile
FROM node:20-slim

# create app directory
WORKDIR /app

# copy package first to leverage layer cache
COPY package.json ./

# install only production dependencies
RUN npm install --production

# copy application source
COPY app.js ./

# runtime port
EXPOSE 8080

# runtime user (non-root)
RUN addgroup --system app && adduser --system --ingroup app app
USER app

# start
CMD ["npm", "start"]
