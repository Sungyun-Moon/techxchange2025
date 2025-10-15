const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

const responses = JSON.parse(fs.readFileSync('responses.json', 'utf8'));

app.get('/query', (req, res) => {
  const text = (req.query.text || '').toLowerCase();
  const reply = responses[text] || "Sorry, I don't understand.";
  res.json({ input: text, response: reply });
});

app.listen(port, () => {
  console.log(`AI app listening on port ${port}`);
});
