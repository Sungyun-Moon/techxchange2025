// app.js
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 8080;

// JSONファイルの読み込み
const responses = JSON.parse(fs.readFileSync(path.resolve('./responses.json'), 'utf8'));

app.get('/query', (req, res) => {
  const input = req.query.text;
  const response = responses[input] || "Sorry, I don't understand.";
  res.json({ input, response });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
