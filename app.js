import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// 手動で設定した環境変数を利用
const WXO_URL = process.env.WXO_URL;        // 例: https://api.jp-tok.watsonx.ai/wxo/api/v1
const WXO_API_KEY = process.env.WXO_API_KEY;

// IBM Cloud IAM トークンを生成する関数
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
  if (!userInput) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    // ① IAMトークンを取得
    const token = await getIAMToken(WXO_API_KEY);

    // ② Watsonx Orchestrate API 呼び出し
    const response = await fetch(`${WXO_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        input: { text: userInput }
      })
    });

    const data = await response.json();

    // ③ 応答をパースして返す
    res.json({
      from: "wxo",
      message: data.output?.generic?.[0]?.text || "No response from Watsonx Orchestrate"
    });

  } catch (err) {
    console.error("WXO call failed:", err);
    res.status(500).json({ error: "Failed to get response from Watsonx Orchestrate" });
  }
});

// シンプルUI
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Watsonx Chatbot</title></head>
      <body style="font-family:sans-serif;">
        <h2>Chat with Watsonx Orchestrate</h2>
        <input id="msg" placeholder="Say something..." style="width:300px;" />
        <button onclick="send()">Send</button>
        <div id="chat" style="margin-top:20px;"></div>
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
