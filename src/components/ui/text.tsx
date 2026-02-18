function DescriptionText({ text, upper = false, style = {} }) {
  if (upper) text = text.toUpperCase();

  return (
    <div
      className="text-description"
      style={{ width: "100%", textAlign: "center", color: "#9f9f9f", margin: "20px 0 0", padding: "0 0 20px", fontSize: "13px", ...style }}
    >
      {text}
    </div>
  );
}

export { DescriptionText };
