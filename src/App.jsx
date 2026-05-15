import { useState, useEffect } from "react";

const API = "http://a688f1880d76343a6a29fad006a6173e-1205727444.ap-south-1.elb.amazonaws.com:5000/api";

const palette = {
  bg: "#0f0e11",
  card: "#1a1820",
  border: "#2e2b38",
  accent: "#c9f04a",
  accentDim: "#a5c93a22",
  text: "#e8e4f0",
  muted: "#7a748a",
  danger: "#ff5f6d",
};

const styles = {
  root: {
    minHeight: "100vh",
    background: palette.bg,
    color: palette.text,
    fontFamily: "'DM Mono', 'Fira Mono', monospace",
    padding: "0",
    margin: "0",
  },
  header: {
    borderBottom: `1px solid ${palette.border}`,
    padding: "24px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#110f14",
  },
  logo: {
    fontSize: "1.1rem",
    fontWeight: "700",
    letterSpacing: "0.12em",
    color: palette.accent,
    textTransform: "uppercase",
  },
  status: {
    fontSize: "0.72rem",
    color: palette.muted,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dot: (ok) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: ok ? palette.accent : palette.danger,
    display: "inline-block",
  }),
  main: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "48px 24px",
  },
  sectionTitle: {
    fontSize: "0.7rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: palette.muted,
    marginBottom: "20px",
  },
  form: {
    background: palette.card,
    border: `1px solid ${palette.border}`,
    borderRadius: 12,
    padding: "28px",
    marginBottom: "40px",
  },
  input: {
    width: "100%",
    background: palette.bg,
    border: `1px solid ${palette.border}`,
    borderRadius: 8,
    color: palette.text,
    fontFamily: "inherit",
    fontSize: "0.92rem",
    padding: "12px 16px",
    marginBottom: "12px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    background: palette.bg,
    border: `1px solid ${palette.border}`,
    borderRadius: 8,
    color: palette.text,
    fontFamily: "inherit",
    fontSize: "0.88rem",
    padding: "12px 16px",
    marginBottom: "16px",
    outline: "none",
    resize: "vertical",
    minHeight: 90,
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btn: {
    background: palette.accent,
    color: "#0f0e11",
    border: "none",
    borderRadius: 8,
    padding: "11px 28px",
    fontFamily: "inherit",
    fontWeight: "700",
    fontSize: "0.82rem",
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    background: palette.card,
    border: `1px solid ${palette.border}`,
    borderRadius: 12,
    padding: "22px 24px",
    position: "relative",
    transition: "border-color 0.2s, transform 0.15s",
  },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: "700",
    marginBottom: "8px",
    color: palette.text,
  },
  cardBody: {
    fontSize: "0.82rem",
    color: palette.muted,
    lineHeight: 1.6,
    marginBottom: "16px",
  },
  cardDate: {
    fontSize: "0.68rem",
    color: palette.border,
    letterSpacing: "0.1em",
  },
  deleteBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    background: "none",
    border: `1px solid ${palette.border}`,
    borderRadius: 6,
    color: palette.muted,
    cursor: "pointer",
    fontSize: "0.7rem",
    padding: "4px 9px",
    fontFamily: "inherit",
    transition: "color 0.15s, border-color 0.15s",
  },
  empty: {
    color: palette.muted,
    fontSize: "0.85rem",
    padding: "32px 0",
    textAlign: "center",
  },
};

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [apiOk, setApiOk] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/ping`)
      .then((r) => r.json())
      .then(() => setApiOk(true))
      .catch(() => setApiOk(false));

    fetch(`${API}/notes`)
      .then((r) => r.json())
      .then(setNotes)
      .catch(() => {});
  }, []);

  const addNote = async () => {
    if (!title.trim()) return;
    setLoading(true);
    const res = await fetch(`${API}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    const note = await res.json();
    setNotes((prev) => [...prev, note]);
    setTitle("");
    setBody("");
    setLoading(false);
  };

  const deleteNote = async (id) => {
    await fetch(`${API}/notes/${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div style={styles.root}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header style={styles.header}>
        <span style={styles.logo}>◈ Noted</span>
        <span style={styles.status}>
          <span style={styles.dot(apiOk)} />
          {apiOk === null ? "Connecting..." : apiOk ? "Flask API online" : "API offline"}
        </span>
      </header>

      <main style={styles.main}>
        {/* Form */}
        <p style={styles.sectionTitle}>New Note</p>
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = palette.accent)}
            onBlur={(e) => (e.target.style.borderColor = palette.border)}
          />
          <textarea
            style={styles.textarea}
            placeholder="Write something..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = palette.accent)}
            onBlur={(e) => (e.target.style.borderColor = palette.border)}
          />
          <button
            style={styles.btn}
            onClick={addNote}
            disabled={loading}
            onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            {loading ? "Saving..." : "+ Add Note"}
          </button>
        </div>

        {/* Notes grid */}
        <p style={styles.sectionTitle}>Your Notes — {notes.length}</p>
        {notes.length === 0 ? (
          <p style={styles.empty}>No notes yet. Add one above.</p>
        ) : (
          <div style={styles.grid}>
            {notes.map((note) => (
              <div
                key={note.id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = palette.accent + "66";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = palette.border;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteNote(note.id)}
                  onMouseEnter={(e) => {
                    e.target.style.color = palette.danger;
                    e.target.style.borderColor = palette.danger;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = palette.muted;
                    e.target.style.borderColor = palette.border;
                  }}
                >
                  ✕
                </button>
                <div style={styles.cardTitle}>{note.title}</div>
                <div style={styles.cardBody}>{note.body || "—"}</div>
                <div style={styles.cardDate}>{note.created}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
