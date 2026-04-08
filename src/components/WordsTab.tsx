"use client";

import { useState, useEffect } from "react";
import { catalogWords, type WordData } from "@/lib/words-data";

type Preference = "avoid" | "keep" | "neutral";

interface WordWithPref extends WordData {
  preference: Preference;
}

const STORAGE_KEY = "erik-word-preferences";

function loadPreferences(): Record<string, Preference> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePreferences(prefs: Record<string, Preference>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function WordsTab() {
  const [words, setWords] = useState<WordWithPref[]>([]);
  const [filter, setFilter] = useState<"all" | Preference>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const prefs = loadPreferences();
    setWords(
      catalogWords.map((w) => ({
        ...w,
        preference: prefs[w.word] || "neutral",
      }))
    );
  }, []);

  const togglePreference = (word: string) => {
    setWords((prev) => {
      const updated = prev.map((w) => {
        if (w.word !== word) return w;
        const next: Preference =
          w.preference === "neutral"
            ? "avoid"
            : w.preference === "avoid"
            ? "keep"
            : "neutral";
        return { ...w, preference: next };
      });
      const prefs: Record<string, Preference> = {};
      updated.forEach((w) => {
        if (w.preference !== "neutral") prefs[w.word] = w.preference;
      });
      savePreferences(prefs);
      return updated;
    });
  };

  const filtered = words.filter((w) => {
    if (filter !== "all" && w.preference !== filter) return false;
    if (search && !w.word.includes(search.toLowerCase())) return false;
    return true;
  });

  const avoidCount = words.filter((w) => w.preference === "avoid").length;
  const keepCount = words.filter((w) => w.preference === "keep").length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted">Totaal woorden</p>
          <p className="text-2xl font-bold text-foreground">{words.length}</p>
        </div>
        <div className="bg-card border border-red-900/50 rounded-lg p-4">
          <p className="text-sm text-red-400">Vermijden</p>
          <p className="text-2xl font-bold text-red-400">{avoidCount}</p>
        </div>
        <div className="bg-card border border-green-900/50 rounded-lg p-4">
          <p className="text-sm text-green-400">Behouden</p>
          <p className="text-2xl font-bold text-green-400">{keepCount}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted">
        <p>
          Klik op een woord om de status te wisselen:{" "}
          <span className="text-foreground">Neutraal</span> →{" "}
          <span className="text-red-400">Vermijden</span> →{" "}
          <span className="text-green-400">Behouden</span> → Neutraal
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Zoek woord..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent"
        />
        <div className="flex gap-1 bg-card rounded-lg p-1 border border-border">
          {(["all", "avoid", "keep", "neutral"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f
                  ? f === "avoid"
                    ? "bg-red-900/50 text-red-400"
                    : f === "keep"
                    ? "bg-green-900/50 text-green-400"
                    : "bg-accent text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {f === "all"
                ? "Alles"
                : f === "avoid"
                ? "Vermijden"
                : f === "keep"
                ? "Behouden"
                : "Neutraal"}
            </button>
          ))}
        </div>
      </div>

      {/* Word grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((w) => (
          <button
            key={w.word}
            onClick={() => togglePreference(w.word)}
            className={`group relative bg-card border rounded-lg p-4 text-left transition-all hover:bg-card-hover ${
              w.preference === "avoid"
                ? "border-red-800 bg-red-950/20"
                : w.preference === "keep"
                ? "border-green-800 bg-green-950/20"
                : "border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-base font-semibold ${
                  w.preference === "avoid"
                    ? "text-red-400 line-through"
                    : w.preference === "keep"
                    ? "text-green-400"
                    : "text-foreground"
                }`}
              >
                {w.word}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  w.preference === "avoid"
                    ? "bg-red-900/50 text-red-400"
                    : w.preference === "keep"
                    ? "bg-green-900/50 text-green-400"
                    : "bg-border text-muted"
                }`}
              >
                {w.count}x
              </span>
            </div>
            <p className="text-xs text-muted">
              in {w.songCount} nummer{w.songCount !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted/60 mt-1 truncate">
              {w.songs.slice(0, 2).join(", ")}
              {w.songs.length > 2 && ` +${w.songs.length - 2}`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function getWordPreferences(): {
  avoided: string[];
  kept: string[];
} {
  const prefs = loadPreferences();
  const avoided: string[] = [];
  const kept: string[] = [];
  for (const [word, pref] of Object.entries(prefs)) {
    if (pref === "avoid") avoided.push(word);
    if (pref === "keep") kept.push(word);
  }
  return { avoided, kept };
}
