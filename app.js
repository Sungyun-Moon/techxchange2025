import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8080;

// WXO連携用の環境変数（Service Access経由で自動注入される想定）
const WXO_API_URL = process.env.WXO_API_URL || "";
const WXO_API_KEY = process.env.WXO_API_KEY || "";

console.log("WXO連携状態:", WXO_API_URL && WXO_API_KEY ? "有効" : "無効");

app.post("/chat", async (req, res) => {
  const userInput = req.body.message || "";

  // 🔹 WXO連携が有効な場合
  if (WXO_API_URL && WXO_API_KEY) {
    try {
      const response = await fetch(`${WXO_API_URL}/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${WXO_API_KEY}`,
        },
        body: JSON.stringify({
          input: userInput,
          options: { debug: false },
        }),
      });

      const data = await response.json();
      let answer =
        data.output?.text?.[0] ||
        data.message ||
        "（WXOからの応答を取得できませんでした）";

      return res.json({ reply: answer });
    } catch (err) {
      console.error("WXO呼び出しエラー:", err);
      return res.json({ reply: "（WXOとの通信に失敗しました）" });
    }
  }

  // 🔸 WXO未連携時：ランダムなAI風応答
  const fallbackReplies = [
    "なるほど、面白い視点ですね！",
    "もう少し詳しく教えてもらえますか？",
    "それはとても良い質問です。",
    "確かに、その点は考えさせられますね。",
  ];
  const randomReply =
    fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  res.json({ reply: randomReply });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
