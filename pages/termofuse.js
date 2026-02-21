export default function TermsOfUse() {
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
      marginBottom: "30px"
    },
    section: {
      marginBottom: "25px"
    },
    heading: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#7c3aed"
    },
    text: {
      fontSize: "14px",
      lineHeight: "1.7",
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
    footer: {
      marginTop: "40px",
      fontSize: "13px",
      textAlign: "center",
      color: "#666"
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Terms of Use</h1>

      <div style={styles.section}>
        <h3 style={styles.heading}>1. Acceptance of Terms</h3>
        <p style={styles.text}>
          By accessing or using this application, you agree to be bound by these
          Terms of Use. If you do not agree with any part of these terms, you must
          discontinue use of the application.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>2. Description of Service</h3>
        <p style={styles.text}>
          This application is a decentralized peer-to-peer messaging platform
          that enables secure communication using blockchain technology,
          encryption, and decentralized storage.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>3. User Responsibilities</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            You are responsible for maintaining the security of your wallet and
            private keys.
          </li>
          <li style={styles.listItem}>
            You agree not to use the application for any unlawful or harmful
            activities.
          </li>
          <li style={styles.listItem}>
            You understand that blockchain transactions are irreversible.
          </li>
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>4. Privacy & Data</h3>
        <p style={styles.text}>
          Messages are encrypted and stored in a decentralized manner. The
          application does not collect, store, or control user personal data.
          Due to the nature of blockchain technology, certain data may be
          permanently recorded.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>5. Prohibited Use</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>Illegal activities</li>
          <li style={styles.listItem}>Harassment or abusive behavior</li>
          <li style={styles.listItem}>Distribution of malicious software</li>
          <li style={styles.listItem}>
            Attempting to compromise network security
          </li>
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>6. Limitation of Liability</h3>
        <p style={styles.text}>
          This application is provided on an “as is” basis. The developers are
          not responsible for data loss, wallet compromise, or network failures.
          Use of the application is at your own risk.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>7. Modifications to Terms</h3>
        <p style={styles.text}>
          These terms may be updated at any time without prior notice. Continued
          use of the application constitutes acceptance of the updated terms.
        </p>
      </div>

      <div style={styles.footer}>
        © {new Date().getFullYear()} P2P Chat. All rights reserved.
      </div>
    </div>
  );
}
