FROM node:20-slim
WORKDIR /app
COPY package.json app.js ./
RUN npm install --production
EXPOSE 8080
CMD ["npm", "start"]
