import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Mistral } from "@mistralai/mistralai";

const PORT = Number(process.env.PORT ?? 3000);
const MODEL = "mistral-small-latest";

if (!process.env.MISTRAL_API_KEY) {
  console.error("MISTRAL_API_KEY is not set. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "..", "public")));

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

app.post("/api/chat", async (req, res) => {
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Body must contain a non-empty 'messages' array." });
    return;
  }
  for (const m of messages) {
    if (typeof m?.role !== "string" || typeof m?.content !== "string") {
      res.status(400).json({ error: "Each message must have 'role' and 'content' strings." });
      return;
    }
  }

  try {
    const response = await client.chat.complete({
      model: MODEL,
      messages: messages as ChatMessage[],
    });
    const content = response.choices?.[0]?.message?.content;
    const text = typeof content === "string"
      ? content
      : (Array.isArray(content)
          ? content.filter((c) => c.type === "text").map((c) => c.text).join("")
          : "");
    res.json({ reply: text, model: response.model });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Mistral API request failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Chat app listening on http://localhost:${PORT} (model: ${MODEL})`);
});
