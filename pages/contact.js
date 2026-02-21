// 

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_b1v0631",
      "template_3tcpssb",
      {
        name: form.name,
        email: form.email,
        message: form.message,
        
      },
      "VgTOdPPHiYJ7XejCN"

    
    
    )
    .then(() => {
      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    })
    .catch((error) => {
      console.error("Email error:", error);
      alert("Something went wrong. Try again.");
    });
  };

  const styles = {
    container: {
      maxWidth: "700px",
      margin: "auto",
      padding: "30px",
      fontFamily: "system-ui, sans-serif"
    },
    title: {
      textAlign: "center",
      marginBottom: "10px"
    },
    subtitle: {
      textAlign: "center",
      fontSize: "14px",
      color: "#555",
      marginBottom: "30px"
    },
    formGroup: {
      marginBottom: "20px"
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontSize: "14px",
      fontWeight: "600"
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      outline: "none"
    },
    textarea: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      outline: "none",
      resize: "vertical",
      minHeight: "120px"
    },
    button: {
      width: "100%",
      padding: "12px",
      fontSize: "15px",
      fontWeight: "600",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      backgroundColor: "#7c3aed",
      color: "#fff"
    },
    infoBox: {
      marginTop: "30px",
      textAlign: "center",
      fontSize: "14px",
      color: "#666"
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>
      <p style={styles.subtitle}>
        Have questions, feedback, or issues? Send us a message.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Message</label>
          <textarea
            style={styles.textarea}
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Send Message
        </button>
      </form>

      <div style={styles.infoBox}>
        <p>
          For security reasons, do not share private keys or sensitive
          information.
        </p>
      </div>
    </div>
  );
}