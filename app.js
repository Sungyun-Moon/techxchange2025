import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 簡易チャット「擬似AI」レスポンス
function pseudoAI(input) {
  const responses = [
    "なるほど、それについてもう少し詳しく教えてください。",
    "面白いですね！",
    "うーん、ちょっと考えさせてください。",
    "そういう見方もありますね。",
    "それについては情報が不足しています。"
  ];
  // 入力に応じてランダムで返す
  return responses[Math.floor(Math.random() * responses.length)];
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Watsonx Demo Chat (Pseudo AI)</h1>
        <form method="POST" action="/ask">
          <input type="text" name="text" placeholder="Type your message" size="40" />
          <button type="submit">Send</button>
        </form>
      </body>
    </html>
  `);
});

app.post("/ask", (req, res) => {
  const userText = req.body.text || "";
  const answer = pseudoAI(userText);

  res.send(`
    <html>
      <body>
        <h1>Watsonx Demo Chat (Pseudo AI)</h1>
        <p><b>You:</b> ${userText}</p>
        <p><b>AI:</b> ${answer}</p>
        <a href="/">Back</a>
      </body>
    </html>
  `);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
