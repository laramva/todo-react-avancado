import React, { useState } from "react";

export default function TodoForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  return (
    <form
      className="hidden" // não interfere no teu layout atual
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onCreate({ title, note });
        setTitle("");
        setNote("");
      }}
    >
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input value={note} onChange={(e) => setNote(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
