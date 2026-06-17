"use client";

import { useEffect, useState } from "react";

function format(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function LivePlayer() {
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [quality, setQuality] = useState("Auto 4K");
  const [mode, setMode] = useState("Video + Audio");
  const [language, setLanguage] = useState("English");
  const [status, setStatus] = useState("Main Sanctuary Live");

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [playing]);

  function preserve(reason: string) {
    setStatus(`Resumed at ${format(seconds)} after ${reason}`);
  }

  return (
    <article className="panel">
      <div className="panel-head">
        <h2>Live Worship Console</h2>
        <span>{status}</span>
      </div>
      <div className={mode === "Video + Audio" ? "player" : "player audio"}>
        <span className="badge">{language} stream</span>
        <span className="resume">{format(seconds)} preserved</span>
        <button className="play" onClick={() => setPlaying(!playing)}>{playing ? "Ⅱ" : "▶"}</button>
      </div>
      <div className="control-grid">
        <label>Quality<select value={quality} onChange={(event) => { setQuality(event.target.value); preserve("quality switch"); }}><option>Auto 4K</option><option>1080p</option><option>720p</option><option>480p</option><option>Audio only</option></select></label>
        <label>Mode<select value={mode} onChange={(event) => { setMode(event.target.value); preserve("mode switch"); }}><option>Video + Audio</option><option>Audio only</option><option>Low-data</option></select></label>
        <label>Language<select value={language} onChange={(event) => { setLanguage(event.target.value); preserve("language switch"); }}><option>English</option><option>French</option><option>Spanish</option><option>Portuguese</option><option>Yoruba</option><option>Igbo</option></select></label>
      </div>
    </article>
  );
}
