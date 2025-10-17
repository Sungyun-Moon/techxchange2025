import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// 環境変数からwxoのService Access情報を取得
const WXO_URL = process.env.WXO_URL;
const WXO_API_KEY = process.env.WXO_API_KEY;

app.post("/chat", async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    // wxo APIへリクエスト送信
    const response = await fetch(`${WXO_URL}/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${WXO_API_KEY}`,
      },
      body: JSON.stringify({
        input: userInput
      })
    });

    const data = await response.json();

    if (response.ok) {
      res.json({
        from: "wxo",
        message: data.output || "No response from Watsonx Orchestrate"
      });
    } else {
      res.status(500).json({
        error: data.error || "Error from Watsonx Orchestrate"
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// シンプルなHTMLフロントエンド（確認用UI）
app.get("/", (req, res) => {
  res.send(`
    <html>
    <head><title>Watsonx Chatbot</title></head>
    <body style="font-family: sans-serif;">
      <h2>Chat with Watsonx Orchestrate</h2>
      <input id="msg" placeholder="Say something..." style="width: 300px;" />
      <button onclick="send()">Send</button>
      <div id="chat" style="margin-top: 20px;"></div>
      <script>
        async function send() {
          const msg = document.getElementById('msg').value;
          const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
          });
          const data = await res.json();
          const chat = document.getElementById('chat');
          chat.innerHTML += '<p><b>You:</b> ' + msg + '</p>';
          chat.innerHTML += '<p><b>Watsonx:</b> ' + (data.message || data.error) + '</p>';
        }
      </script>
    </body>
    </html>
  `);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
