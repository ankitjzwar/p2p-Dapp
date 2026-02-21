import { useState } from "react";

const faqData = [
  {
    question: "What is P2P Chat?",
    answer:
      "P2P Chat is a decentralized messaging application that uses blockchain and end-to-end encryption for secure communication."
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No traditional account is required. Your Web3 wallet acts as your identity."
  },
  {
    question: "Are my messages stored on the blockchain?",
    answer:
      "No. Only minimal metadata is stored on-chain. Messages are encrypted and stored off-chain."
  },
  {
    question: "Can anyone read my messages?",
    answer:
      "No. Messages are end-to-end encrypted and readable only by sender and receiver."
  },
  {
    question: "Is file sharing secure?",
    answer:
      "Yes. Files are encrypted before being uploaded to decentralized storage."
  },
  {
    question: "What happens if I lose my wallet?",
    answer:
      "Lost wallets cannot be recovered. You lose access to your chats permanently."
  }
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const styles = {
    container: {
      maxWidth: "700px",
      margin: "auto",
      padding: "20px",
      fontFamily: "system-ui, sans-serif"
    },
    title: {
      textAlign: "center",
      marginBottom: "20px"
    },
    item: {
      borderBottom: "1px solid #e5e7eb"
    },
    question: (active) => ({
      width: "100%",
      background: "none",
      border: "none",
      padding: "16px",
      fontSize: "22px",
      fontWeight: "600",
      display: "flex",
      justifyContent: "space-between",
      cursor: "pointer",
      color: active ? "#7c3aed" : "#111"
    }),
    answer: {
      padding: "0 16px 16px",
      fontSize: "20px",
      color: "#555",
      lineHeight: "1.6"
    },
    icon: {
      marginLeft: "10px",
      fontWeight: "700"
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Frequently Asked Questions</h1>

      {faqData.map((item, index) => (
        <div key={index} style={styles.item}>
          <button
            style={styles.question(activeIndex === index)}
            onClick={() =>
              setActiveIndex(activeIndex === index ? null : index)
            }
          >
            {item.question}
            <span style={styles.icon}>
              {activeIndex === index ? "−" : "+"}
            </span>
          </button>

          {activeIndex === index && (
            <div style={styles.answer}>
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
