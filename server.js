const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

app.post('/tweet', (req, res) => {
  console.log("🔥 Webhook hit: Running tweetBot.js");

  exec('node tweetBot.js', (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Script error:", err);
      return res.status(500).send("Script failed.");
    }
    console.log(stdout);
    res.send("✅ Tweet posted.");
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});