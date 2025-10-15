# Node.js 20 の軽量版を使用
FROM node:20-slim

WORKDIR /app

# 必要なファイルをすべてコピー
COPY package.json app.js responses.json ./

# 依存パッケージをインストール
RUN npm install --production

# ポートを公開
EXPOSE 8080

# アプリ起動
CMD ["npm", "start"]
