import ChatBubble from "./ChatBubble";

export default function Conversations({ conversations, aiMessage }) {
  return (
    <div
      style={{
        width: "100%",
        height: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        margin: "0 auto",
        background: "#625a91",
      }}
    >
      <div
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          padding: "30px",
        }}
      >
        {conversations &&
          conversations.map((conversation, index) => {
            return (
              <ChatBubble
                isHuman={conversation.isHuman}
                message={conversation.message}
                key={index}
              />
            );
          })}
        {aiMessage && <ChatBubble isHuman={false} message={aiMessage} />}
      </div>
    </div>
  );
}
