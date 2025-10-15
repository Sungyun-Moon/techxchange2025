// ES module 対応
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// JSONファイルのパスを取得
const responsesPath = path.join(process.cwd(), 'responses.json');
const responses = JSON.parse(fs.readFileSync(responsesPath, 'utf-8'));

app.get('/', (req, res) => {
  res.send('Watsonx Demo AI App<br>Use ?text=your+message');
});

app.get('/chat', (req, res) => {
  const userText = req.query.text || '';
  const reply = responses[userText.toLowerCase()] || "I don't know about that.";
  res.json({ input: userText, reply });
});

app.listen(PORT, () => {
  console.log(`Watsonx Demo AI App listening on port ${PORT}`);
});
