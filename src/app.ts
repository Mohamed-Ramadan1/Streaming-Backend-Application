import express from "express";
import { PORT } from "./config/index.config";
import { connectDatabase } from "./config/database.config";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Connect to database
connectDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
