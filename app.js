// watsonx-demo-app/app.js
import express from "express";
const app = express();

// Code Engine は環境変数 PORT を渡します。無ければ 8080 を使う
const port = process.env.PORT || 8080;

// simple health & text echo endpoint
app.get("/", (req, res) => {
  const input = req.query.text || "Hello World";
  res.send(`
    <html>
      <head><meta charset="utf-8"><title>Watsonx Demo</title></head>
      <body>
        <h1>Watsonx Demo AI App</h1>
        <p>Input: ${escapeHtml(input)}</p>
        <p>Tips: add ?text=your+message to the URL</p>
      </body>
    </html>
  `);
});

// minimal health check
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port ${port}`);
});

// simple html escape to avoid XSS from query param in demo
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
