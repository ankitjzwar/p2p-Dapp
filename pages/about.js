export default function About() {
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "auto",
      padding: "30px",
      fontFamily: "system-ui, sans-serif",
      color: "#111"
    },
    title: {
      textAlign: "center",
      marginBottom: "20px"
    },
    intro: {
      textAlign: "center",
      fontSize: "15px",
      color: "#555",
      lineHeight: "1.7",
      marginBottom: "40px"
    },
    section: {
      marginBottom: "30px"
    },
    heading: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#7c3aed"
    },
    text: {
      fontSize: "14px",
      lineHeight: "1.8",
      color: "#444"
    },
    list: {
      paddingLeft: "20px",
      fontSize: "14px",
      color: "#444"
    },
    listItem: {
      marginBottom: "8px"
    },
    highlightBox: {
      marginTop: "40px",
      padding: "20px",
      borderRadius: "8px",
      backgroundColor: "#f5f3ff",
      color: "#4c1d95",
      fontSize: "14px",
      lineHeight: "1.7"
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About P2P Chat</h1>

      <p style={styles.intro}>
        P2P Chat is a decentralized messaging platform built to provide secure,
        private, and censorship-resistant communication using modern Web3
        technologies.
      </p>

      <div style={styles.section}>
        <h3 style={styles.heading}>Why P2P Chat?</h3>
        <p style={styles.text}>
          Traditional messaging applications rely on centralized servers that
          control user data. P2P Chat removes this dependency by using blockchain
          technology, end-to-end encryption, and decentralized storage, ensuring
          users remain in control of their conversations.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>How It Works</h3>
        <p style={styles.text}>
          User identity is managed through Web3 wallets instead of usernames and
          passwords. Messages are encrypted locally and shared securely with the
          intended recipient. Files are encrypted and stored on decentralized
          storage networks, while only minimal metadata is recorded on the
          blockchain.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>Key Features</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>Decentralized peer-to-peer messaging</li>
          <li style={styles.listItem}>End-to-end encrypted chats</li>
          <li style={styles.listItem}>Wallet-based authentication</li>
          <li style={styles.listItem}>Encrypted file sharing</li>
          <li style={styles.listItem}>No centralized data storage</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>Project Purpose</h3>
        <p style={styles.text}>
          This project is developed as a learning and demonstration platform to
          explore blockchain-based communication systems, focusing on security,
          privacy, and decentralized architecture.
        </p>
      </div>

      <div style={styles.highlightBox}>
        <strong>Note:</strong> This application is an experimental project.
        Users are responsible for securing their wallets and private keys. The
        developers do not have access to user messages or data.
      </div>
    </div>
  );
}
