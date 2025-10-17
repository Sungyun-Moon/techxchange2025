import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// シンプルなチャット API（現時点では固定応答）
app.post("/chat", (req, res) => {
  const userInput = req.body.message;
  if (!userInput) return res.status(400).json({ error: "message is required" });

  // 現時点ではまだWxo連動なし
  res.json({ message: "This is a placeholder response. Connect to WXO later." });
});

// シンプルUI
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Chatbot (WXO未連動)</h2>
        <input id="msg" placeholder="Say something" />
        <button onclick="send()">Send</button>
        <div id="chat"></div>
        <script>
          async function send() {
            const msg = document.getElementById('msg').value;
            const res = await fetch('/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: msg })
            });
            const data = await res.json();
            document.getElementById('chat').innerHTML += '<p><b>You:</b> '+msg+'</p>';
            document.getElementById('chat').innerHTML += '<p><b>Bot:</b> '+(data.message||data.error)+'</p>';
          }
        </script>
      </body>
    </html>
  `);
});

// ポート設定
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
