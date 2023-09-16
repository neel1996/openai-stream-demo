export default function ChatBubble({ isHuman, message }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: isHuman ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          width: "fit-content",
          maxWidth: "600px",
          background: isHuman ? "lightblue" : "white",
          padding: "10px",
          borderRadius: "10px",
          margin: "14px",
          color: "black",
          fontFamily: "sans-serif",
          fontWeight: "400",
        }}
      >
        {message}
      </div>
    </div>
  );
}
