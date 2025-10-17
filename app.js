import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// 環境変数から取得
const WXO_URL = process.env.WXO_URL;       // 例: https://api.jp-tok.watsonx.ai/wxo/api/v1
const WXO_API_KEY = process.env.WXO_API_KEY;

// IAMトークン生成（汎用対応）
async function getIAMToken(apiKey) {
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`
  });
  const data = await res.json();
  return data.access_token;
}

app.post("/chat", async (req, res) => {
  const userInput = req.body.message;
  if (!userInput) return res.status(400).json({ error: "message is required" });

  try {
    const token = await getIAMToken(WXO_API_KEY);
    const response = await fetch(`${WXO_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ input: { text: userInput } })
    });

    const data = await response.json();
    res.json({ message: data.output?.generic?.[0]?.text || "No response from WXO" });

  } catch (err) {
    console.error("WXO call failed:", err);
    res.status(500).json({ error: "Failed to get response from Watsonx Orchestrate" });
  }
});

// シンプルUI
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Chat with Watsonx Orchestrate</h2>
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
            document.getElementById('chat').innerHTML += '<p><b>Watsonx:</b> '+(data.message||data.error)+'</p>';
          }
        </script>
      </body>
    </html>
  `);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
