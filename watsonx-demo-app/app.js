import express from "express";
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    message: "✅ Watsonx Demo AI App is running on IBM Cloud Code Engine!",
    timestamp: new Date(),
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
