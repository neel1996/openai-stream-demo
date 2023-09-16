import express from "express";
import OpenAI from "openai";

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  for await (const part of stream) {
    const reason = part.choices[0].finish_reason;
    if (reason === "stop") {
      break;
    }
    const chunk = part.choices[0].delta.content;
    res.write(chunk);
  }

  res.end();
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
