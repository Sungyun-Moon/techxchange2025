# Node.js 20-alpine を使用
FROM node:20-alpine

WORKDIR /app

# package.json と package-lock.json をコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリコードをコピー
COPY . .

# アプリ起動
CMD ["node", "app.js"]
