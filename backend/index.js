const express = require("express");

const app = express();
const PORT = 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "app is OK" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});