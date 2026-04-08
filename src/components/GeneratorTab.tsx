"use client";

import { useState, useEffect } from "react";

const PREFS_KEY = "erik-word-preferences";

const categories = [
  { id: "emotional_ballad", label: "Emotional Ballad", description: "Kwetsbaar, vaderschap, groei — hoogste save rates" },
  { id: "rebel_party", label: "Rebel / Party", description: "Outlaw, energie, autobiografisch — goed tussendoor" },
  { id: "dark_country", label: "Dark Country", description: "Confessional, coping, eenzaamheid" },
  { id: "country_trap", label: "Country-Trap / Fusion", description: "Rap-elementen, 808s, modern country blend" },
];

const moods = [
  "Emotional", "Introspective", "Hopeful", "Confident", "Wild",
  "Energetic", "Anthemic", "Sad", "Haunting", "Intimate", "Raw",
];

const tempos = [
  { id: "slow", label: "Slow (60-75 BPM)", bpm: "~62-72 BPM" },
  { id: "mid", label: "Mid-tempo (76-100 BPM)", bpm: "~85-95 BPM" },
  { id: "upbeat", label: "Upbeat (100-120 BPM)", bpm: "~105-115 BPM" },
  { id: "fast", label: "Fast (120+ BPM)", bpm: "~125+ BPM" },
];

const instruments: Record<string, string[]> = {
  emotional_ballad: [
    "Acoustic Ballad", "Clean Fingerpicked Guitar", "Warm Piano Accents",
    "Brush Drums", "Fiddle Support", "Pedal Steel Swells", "Layered Strings",
    "Slide Guitar Interlude", "Ambient Pads",
  ],
  rebel_party: [
    "Electric Guitar Riffs", "Southern Slide Guitar", "Banjo Accents",
    "Fiddle Fills", "Kickin' Drum Groove", "Guitar Solo Section",
    "Southern Rock Guitar Riff", "Stomp-Clap Build",
  ],
  dark_country: [
    "Slide Guitar", "Fiddle Layer", "Blues Rock Rhythm", "Brush Drums",
    "Drop D Tuning", "Pedal Steel", "Ambient Pads", "Stripped Bridge",
  ],
  country_trap: [
    "Deep 808 Bass", "Twangy Guitars", "Banjo Layer", "Half-Time Groove",
    "Country Flow", "Dirty Guitar Slide", "Fiddle Fade",
  ],
};

const themes: Record<string, string[]> = {
  emotional_ballad: [
    "Vaderschap / kinderen", "Persoonlijke groei", "Kwetsbaarheid + kracht",
    "Dankbaarheid", "Liefde & relaties", "Identiteit / masker",
  ],
  rebel_party: [
    "Dualiteit (IT + muziek)", "Outlaw lifestyle", "Nederlandse roots",
    "Vrijheid & onafhankelijkheid", "Humor / autobiografisch",
  ],
  dark_country: [
    "Eenzaamheid / coping", "Gebroken relatie", "Innerlijke strijd",
    "Verslaving", "Nachtelijke reflectie",
  ],
  country_trap: [
    "Straatleven + country", "Rebel met geloof", "Authenticiteit",
    "Freedom & grit",
  ],
};

function buildSunoPrompt(config: {
  category: string;
  selectedMoods: string[];
  tempo: string;
  selectedInstruments: string[];
  theme: string;
  avoided: string[];
  kept: string[];
  customNotes: string;
}): string {
  const { category, selectedMoods, tempo, selectedInstruments, theme, avoided, kept, customNotes } = config;

  const tempoInfo = tempos.find((t) => t.id === tempo);
  const catLabel = categories.find((c) => c.id === category)?.label || category;

  let prompt = `[Style: ${catLabel}, Modern Americana, Male Vocal]\n`;

  if (selectedMoods.length > 0) {
    prompt += `[Mood: ${selectedMoods.join(", ")}]\n`;
  }

  if (tempoInfo) {
    prompt += `[${tempoInfo.bpm}]\n`;
  }

  if (selectedInstruments.length > 0) {
    prompt += `[Instruments: ${selectedInstruments.join(", ")}]\n`;
  }

  prompt += `[Vocal Range: C2–A4] [Male Voice Only] [Midrange Chest Voice]\n`;
  prompt += `[Emotional Country Tone] [Singer-Songwriter Feel]\n`;
  prompt += `[8-bar Instrumental Intro] [Vocals start after intro]\n`;

  if (category === "emotional_ballad") {
    prompt += `[Stripped Acoustic Breakdown] [Soaring Final Chorus]\n`;
    prompt += `[Mid-song Instrumental Interlude between 2nd Chorus and Bridge]\n`;
  } else if (category === "rebel_party") {
    prompt += `[Extended Instrumental Break - 16 bars] [Guitar Solo Section]\n`;
    prompt += `[Stomp-Clap Build to Final Chorus]\n`;
  } else if (category === "dark_country") {
    prompt += `[Slow groove] [Dark tone, confessional lyrics, slow-burning build]\n`;
    prompt += `[Stripped Bridge] [Melancholy outro with fiddle]\n`;
  } else if (category === "country_trap") {
    prompt += `[Country Flow + Outlaw Rap Groove] [Half-Time Groove]\n`;
    prompt += `[Big Rock Chorus – Southern Energy]\n`;
  }

  prompt += `[Duration: ~4:00]\n`;

  if (theme) {
    prompt += `\nTheme: ${theme}\n`;
  }

  if (avoided.length > 0) {
    prompt += `\n⚠️ VERMIJD deze woorden (overused in catalogus): ${avoided.join(", ")}\n`;
  }

  if (kept.length > 0) {
    prompt += `\n✓ Trademark woorden (mag terugkomen): ${kept.join(", ")}\n`;
  }

  if (customNotes) {
    prompt += `\nExtra notities: ${customNotes}\n`;
  }

  return prompt;
}

function buildLyricStructure(category: string): string {
  if (category === "emotional_ballad") {
    return `[Intro]
(8-bar fingerpicked acoustic intro with fiddle and warm piano accents)

[Verse 1]
(4-6 lines — set the scene with specific, concrete details)
(Show vulnerability through imagery, not statements)

[Verse 2]
(4-6 lines — deepen the story, add emotional weight)
(Use sensory details: sounds, textures, smells)

[Pre-Chorus]
(2-3 lines — emotional pivot, build tension)

[Chorus]
(6-8 lines — emotional core, singable hook)
(Pattern: kwetsbaarheid + kracht)
(End with a memorable, repeatable line)

[Verse 3]
(4-6 lines — new angle on the theme)

[Pre-Chorus]
(2-3 lines — variation on first pre-chorus)

[Chorus]
(Repeat with slight lyrical variation)

[Instrumental Break]
(16-bar acoustic guitar and pedal steel with fiddle counter-melody)

[Bridge]
(3-4 lines — turning point, revelation, or reflection)
(This is where the emotional climax hits)

[Final Chorus]
(6-8 lines — soaring, evolved version of chorus)
(Swap a key word or line to show growth/resolution)

[Outro]
(8-10 bar fingerpicked guitar outro with soft fiddle fade)`;
  }

  if (category === "rebel_party") {
    return `[Intro – 8 bars]
[Southern Rock Guitar Riff]
[Banjo Underlayer]

[Verse 1]
(6-8 lines — swagger, attitude, autobiographical details)
(Mix bragging with self-awareness)

[Pre-Chorus]
(2 lines — setup for the hook)

[Chorus]
(6-8 lines — anthemic, singable, energetic)
(Identity statement: "I am..." / "Call me..." / "Welcome to...")

[Verse 2]
(6-8 lines — deeper layer, contrast or surprise)

[Pre-Chorus]
(2 lines — variation)

[Chorus]
(Repeat)

[Instrumental Break – 16 bars]
[Guitar Solo]
[Fiddle/Slide Guitar Duel]
[Stomp-Clap Build to Final Chorus]

[Bridge]
(4 lines — moment of realness beneath the bravado)

[Final Chorus – Soaring]
(Evolved chorus with bigger energy)

[Outro – 8 bars + Fade]`;
  }

  if (category === "dark_country") {
    return `[Intro – 8 bars]
(Slide guitar + brush drums — dark, moody)

[Verse 1]
(4-6 lines — confessional, raw honesty)
(Start in the depths)

[Verse 2]
(4-6 lines — dig deeper into the struggle)

[Pre-Chorus]
(3-4 lines — shift from despair to coping)

[Chorus]
(6-8 lines — the anthem of survival/coping)
(Dark but not hopeless)

[Verse 3]
(4-6 lines — mirror cracks, self-reflection)

[Pre-Chorus]
(Variation — scars as proof of living)

[Chorus]
(Repeat with added intensity)

[Bridge]
(3-4 lines — stripped, quiet, most vulnerable moment)

[Final Chorus – stripped to full band]
(Build from nothing to full power)

[Outro]
(Slide guitar fades, single drum hit, fiddle trail)`;
  }

  // country_trap
  return `[Spoken Intro / Ad-lib]
(2-4 lines — attitude, sets the tone)

[Verse 1] [Country Flow + Outlaw Rap Groove]
(8 lines — rhythmic, punchy, storytelling)
(Mix country imagery with rap cadence)

[Pre-Chorus] [Melodic Country Rock Build]
(2 lines — transition to singing)

[Chorus] [Big Rock Chorus – Southern Energy]
(6-8 lines — anthemic, southern rock chorus)

[Verse 2] [Rap Verse – Swagger Flow / Banjo Layer]
(8 lines — faster flow, more swagger)

[Pre-Chorus] [Half-Time Groove]
(2 lines — variation)

[Chorus] [Anthemic Country Rock]
(Repeat)

[Bridge] [Breakdown – Spoken/Rap Blend over Slide Guitar]
(6-8 lines — raw, spoken-word feel)

[Final Chorus] [Soaring Southern Rock]
(Evolved chorus — bigger, final statement)

[Outro] [Fiddle Fade + Dirty Guitar Slide]`;
}

export function GeneratorTab() {
  const [category, setCategory] = useState("emotional_ballad");
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Emotional", "Hopeful"]);
  const [tempo, setTempo] = useState("slow");
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [theme, setTheme] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [avoided, setAvoided] = useState<string[]>([]);
  const [kept, setKept] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    // Load word preferences
    try {
      const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
      const a: string[] = [];
      const k: string[] = [];
      for (const [word, pref] of Object.entries(prefs)) {
        if (pref === "avoid") a.push(word);
        if (pref === "keep") k.push(word);
      }
      setAvoided(a);
      setKept(k);
    } catch {}
  }, []);

  // Reset instruments when category changes
  useEffect(() => {
    setSelectedInstruments([]);
  }, [category]);

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const toggleInstrument = (inst: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const sunoPrompt = buildSunoPrompt({
    category,
    selectedMoods,
    tempo,
    selectedInstruments,
    theme,
    avoided,
    kept,
    customNotes,
  });

  const lyricStructure = buildLyricStructure(category);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
          {/* Category */}
          <section className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-accent-light mb-3">
              Categorie
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    category === cat.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-border hover:bg-card-hover"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {cat.label}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{cat.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Theme */}
          <section className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-accent-light mb-3">
              Thema
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {(themes[category] || []).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    theme === t
                      ? "bg-accent text-white"
                      : "bg-border text-muted hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Of typ een eigen thema..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent"
            />
          </section>

          {/* Mood */}
          <section className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-accent-light mb-3">
              Mood (meerdere mogelijk)
            </h3>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedMoods.includes(mood)
                      ? "bg-accent text-white"
                      : "bg-border text-muted hover:text-foreground"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </section>

          {/* Tempo */}
          <section className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-accent-light mb-3">
              Tempo
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {tempos.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTempo(t.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tempo === t.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:bg-card-hover"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {t.label}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Instruments */}
          <section className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-accent-light mb-3">
              Instrumenten
            </h3>
            <div className="flex flex-wrap gap-2">
              {(instruments[category] || []).map((inst) => (
                <button
                  key={inst}
                  onClick={() => toggleInstrument(inst)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedInstruments.includes(inst)
                      ? "bg-accent text-white"
                      : "bg-border text-muted hover:text-foreground"
                  }`}
                >
                  {inst}
                </button>
              ))}
            </div>
          </section>

          {/* Word preferences summary */}
          {(avoided.length > 0 || kept.length > 0) && (
            <section className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-accent-light mb-3">
                Woordvoorkeuren (uit Woorden-tab)
              </h3>
              {avoided.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-red-400 mb-1">Vermijden:</p>
                  <div className="flex flex-wrap gap-1">
                    {avoided.map((w) => (
                      <span
                        key={w}
                        className="px-2 py-0.5 rounded text-xs bg-red-950/30 text-red-400 border border-red-900/50"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {kept.length > 0 && (
                <div>
                  <p className="text-xs text-green-400 mb-1">Behouden:</p>
                  <div className="flex flex-wrap gap-1">
                    {kept.map((w) => (
                      <span
                        key={w}
                        className="px-2 py-0.5 rounded text-xs bg-green-950/30 text-green-400 border border-green-900/50"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Custom notes */}
          <section className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-accent-light mb-3">
              Extra notities
            </h3>
            <textarea
              placeholder="Bijv. 'Inspiratie: Chris Stapleton meets Zach Bryan' of 'Focus op het moment dat je dochter voor het eerst fietst'"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent resize-none"
            />
          </section>

          <button
            onClick={() => setShowOutput(true)}
            className="w-full py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-lg transition-colors"
          >
            Genereer Suno Prompt & Lyric Template
          </button>
        </div>

        {/* Right: Output */}
        <div className="space-y-6">
          {showOutput ? (
            <>
              {/* Suno Prompt */}
              <section className="bg-card border border-accent/30 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-accent-light">
                    Suno Prompt
                  </h3>
                  <button
                    onClick={() => copyToClipboard(sunoPrompt)}
                    className="px-3 py-1 text-xs bg-accent/20 text-accent-light rounded hover:bg-accent/30 transition-colors"
                  >
                    Kopieer
                  </button>
                </div>
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background rounded-lg p-4 border border-border overflow-auto max-h-96">
                  {sunoPrompt}
                </pre>
              </section>

              {/* Lyric Structure */}
              <section className="bg-card border border-accent/30 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-accent-light">
                    Lyric Template
                  </h3>
                  <button
                    onClick={() => copyToClipboard(lyricStructure)}
                    className="px-3 py-1 text-xs bg-accent/20 text-accent-light rounded hover:bg-accent/30 transition-colors"
                  >
                    Kopieer
                  </button>
                </div>
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background rounded-lg p-4 border border-border overflow-auto max-h-[600px]">
                  {lyricStructure}
                </pre>
              </section>

              {/* Tips */}
              <section className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-accent-light mb-3">
                  Songwriting Tips (data-bewezen)
                </h3>
                <ul className="space-y-2 text-xs text-muted">
                  <li className="flex gap-2">
                    <span className="text-green-400 shrink-0">7.9%</span>
                    Vaderschap-thema&apos;s leveren de hoogste save rates op
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-400 shrink-0">tip</span>
                    Specifieke details &gt; abstracte metaforen (&quot;muddy sneakers by the rug&quot;)
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-400 shrink-0">tip</span>
                    Kwetsbaarheid + kracht = winnende combo (strijd → doorzetting)
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-light shrink-0">let op</span>
                    Rebel/party nummers zijn prima tussendoor maar niet als lead single
                  </li>
                </ul>
              </section>
            </>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4 text-muted">🎸</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Configureer je nummer
              </h3>
              <p className="text-sm text-muted max-w-xs">
                Kies categorie, thema, mood en instrumenten. Klik dan op
                &quot;Genereer&quot; voor je Suno prompt en lyric template.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
