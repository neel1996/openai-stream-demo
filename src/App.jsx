import { useState, useCallback } from "react";
import { openai } from "./openai";
import InputForm from "./InputForm";
import Conversations from "./Conversations";

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [aiMessage, setAiMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");

  const handleSubmitWithLib = useCallback(
    async (e) => {
      e.preventDefault();

      setConversations((prev) => {
        return [
          ...prev,
          {
            message: userMessage,
            isHuman: true,
          },
        ];
      });
      setUserMessage("");

      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        stream: true,
      });

      let streamedMessage = "";
      for await (const part of stream) {
        setAiMessage((prev) => prev + part.choices[0].delta.content);

        if (part.choices[0].finish_reason === "stop") {
          setConversations((prev) => {
            return [
              ...prev,
              {
                message: streamedMessage,
                isHuman: false,
              },
            ];
          });

          setAiMessage("");
          break;
        } else {
          streamedMessage += part.choices[0].delta.content;
        }
      }
    },
    [userMessage]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setConversations((prev) => {
        return [
          ...prev,
          {
            message: userMessage,
            isHuman: true,
          },
        ];
      });
      setUserMessage("");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        console.log("Error in response");
        return;
      }

      let streamedMessage = "";
      const reader = res.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const decoded = new TextDecoder("utf-8").decode(value);
        streamedMessage += decoded;
        setAiMessage((prev) => prev + decoded);
      }

      setConversations((prev) => {
        return [
          ...prev,
          {
            message: streamedMessage,
            isHuman: false,
          },
        ];
      });

      setAiMessage("");
    },
    [userMessage]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "darkslateblue",
      }}
    >
      <Conversations conversations={conversations} aiMessage={aiMessage} />
      <InputForm
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
