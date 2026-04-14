"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const PREFS_KEY = "erik-word-preferences";

const categories = [
  { id: "emotional_ballad", label: "Emotional Ballad", description: "Kwetsbaar, vaderschap, groei — hoogste save rates" },
  { id: "rebel_party", label: "Rebel / Party", description: "Outlaw, energie, autobiografisch — goed tussendoor" },
  { id: "dark_country", label: "Dark Country", description: "Confessional, coping, eenzaamheid" },
  { id: "country_trap", label: "Country-Trap / Fusion", description: "Rap-elementen, 808s, modern country blend" },
  { id: "country_rock", label: "Country Rock", description: "Southern rock, Americana power" },
  { id: "country_pop", label: "Country Pop", description: "Radio-friendly, breed publiek" },
  { id: "honky_tonk", label: "Honky Tonk", description: "Klassiek barroom country, dansvloer energy" },
  { id: "bluegrass", label: "Bluegrass / Folk", description: "Akoestisch, snel, traditioneel, pickin'" },
  { id: "country_blues", label: "Country Blues", description: "Blues roots, slide guitar, soulful storytelling" },
  { id: "red_dirt", label: "Red Dirt / Texas Country", description: "Ruig, onafhankelijk, outlaw Americana" },
  { id: "country_metal", label: "Country Metal", description: "Heavy riffs, distortion, Frozen Steam-stijl" },
  { id: "nu_metal_country", label: "Nu-Metal Country", description: "Limp Bizkit/Linkin Park meets country — rap-rock, DJ, screams" },
  { id: "industrial_country", label: "Industrial Country", description: "Zware synths, industrial beats, donker en agressief" },
  { id: "alt_rock_country", label: "Alt-Rock Country", description: "Alternative rock met country twang, emotioneel en heavy" },
  { id: "country_soul", label: "Country Soul / R&B", description: "Smooth vocals, gospel invloeden, warm" },
  { id: "comedy_country", label: "Comedy Country", description: "Humor, zelfspot, tongue-in-cheek storytelling" },
  { id: "acoustic_stripped", label: "Stripped / Acoustic", description: "Minimaal, puur, stem + gitaar" },
];

// Artist inspiratie — vertaald naar Suno-vriendelijke beschrijvingen
const artistGroups = [
  {
    label: "Country & Americana",
    artists: [
      { name: "Chris Stapleton", suno: "soulful country-blues, raw whiskey-soaked male vocals, blues-rock guitar, gritty Americana", tooltip: "Rauwe soul-country, blues invloeden" },
      { name: "Zach Bryan", suno: "raw folk-country, emotional storytelling, lo-fi acoustic production, heartland rock", tooltip: "Rauwe folk, emotioneel, lo-fi" },
      { name: "Luke Combs", suno: "warm baritone country, everyman storytelling, beer-drinking anthems, modern traditional", tooltip: "Warme stem, herkenbare verhalen" },
      { name: "Morgan Wallen", suno: "modern country with melodic hooks, southern charm, party country vibes", tooltip: "Moderne country, catchy hooks" },
      { name: "Kane Brown", suno: "country-pop crossover, smooth R&B influenced vocals, modern pop-country production", tooltip: "Country-pop, R&B invloeden" },
      { name: "Jordan Davis", suno: "laid-back modern country, warm male vocals, feel-good storytelling, mid-tempo groove", tooltip: "Relaxte country, feel-good" },
      { name: "Hardy", suno: "country-rock with hard edge, aggressive male vocals, heavy guitar-driven country", tooltip: "Harde country-rock, agressief" },
      { name: "Jelly Roll", suno: "country-rap, emotional storytelling, redemption themes, rough-edged vocals", tooltip: "Country-rap, emotioneel, redemptie" },
      { name: "Tyler Childers", suno: "Appalachian country, bluegrass-influenced, raw authentic vocals, fiddle-driven", tooltip: "Authentieke Appalachian country" },
      { name: "Cody Jinks", suno: "traditional outlaw country, deep baritone, honky-tonk storytelling, no-frills production", tooltip: "Traditionele outlaw country" },
      { name: "Johnny Cash", suno: "deep bass outlaw country, boom-chicka-boom rhythm, dark storytelling, acoustic simplicity", tooltip: "De godfather van outlaw country" },
      { name: "Hank Williams Jr", suno: "rowdy southern rock-country, outlaw attitude, heavy guitar, party anthems", tooltip: "Rowdy southern rock meets country" },
      { name: "Sturgill Simpson", suno: "psychedelic country-rock, genre-bending Americana, progressive country, synth layers", tooltip: "Psychedelische progressive country" },
    ],
  },
  {
    label: "Rock & Metal",
    artists: [
      { name: "Linkin Park", suno: "alternative rock with electronic elements, emotional screaming and melodic choruses, heavy guitar riffs with synthesizer layers, rap-rock verses", tooltip: "Alt-rock, elektronisch, schreeuwen + melodie" },
      { name: "Limp Bizkit", suno: "nu-metal rap-rock, aggressive groove metal, DJ scratches and turntables, rap verses over heavy guitar riffs, bouncy aggressive energy", tooltip: "Nu-metal rap-rock, agressieve groove" },
      { name: "Rammstein", suno: "German industrial metal, heavy electronic percussion, aggressive deep male vocals, dark theatrical production, pounding rhythms", tooltip: "Industrial metal, theatraal, zwaar" },
      { name: "Metallica", suno: "thrash metal, complex guitar arrangements, powerful palm-muted riffs, epic song structures, dual guitar harmonies", tooltip: "Thrash metal, epische riffs" },
      { name: "Five Finger Death Punch", suno: "heavy metal with melodic choruses, aggressive verse vocals, military-inspired themes, powerful breakdowns", tooltip: "Heavy metal, melodieuze refreinen" },
      { name: "Volbeat", suno: "heavy metal with rockabilly and country influences, melodic metal, Elvis-inspired vocals over heavy riffs", tooltip: "Metal met rockabilly/country twist" },
      { name: "Nickelback", suno: "post-grunge rock, anthemic choruses, heavy guitar riffs, emotional male vocals, arena rock production", tooltip: "Post-grunge, anthemische refreinen" },
      { name: "Breaking Benjamin", suno: "alternative metal, dark atmospheric rock, emotional male vocals alternating with heavy screams, cinematic production", tooltip: "Alternatieve metal, cinematisch" },
      { name: "Disturbed", suno: "heavy metal with powerful dramatic vocals, aggressive down-tuned guitars, intense building dynamics", tooltip: "Heavy metal, dramatische vocals" },
      { name: "Shinedown", suno: "hard rock with emotional depth, powerful male vocals, anthemic arena rock, dynamic loud-quiet contrast", tooltip: "Hard rock, emotioneel, arena-waardig" },
      { name: "Godsmack", suno: "groove metal, tribal percussion, heavy down-tuned riffs, aggressive male vocals", tooltip: "Groove metal, tribal drums" },
      { name: "Avenged Sevenfold", suno: "metalcore meets classic metal, virtuoso guitar solos, dramatic compositions, operatic metal vocals", tooltip: "Metalcore, virtuoze gitaar" },
    ],
  },
  {
    label: "Crossover & Fusion",
    artists: [
      { name: "Post Malone", suno: "genre-blending, melodic rap-singing, emotional pop-rock with hip-hop beats, atmospheric production", tooltip: "Genre-blending, melodisch, emotioneel" },
      { name: "Redferrin", suno: "country-trap fusion, smooth R&B vocals over southern rap energy, modern country-rap blend", tooltip: "Country-trap, R&B meets country" },
      { name: "Upchurch", suno: "country-rap, redneck hip-hop, southern rock with rap verses, outlaw party energy", tooltip: "Country-rap, redneck hip-hop" },
      { name: "Struggle Jennings", suno: "outlaw country-rap, dark storytelling, gritty vocals, southern hip-hop with country soul", tooltip: "Outlaw country-rap, donker" },
      { name: "Whiskey Myers", suno: "southern rock Americana, heavy blues-influenced guitars, gritty vocals, Texas rock energy", tooltip: "Southern rock, Texas blues" },
      { name: "Blackberry Smoke", suno: "southern rock with country heart, jam band elements, classic rock guitar tones, warm harmonies", tooltip: "Southern rock, jam band vibes" },
    ],
  },
];

const allArtists = artistGroups.flatMap((g) => g.artists);

const moodOptions = [
  { id: "Emotional", tooltip: "Diep gevoel, raakt je in het hart" },
  { id: "Introspective", tooltip: "Naar binnen gekeerd, nadenkend over jezelf" },
  { id: "Hopeful", tooltip: "Hoopvol, licht aan het einde van de tunnel" },
  { id: "Confident", tooltip: "Zelfverzekerd, weten wie je bent" },
  { id: "Wild", tooltip: "Ongecontroleerd, vrij, losgeslagen" },
  { id: "Energetic", tooltip: "Vol energie, opzwepend" },
  { id: "Anthemic", tooltip: "Stadion-waardig, meezingbaar, groots" },
  { id: "Sad", tooltip: "Verdrietig, melancholisch" },
  { id: "Haunting", tooltip: "Spookachtig mooi, blijft hangen" },
  { id: "Intimate", tooltip: "Intiem, alsof je fluistert tegen \u00e9\u00e9n persoon" },
  { id: "Raw", tooltip: "Rauw, ongepolijst, recht uit het hart" },
  { id: "Defiant", tooltip: "Opstandig, rebels, ik doe het op mijn manier" },
  { id: "Nostalgic", tooltip: "Terugkijkend, herinneringen, vroeger" },
  { id: "Bittersweet", tooltip: "Zoet en pijnlijk tegelijk" },
  { id: "Triumphant", tooltip: "Zegevierend, overwinnend, glorieus" },
  { id: "Playful", tooltip: "Speels, luchtig, vrolijk" },
  { id: "Gritty", tooltip: "Ruw, vuil, straatgevoel" },
  { id: "Tender", tooltip: "Teder, zacht, liefdevol" },
  { id: "Dark", tooltip: "Duister, zwaar, somber" },
  { id: "Uplifting", tooltip: "Opbeurend, positief, motiverend" },
  { id: "Funny", tooltip: "Grappig, komisch, lachen" },
  { id: "Sarcastic", tooltip: "Sarcastisch, droog, tongue-in-cheek" },
  { id: "Self-deprecating", tooltip: "Zelfspot, lachen om jezelf" },
  { id: "Tongue-in-cheek", tooltip: "Niet helemaal serieus, knipoog" },
  { id: "Rowdy", tooltip: "Ruig, luidruchtig, barroom energy" },
  { id: "Reflective", tooltip: "Bezinnend, rustig terugkijkend" },
  { id: "Empowering", tooltip: "Krachtig, inspirerend, geeft je moed" },
];

const tempoOptions = [
  { id: "ballad", label: "Ballad", bpm: "55-65 BPM", description: "Emotionele ballads, trouwmuziek, luisternummers", audience: "Luisteraars, Spotify playlists", tooltip: "Denk: 'Wealthiest Man', 'Custody War' — langzaam, emotioneel, elk woord telt" },
  { id: "slow_country", label: "Slow Country", bpm: "66-78 BPM", description: "Classic country, storytelling, campfire songs", audience: "Country puristen, singer-songwriter fans", tooltip: "Denk: Chris Stapleton 'Tennessee Whiskey' — relaxed maar met gevoel" },
  { id: "waltz", label: "Country Waltz", bpm: "75-90 BPM (3/4)", description: "Driekwartsmaat, romantisch, traditioneel", audience: "Trouwfeesten, traditionele country fans", tooltip: "3/4 maat — klassieke wals, romantisch dansen" },
  { id: "mid_tempo", label: "Mid-tempo Groove", bpm: "79-95 BPM", description: "Laid-back country, cruise muziek, chill vibes", audience: "Breed publiek, radio-friendly", tooltip: "Denk: 'Better Than Before' — comfortabel tempo, brede appeal" },
  { id: "shuffle", label: "Country Shuffle", bpm: "90-110 BPM", description: "Swingend, laid-back groove, honky tonk", audience: "Country bars, dansvloer", tooltip: "Dat typische shuffelende country-gevoel, lekker swingen" },
  { id: "line_dance", label: "Line Dance", bpm: "96-115 BPM", description: "Two-step, honky-tonk, line dance nummers", audience: "Country bars, line dance community, festivals", tooltip: "Perfect voor line dance choreografie — steady beat, duidelijke structuur" },
  { id: "uptempo_country", label: "Uptempo Country", bpm: "116-128 BPM", description: "Energieke country, truck songs, party anthems", audience: "Festivals, tailgate parties, workout playlists", tooltip: "Denk: Luke Bryan 'Country Girl' — energie, feest, zomer" },
  { id: "country_rock", label: "Country Rock", bpm: "128-145 BPM", description: "Southern rock, driving country, stadium anthems", audience: "Rock crossover, festival headliners", tooltip: "Denk: 'Welcome To My Country' — volle bak energy, gitaarsolos" },
  { id: "bluegrass_fast", label: "Fast Bluegrass", bpm: "140-180 BPM", description: "Snel geplukte banjo/mandoline, traditional pickin'", audience: "Bluegrass fans, folk festivals", tooltip: "Snelle vingerwerk, traditioneel maar opwindend" },
  { id: "country_metal", label: "Country Metal", bpm: "145-180 BPM", description: "Metal fusion, heavy country, mosh pit energy", audience: "Frozen Steam fans, rock/metal crossover", tooltip: "Denk: Frozen Steam live — heavy, snel, headbangen" },
  { id: "trap_country", label: "Trap Country", bpm: "75-85 BPM (half-time)", description: "808s, half-time groove, moderne country-rap", audience: "Jongere doelgroep, hip-hop crossover", tooltip: "Denk: 'That Line' — langzame beat maar met trap-energy eroverheen" },
  { id: "country_funk", label: "Country Funk", bpm: "95-115 BPM", description: "Groovy, funky bass, ritmische country", audience: "Crossover publiek, dansvloer", tooltip: "Country meets funk — groovy basslijnen, lekker bewegen" },
];

const instruments: Record<string, string[]> = {
  emotional_ballad: [
    "Acoustic Ballad", "Clean Fingerpicked Guitar", "Warm Piano Accents",
    "Brush Drums", "Fiddle Support", "Pedal Steel Swells", "Layered Strings",
    "Slide Guitar Interlude", "Ambient Pads", "Hammond Organ", "Cello Accents",
    "Gentle Acoustic Outro", "Weeping Steel Guitar", "Harp Accents",
    "Mandolin Tremolo", "Dobro", "Upright Bass",
  ],
  rebel_party: [
    "Electric Guitar Riffs", "Southern Slide Guitar", "Banjo",
    "Fiddle Fills", "Kickin' Drum Groove", "Guitar Solo Section",
    "Southern Rock Guitar Riff", "Stomp-Clap Build", "Harmonica", "Driving Bass",
    "Mandolin", "Tambourine", "Cowbell",
  ],
  dark_country: [
    "Slide Guitar", "Fiddle Layer", "Blues Rock Rhythm", "Brush Drums",
    "Drop D Tuning", "Pedal Steel", "Ambient Pads", "Stripped Bridge",
    "Dobro", "Low Piano Notes", "Dark Acoustic Guitar", "Upright Bass",
    "Harp Undertones",
  ],
  country_trap: [
    "Deep 808 Bass", "Twangy Guitars", "Banjo Layer", "Half-Time Groove",
    "Country Flow", "Dirty Guitar Slide", "Fiddle Fade", "Trap Hi-Hats",
    "Synth Pads", "Auto-Tune Vocal Layer",
  ],
  country_rock: [
    "Overdriven Electric Guitar", "Power Drums", "Southern Slide Guitar",
    "Bass Guitar Drive", "Fiddle Screech", "Guitar Solo", "Hammond Organ",
    "Stomp-Clap Build", "Distortion Pedal", "Banjo", "Mandolin",
  ],
  country_pop: [
    "Clean Electric Guitar", "Pop Drums", "Acoustic Strum Pattern",
    "Light Fiddle", "Banjo Accent", "Bass Groove", "Tambourine",
    "Background Harmonies", "Bright Piano", "Mandolin", "Harp",
  ],
  honky_tonk: [
    "Honky Tonk Piano", "Twangy Telecaster", "Fiddle", "Pedal Steel",
    "Upright Bass", "Brushed Snare", "Banjo", "Western Swing Guitar",
  ],
  bluegrass: [
    "Banjo (Scruggs Style)", "Mandolin", "Fiddle", "Acoustic Guitar (Flatpick)",
    "Upright Bass", "Dobro", "Harmonica", "Dulcimer",
  ],
  country_blues: [
    "Slide Guitar", "Blues Harp", "Fingerpicked Acoustic", "Brush Drums",
    "Upright Bass", "Hammond Organ", "Pedal Steel", "Dobro",
  ],
  red_dirt: [
    "Acoustic Guitar (Heavy Strum)", "Electric Guitar Crunch", "Fiddle",
    "Pedal Steel", "Bass Guitar", "Kick Drum Heavy", "Harmonica",
    "Mandolin", "Banjo",
  ],
  country_metal: [
    "Distorted Electric Guitar", "Double Kick Drums", "Bass Guitar (Drop Tuning)",
    "Banjo (Distorted)", "Fiddle Screech", "Slide Guitar (Heavy)",
    "Power Chords", "Breakdown Section",
  ],
  nu_metal_country: [
    "Down-tuned Guitar Riffs", "DJ Scratches", "Turntable Effects",
    "Rap Verses", "Heavy Bass Drop", "Electronic Percussion",
    "Distorted Banjo", "Country Twang Guitar (Clean)", "Screamed Vocals Section",
    "Double Kick Drums", "Wah Pedal Guitar", "808 Sub Bass",
  ],
  industrial_country: [
    "Industrial Synth Bass", "Electronic Percussion", "Distorted Guitar Wall",
    "Dark Ambient Pads", "Pounding Four-on-Floor Kick", "Slide Guitar (Processed)",
    "Banjo (Through Distortion)", "Heavy Reverb Vocals", "Noise Textures",
  ],
  alt_rock_country: [
    "Overdriven Electric Guitar", "Dynamic Drums (Quiet-Loud)", "Pedal Steel (Atmospheric)",
    "Bass Guitar", "Fiddle (Ethereal)", "Piano (Dark Chords)",
    "Reverb-Heavy Production", "Guitar Feedback", "Banjo Accents",
  ],
  country_soul: [
    "Warm Piano", "Hammond B3 Organ", "Gospel Choir Backing",
    "Smooth Bass", "Brush Drums", "Pedal Steel", "Strings Section",
    "Horns (Trumpet/Sax)", "Harp",
  ],
  comedy_country: [
    "Banjo", "Fiddle", "Acoustic Guitar", "Kazoo",
    "Washboard", "Tambourine", "Cowbell", "Honky Tonk Piano",
  ],
  acoustic_stripped: [
    "Fingerpicked Acoustic Guitar", "Light Brushed Drums", "Upright Bass",
    "Soft Fiddle", "Mandolin", "Harp", "Gentle Piano",
  ],
};

// Thema's gegroepeerd per categorie voor overzicht
const themeGroups = [
  {
    label: "Vaderschap & Familie",
    themes: [
      "Vader die zijn dochter ziet opgroeien",
      "Bedtime routine met de kids",
      "Co-ouderschap na scheiding",
      "Eerste schooldag / loslaten",
      "Weekendvader die er altijd is",
      "Brief aan mijn kinderen",
      "Familietradities doorgeven",
    ],
  },
  {
    label: "Persoonlijke Groei & Kracht",
    themes: [
      "Opstaan na een dieptepunt",
      "De man worden die je wilt zijn",
      "Vergeving — aan jezelf of anderen",
      "Lessen van je vader/moeder",
      "Oude demonen achter je laten",
      "Sterker uit een breuk komen",
      "Accepteren wie je bent",
    ],
  },
  {
    label: "Liefde & Relaties",
    themes: [
      "Eerste date die alles verandert",
      "Liefde op het tweede gezicht",
      "Lang samen, nog steeds verliefd",
      "De 'one that got away'",
      "Online daten in het country leven",
      "Trouwen op je eigen manier",
      "Liefde zonder voorwaarden",
    ],
  },
  {
    label: "Rebel & Lifestyle",
    themes: [
      "Outlaw die zijn eigen regels maakt",
      "Kleine jongen, grote dromen",
      "Nederlandse roots in een Amerikaans genre",
      "Feesten alsof er geen morgen is",
      "Authenticiteit boven perfectie",
      "Tegen de stroom in zwemmen",
      "De buitenstaander die het maakt",
    ],
  },
  {
    label: "Donker & Reflectief",
    themes: [
      "Eenzame nacht in een lege kamer",
      "Verslaving en de strijd ertegen",
      "Verlies van een dierbare",
      "Spijt en wat had kunnen zijn",
      "Het masker dat je draagt",
      "Nachtelijke autorit met je gedachten",
      "De stilte na de storm",
    ],
  },
  {
    label: "Thuiskomen & Dankbaarheid",
    themes: [
      "Thuiskomen na een lange dag",
      "Rijk zijn zonder geld",
      "De kleine dingen die ertoe doen",
      "Vrienden die er altijd zijn",
      "Je plek vinden in de wereld",
      "Een koude avond, een warm huis",
      "Dankbaar voor wat je hebt",
    ],
  },
];

const allThemes = themeGroups.flatMap((g) => g.themes);

// Suno weirdness presets
const weirdnessOptions = [
  { id: 0, label: "0% — Standaard", description: "Veilig, voorspelbaar, radio-ready" },
  { id: 10, label: "10% — Licht creatief", description: "Subtiele verrassingen" },
  { id: 20, label: "20% — Experimenteel", description: "Onverwachte wendingen" },
  { id: 30, label: "30% — Wild", description: "Genre-bending, verrassend" },
];

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

interface SavedOutput {
  id: string;
  suno_prompt: string;
  lyric_template: string;
  config_json: string;
  loved: boolean;
  created_at: string;
}

interface GeneratorConfig {
  selectedCategories: string[];
  selectedMoods: string[];
  selectedTempos: string[];
  selectedInstruments: string[];
  selectedThemes: string[];
  selectedArtists: string[];
  customTheme: string;
  avoided: string[];
  kept: string[];
  customNotes: string;
  weirdness: number;
  freshMode: boolean;
  songLength: "standaard" | "kort";
}

// Style of Music prompt — max 1000 tekens voor Suno
function buildStylePrompt(config: GeneratorConfig): string {
  const { selectedCategories, selectedMoods, selectedTempos, selectedInstruments, selectedArtists, weirdness, songLength } = config;

  const catLabels = selectedCategories.map(
    (id) => categories.find((c) => c.id === id)?.label || id
  );

  const styleGenres = [...catLabels, "Modern Americana", "Country", "Singer-Songwriter"];
  let prompt = `[Style of Music: ${styleGenres.join(", ")}]\n`;

  if (selectedMoods.length > 0) {
    prompt += `[Mood: ${selectedMoods.join(", ")}]\n`;
  }

  if (selectedTempos.length > 0) {
    const bpms = selectedTempos.map((id) => tempoOptions.find((t) => t.id === id)?.bpm).filter(Boolean);
    prompt += `[Tempo: ${bpms.join(", ")}]\n`;
  }

  if (selectedInstruments.length > 0) {
    prompt += `[Instruments: ${selectedInstruments.join(", ")}]\n`;
  }

  if (selectedArtists.length > 0) {
    const artistDescriptions = selectedArtists
      .map((name) => allArtists.find((a) => a.name === name)?.suno)
      .filter(Boolean);
    if (artistDescriptions.length > 0) {
      prompt += `[Inspired by: ${artistDescriptions.join("; ")}]\n`;
    }
  }

  prompt += `[Male Voice Only] [Baritone-Tenor] [Vocal Range: A2-G4]\n`;
  prompt += `[Warm gritty country baritone, chest voice dominant]\n`;

  if (songLength === "kort") {
    prompt += `[Duration: 2:30-3:15] [Short and punchy] [No extended solos]\n`;
  } else {
    prompt += `[Duration: 3:00-4:30] [Keep it concise]\n`;
  }

  if (weirdness > 0) {
    prompt += `[Weirdness: ${weirdness}%]\n`;
  }

  return prompt;
}

// Lyrics + metadata prompt — max 5000 tekens voor Suno
function buildLyricsPrompt(config: GeneratorConfig): string {
  const { selectedCategories, selectedThemes, customTheme, avoided, kept, customNotes, freshMode, songLength } = config;

  const primary = selectedCategories[0] || "emotional_ballad";
  let prompt = buildLyricTemplate(primary, songLength);

  // Thema als context bovenaan
  const allSelectedThemes = [...selectedThemes];
  if (customTheme.trim()) allSelectedThemes.push(customTheme.trim());
  if (allSelectedThemes.length > 0) {
    prompt = `[Theme: ${allSelectedThemes.join(", ")}]\n\n` + prompt;
  }

  // Woordvoorkeuren alleen als Fresh Mode uit staat
  if (!freshMode) {
    if (avoided.length > 0) {
      prompt += `\n\n[VERMIJD: ${avoided.join(", ")}]`;
    }
    if (kept.length > 0) {
      prompt += `\n[Trademark: ${kept.join(", ")}]`;
    }
  }

  if (customNotes) {
    prompt += `\n\n[Extra: ${customNotes}]`;
  }

  return prompt;
}

// Backwards-compatible combined prompt for saving
function buildSunoPrompt(config: GeneratorConfig): string {
  return buildStylePrompt(config) + "\n" + buildLyricsPrompt(config);
}

// Kort & Krachtig templates — 6 secties, strakke structuur
function buildShortTemplate(category: string): string {
  const categoryIntros: Record<string, string> = {
    emotional_ballad: "[4-bar Fingerpicked Guitar] [Soft Start]",
    rebel_party: "[4-bar Guitar Riff] [Driving Drums]",
    dark_country: "[4-bar Slide Guitar] [Dark Atmosphere]",
    country_trap: "[4-bar 808 + Twangy Guitar]",
    country_rock: "[4-bar Electric Guitar] [Power Drums]",
    country_pop: "[4-bar Clean Guitar] [Bright Feel]",
    honky_tonk: "[4-bar Honky Tonk Piano] [Two-Step Beat]",
    bluegrass: "[4-bar Banjo Pick] [Acoustic Drive]",
    country_blues: "[4-bar Slide Guitar] [Blues Groove]",
    red_dirt: "[4-bar Heavy Acoustic Strum] [Gritty]",
    country_metal: "[4-bar Heavy Riff] [Double Kick]",
    nu_metal_country: "[4-bar Down-tuned Riff] [Electronic Beat]",
    industrial_country: "[4-bar Industrial Synth Pulse]",
    alt_rock_country: "[4-bar Atmospheric Guitar]",
    country_soul: "[4-bar Warm Piano] [Smooth Groove]",
    comedy_country: "[4-bar Banjo] [Light Arrangement]",
    acoustic_stripped: "[4-bar Fingerpicked Guitar]",
  };

  const intro = categoryIntros[category] || "[4-bar Intro]";

  return `[Intro]
${intro}

[Verse 1]


[Chorus]


[Verse 2]


[Chorus]


[Bridge]
[Stripped Back] [Build to Final]


[Final Chorus]
[Key Change - Half Step Up] [Full Energy]


[Outro]
[Short Fade]`;
}

function buildLyricTemplate(category: string, songLength: "standaard" | "kort" = "standaard"): string {
  // Kort & Krachtig: compacte structuur voor alle categorieën
  if (songLength === "kort") {
    return buildShortTemplate(category);
  }

  if (category === "emotional_ballad") {
    return `[Intro]
[8-bar Fingerpicked Acoustic Guitar] [Fiddle Melody] [Warm Piano]

[Verse 1]


[Verse 2]


[Pre-Chorus]


[Chorus]


[Verse 3]


[Pre-Chorus]


[Chorus]


[Instrumental Break]
[8-bar Pedal Steel + Fiddle + Acoustic Guitar]

[Bridge]
[Key Change Up] [Stripped Back — Voice + Piano Only] [Different Rhythm Than Chorus]


[Final Chorus]
[Key Change - Half Step Up] [Soaring Final Chorus] [Full Band Build]


[Outro]
[Short Fingerpicked Guitar Outro] [Soft Fiddle Fade]`;
  }

  if (category === "rebel_party") {
    return `[Intro]
[8-bar Southern Rock Guitar Riff] [Banjo Underlayer] [Driving Drums]

[Verse 1]


[Pre-Chorus]


[Chorus]
[Power Chorus] [Full Band Energy]


[Verse 2]


[Pre-Chorus]


[Chorus]


[Instrumental Break]
[8-bar Guitar Solo] [Fiddle/Slide Guitar Duel] [Stomp-Clap Build]

[Bridge]
[Half-time Feel] [Drop to Acoustic Only] [Contrast with chorus energy]


[Final Chorus]
[Key Change - Half Step Up] [Soaring Final Chorus] [Maximum Energy] [Double-time drums]


[Outro]
[8-bar Electric Guitar Fade] [Banjo Echo] [Final Drum Hit]`;
  }

  if (category === "dark_country") {
    return `[Intro]
[8-bar Slide Guitar] [Brush Drums] [Dark, Moody Atmosphere]

[Verse 1]


[Verse 2]


[Pre-Chorus]


[Chorus]
[Heavy Emotional Delivery]


[Instrumental Break]
[Slide Guitar Solo - 8 bars] [Pedal Steel Swells]

[Verse 3]


[Pre-Chorus]


[Chorus]


[Bridge]
[Stripped Back - Voice + Guitar Only] [Tempo Slows] [Key Change Down]


[Final Chorus]
[Key Change - Half Step Up] [Stripped to Full Band Build] [Original Tempo Returns]


[Outro]
[Slide Guitar Fade] [Single Drum Hit] [Fiddle Trail] [Silence]`;
  }

  if (category === "country_trap") {
    return `[Intro]
[8-bar 808 Beat + Twangy Guitar]

[Verse 1]
[Country Flow + Outlaw Rap Groove]


[Pre-Chorus]
[Melodic Country Rock Build]


[Chorus]
[Big Rock Chorus] [Southern Energy]


[Instrumental Break]
[808 Beat + Twangy Guitar - 8 bars]

[Verse 2]
[Melodic Flow] [Banjo Layer]


[Pre-Chorus]
[Half-Time Groove]


[Chorus]
[Anthemic Country Rock]


[Bridge]
[Stripped — Voice + Slide Guitar Only] [Beat Drops Out]


[Final Chorus]
[Key Change - Half Step Up] [Soaring Southern Rock] [Guitar Solo Lead-In] [Full 808 + Band Combined]


[Outro]
[Fiddle Fade] [Dirty Guitar Slide] [808 Fade]`;
  }

  if (category === "country_rock") {
    return `[Intro]
[8-bar Overdriven Electric Guitar] [Power Drums] [Southern Energy]

[Verse 1]


[Pre-Chorus]


[Chorus]
[Power Chorus] [Stadium Energy] [Driving Rhythm]


[Verse 2]


[Pre-Chorus]


[Chorus]


[Instrumental Break]
[8-bar Guitar Solo] [Southern Slide Guitar] [Hammond Organ Swells]

[Bridge]
[Drop to Acoustic]


[Final Chorus]
[Key Change - Half Step Up] [Full Band Maximum Volume] [Soaring Vocals]


[Outro]
[Guitar Solo Fade] [Feedback Trail] [Final Power Chord]`;
  }

  if (category === "nu_metal_country") {
    return `[Intro]
[Heavy Down-tuned Guitar Riff] [Electronic Percussion] [Building Tension]

[Verse 1]
[Melodic Aggressive Vocal over Heavy Guitars]


[Pre-Chorus]
[Melodic Transition] [Building to Explosion]


[Chorus]
[Screamed/Sung Melodic Chorus] [Full Band Assault] [Country Twang Guitar Accent]


[Verse 2]
[More Intensity] [DJ Scratches] [Distorted Banjo Accent]


[Pre-Chorus]


[Chorus]


[Breakdown]
[Half-time Breakdown] [Muted Guitars] [Country Slide Guitar over Metal Chug]


[Bridge]
[Stripped to Acoustic Country]


[Final Chorus]
[Key Change - Half Step Up] [Maximum Intensity] [All Elements Combined]


[Outro]
[Feedback] [Final Power Chord] [Country Guitar Lick Fade]`;
  }

  if (category === "industrial_country") {
    return `[Intro]
[Industrial Synth Pulse] [Mechanical Beat Building] [Dark Atmosphere]

[Verse 1]
[Sung over Industrial Beat]


[Pre-Chorus]
[Building Electronic Layers]


[Chorus]
[Full Industrial Power] [Melodic Country Vocal over Electronic Assault]


[Instrumental Break]
[Industrial Beat + Processed Slide Guitar - 8 bars]

[Verse 2]


[Chorus]


[Bridge]
[Stripped to Distorted Banjo + Vocal]


[Final Chorus]
[Key Change - Half Step Up] [Everything Combined] [Maximum Wall of Sound]


[Outro]
[Industrial Beat Decay] [Single Country Guitar Note Sustain]`;
  }

  if (category === "alt_rock_country") {
    return `[Intro]
[Atmospheric Guitar Layers] [Soft Drums] [Pedal Steel Undertone]

[Verse 1]
[Quiet, Intimate Delivery]


[Verse 2]
[Slightly Louder, More Drive]


[Pre-Chorus]
[Dynamic Build]


[Chorus]
[LOUD] [Full Distortion + Country Fiddle]


[Verse 3]
[Back to Quiet] [Just Voice + Clean Guitar]


[Pre-Chorus]


[Chorus]
[Even Louder Than Before]


[Bridge]
[Atmospheric] [Reverb-Heavy] [Ethereal Fiddle]


[Final Chorus]
[Key Change - Half Step Up] [Maximum Dynamic] [Everything Cranked] [Pedal Steel Screaming]


[Outro]
[Slow Fade to Acoustic] [Single Guitar Note]`;
  }

  // country_pop
  return `[Intro]
[4-bar Clean Guitar + Light Drums] [Bright, Radio-Ready Feel]

[Verse 1]


[Pre-Chorus]


[Chorus]
[Bright Chorus] [Singable Hook] [Background Harmonies]


[Verse 2]


[Pre-Chorus]


[Chorus]


[Instrumental Break]
[8-bar Acoustic + Fiddle] [Light Touch]

[Bridge]


[Final Chorus]
[Key Change - Half Step Up] [Full Production] [Layered Harmonies]


[Outro]
[Acoustic Guitar Fade]`;
}

export function GeneratorTab() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["emotional_ballad"]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Emotional", "Hopeful"]);
  const [selectedTempos, setSelectedTempos] = useState<string[]>(["slow_country"]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [expandedArtistGroup, setExpandedArtistGroup] = useState<string | null>(null);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [customTheme, setCustomTheme] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [weirdness, setWeirdness] = useState(0);
  const [avoided, setAvoided] = useState<string[]>([]);
  const [kept, setKept] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [savedOutputs, setSavedOutputs] = useState<SavedOutput[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [expandedThemeGroup, setExpandedThemeGroup] = useState<string | null>("all");
  const [freshMode, setFreshMode] = useState(false);
  const [songLength, setSongLength] = useState<"standaard" | "kort">("standaard");
  const [generatedLyrics, setGeneratedLyrics] = useState("");
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);

  const loadSavedOutputs = useCallback(async () => {
    const { data } = await supabase
      .from("generator_outputs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSavedOutputs(data);
  }, []);

  useEffect(() => {
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
    loadSavedOutputs();
  }, [loadSavedOutputs]);

  const availableInstruments = Array.from(
    new Set(selectedCategories.flatMap((cat) => instruments[cat] || []))
  );

  const currentConfig: GeneratorConfig = {
    selectedCategories,
    selectedMoods,
    selectedTempos,
    selectedInstruments,
    selectedThemes,
    selectedArtists,
    customTheme,
    avoided,
    kept,
    customNotes,
    weirdness,
    freshMode,
    songLength,
  };

  const stylePrompt = buildStylePrompt(currentConfig);
  const lyricsPrompt = buildLyricsPrompt(currentConfig);
  const sunoPrompt = buildSunoPrompt(currentConfig);
  const primaryCategory = selectedCategories[0] || "emotional_ballad";
  const lyricTemplate = buildLyricTemplate(primaryCategory, songLength);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const saveOutput = async () => {
    const { error } = await supabase.from("generator_outputs").insert({
      suno_prompt: sunoPrompt,
      lyric_template: lyricTemplate,
      config_json: JSON.stringify(currentConfig),
      loved: false,
    });
    if (!error) {
      loadSavedOutputs();
    }
  };

  const toggleLove = async (id: string, current: boolean) => {
    await supabase.from("generator_outputs").update({ loved: !current }).eq("id", id);
    loadSavedOutputs();
  };

  const deleteOutput = async (id: string) => {
    await supabase.from("generator_outputs").delete().eq("id", id);
    loadSavedOutputs();
  };

  const loadConfig = (configJson: string | object) => {
    try {
      const config = typeof configJson === "string" ? JSON.parse(configJson) : configJson;
      setSelectedCategories(config.selectedCategories || []);
      setSelectedMoods(config.selectedMoods || []);
      setSelectedTempos(config.selectedTempos || []);
      setSelectedInstruments(config.selectedInstruments || []);
      setSelectedThemes(config.selectedThemes || []);
      setCustomTheme(config.customTheme || "");
      setCustomNotes(config.customNotes || "");
      setWeirdness(config.weirdness || 0);
      setSelectedArtists(config.selectedArtists || []);
      setFreshMode(config.freshMode || false);
      setSongLength(config.songLength || "standaard");
      setShowOutput(false);
      setShowSaved(false);
      setGeneratedLyrics("");
    } catch (e) {
      console.error("loadConfig error:", e);
    }
  };

  const exportOptionsJson = () => {
    const json = {
      _info: "Erik Lindeman — Lyric & Suno Master Generator — Alle beschikbare opties",
      _instructions: "Kies uit onderstaande opties om een nieuwe song te configureren. Meerdere keuzes per categorie mogelijk. Geef je keuzes terug als JSON in dit format: {\"categories\": [\"id1\"], \"moods\": [\"Mood1\"], \"tempos\": [\"id1\"], \"themes\": [\"thema tekst\"], \"artists\": [\"Artist Name\"], \"instruments\": [\"Instrument\"], \"weirdness\": 0, \"customTheme\": \"\", \"notes\": \"extra context\"}",
      categories: categories.map((c) => ({ id: c.id, label: c.label, description: c.description })),
      moods: moodOptions.map((m) => ({ id: m.id, description: m.tooltip })),
      tempos: tempoOptions.map((t) => ({ id: t.id, label: t.label, bpm: t.bpm, description: t.description, audience: t.audience, example: t.tooltip })),
      themes: themeGroups.map((g) => ({ group: g.label, options: g.themes })),
      artists: artistGroups.map((g) => ({ group: g.label, artists: g.artists.map((a) => ({ name: a.name, style: a.tooltip, suno_translation: a.suno })) })),
      instruments_per_category: Object.fromEntries(
        categories.map((c) => [c.label, instruments[c.id] || []])
      ),
      weirdness_options: weirdnessOptions.map((w) => ({ percentage: w.id, label: w.label, description: w.description })),
      vocal_specs: { range: "A2-G4", type: "Baritone-Tenor", style: "Chest voice dominant, warm gritty country baritone, deep southern storytelling tone", constraints: "No falsetto, no belting above G4, must be singable live", note: "Suno blokkeert artiestennamen — gebruik alleen beschrijvingen in de prompt" },
      songwriting_rules: {
        highest_save_rates: "Vaderschap-thema's (gem. 7.9%)",
        best_practice: "Specifieke details > abstracte metaforen ('muddy sneakers by the rug' > 'love wrapped up in pain')",
        winning_pattern: "Kwetsbaarheid + kracht (begin met strijd, eindig met doorzetting)",
        avoid: "Geen IT/coder/developer referenties",
        party_songs: "Prima tussendoor maar niet als lead single",
      },
      catalog_stats: {
        top_songs: [
          { title: "Better Than Before", streams: "146K", save_rate: "4.89%" },
          { title: "The Man They Think I Am", streams: "109K", save_rate: "4.06%" },
          { title: "That Line", streams: "82K", save_rate: "3.99%" },
          { title: "Wealthiest Man", streams: "12K", save_rate: "7.67%" },
          { title: "Custody War", streams: "18K", save_rate: "5.71%" },
        ],
        monthly_listeners: "54K",
        total_streams_2026: "304K",
      },
    };
    const text = JSON.stringify(json, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedField("export");
    setTimeout(() => setCopiedField(null), 3000);
  };

  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [showInspire, setShowInspire] = useState(false);
  const [inspireSong, setInspireSong] = useState("");
  const [inspireArtist, setInspireArtist] = useState("");

  const importJson = () => {
    setImportError("");
    try {
      const data = JSON.parse(importText);

      // Support both direct config format and the "choices" wrapper format
      const config = data.choices || data.config || data;

      if (config.categories || config.selectedCategories) {
        setSelectedCategories(config.categories || config.selectedCategories || []);
      }
      if (config.moods || config.selectedMoods) {
        setSelectedMoods(config.moods || config.selectedMoods || []);
      }
      if (config.tempos || config.selectedTempos) {
        setSelectedTempos(config.tempos || config.selectedTempos || []);
      }
      if (config.instruments || config.selectedInstruments) {
        setSelectedInstruments(config.instruments || config.selectedInstruments || []);
      }
      if (config.themes || config.selectedThemes) {
        setSelectedThemes(config.themes || config.selectedThemes || []);
      }
      if (config.artists || config.selectedArtists) {
        setSelectedArtists(config.artists || config.selectedArtists || []);
      }
      if (config.customTheme) setCustomTheme(config.customTheme);
      if (config.customNotes || config.notes || config.extra) {
        setCustomNotes(config.customNotes || config.notes || config.extra || "");
      }
      if (config.weirdness !== undefined) setWeirdness(config.weirdness);

      setShowImport(false);
      setImportText("");
      setShowOutput(true);
    } catch {
      setImportError("Ongeldige JSON. Plak de output van je andere chat hier.");
    }
  };

  const generateInspirePrompt = () => {
    const optionsJson = {
      categories: categories.map((c) => c.id),
      moods: moodOptions.map((m) => m.id),
      tempos: tempoOptions.map((t) => t.id),
      themes: allThemes,
      artists: allArtists.map((a) => a.name),
      instruments: Array.from(new Set(Object.values(instruments).flat())),
      weirdness: [0, 10, 20, 30],
    };

    const prompt = `Ik ben Erik Lindeman, een Nederlandse country/Americana singer-songwriter. Ik wil een nummer maken geïnspireerd door "${inspireSong}" van ${inspireArtist || "onbekend"}.

BELANGRIJK: Dit wordt GEEN cover of vertaling. Ik wil de SFEER, ENERGIE en THEMATIEK van dit nummer vertalen naar mijn eigen stijl en een compleet nieuw, origineel nummer.

Analyseer het originele nummer op:
- Mood/sfeer
- Tempo en groove
- Instrumentatie
- Thematiek en emotie
- Dynamische opbouw (stille vs luide momenten)
- Wat maakt dit nummer speciaal/een hit?

Vertaal dat dan naar keuzes uit MIJN generator. Kies ALLEEN uit deze exacte opties:

${JSON.stringify(optionsJson, null, 2)}

REGELS:
- Geen IT/coder/developer referenties
- Zangbereik A2-G4 (warme baritone)
- Specifieke details > abstracte metaforen
- Kwetsbaarheid + kracht = winnende combo
- Vaderschap-thema's scoren het hoogst (7.9% save rate)

Geef je antwoord als JSON in dit EXACTE format (ik importeer dit direct in mijn generator):

{
  "categories": ["kies_ids_hierboven"],
  "moods": ["kies_moods_hierboven"],
  "tempos": ["kies_tempos_hierboven"],
  "themes": ["kies_themes_hierboven"],
  "artists": ["kies_artists_hierboven"],
  "instruments": ["kies_instruments_hierboven"],
  "weirdness": 0,
  "customTheme": "korte beschrijving van het thema in Erik's stijl",
  "notes": "wat maakt dit nummer speciaal en hoe vertaalt dat naar Erik's sound"
}

Geef ALLEEN de JSON terug, geen uitleg.`;

    navigator.clipboard.writeText(prompt);
    setCopiedField("inspire");
    setTimeout(() => setCopiedField(null), 3000);
  };

  const generateLyrics = async () => {
    setIsGeneratingLyrics(true);
    setGeneratedLyrics("");
    try {
      const res = await fetch("/api/generate-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stylePrompt,
          lyricTemplate: lyricsPrompt,
          songLength,
        }),
      });
      const data = await res.json();
      setGeneratedLyrics(data.lyrics || "Geen lyrics ontvangen.");
    } catch {
      setGeneratedLyrics("Fout bij het genereren van lyrics. Controleer je API key.");
    }
    setIsGeneratingLyrics(false);
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedMoods([]);
    setSelectedTempos([]);
    setSelectedInstruments([]);
    setSelectedThemes([]);
    setSelectedArtists([]);
    setCustomTheme("");
    setCustomNotes("");
    setWeirdness(0);
    setFreshMode(false);
    setSongLength("standaard");
    setShowOutput(false);
    setGeneratedLyrics("");
  };

  return (
    <div className="space-y-6">
      {/* Toggle between generator, saved, import */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSaved(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !showSaved ? "bg-accent text-white" : "bg-card text-muted hover:text-foreground border border-border"
          }`}
        >
          Generator
        </button>
        <button
          onClick={() => { setShowSaved(true); loadSavedOutputs(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showSaved ? "bg-accent text-white" : "bg-card text-muted hover:text-foreground border border-border"
          }`}
        >
          Opgeslagen ({savedOutputs.length})
        </button>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setShowInspire(!showInspire)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showInspire ? "bg-purple-900/30 text-purple-400 border border-purple-900/50" : "bg-card text-muted hover:text-foreground border border-border"
            }`}
          >
            Song Inspiratie
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-card text-red-400 hover:bg-red-900/20 border border-border"
          >
            Clear all
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showImport ? "bg-green-900/30 text-green-400 border border-green-900/50" : "bg-card text-muted hover:text-foreground border border-border"
            }`}
          >
            Importeer JSON
          </button>
          <button
            onClick={exportOptionsJson}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-card text-muted hover:text-foreground border border-border"
          >
            {copiedField === "export" ? "JSON gekopieerd!" : "Exporteer opties"}
          </button>
        </div>
      </div>

      {/* Import panel */}
      {showImport && (
        <div className="bg-card border border-green-900/50 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-green-400 mb-2">Importeer song configuratie</h3>
          <p className="text-xs text-muted mb-3">
            Plak de JSON van je andere chat hieronder. Ondersteunt formats als:<br />
            <code className="text-[10px] text-accent/70">{`{"categories": [...], "moods": [...], "tempos": [...], "artists": [...], ...}`}</code>
          </p>
          <textarea
            value={importText}
            onChange={(e) => { setImportText(e.target.value); setImportError(""); }}
            placeholder='Plak JSON hier...'
            rows={8}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:border-green-700 resize-none font-mono"
          />
          {importError && (
            <p className="text-xs text-red-400 mt-2">{importError}</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={importJson}
              className="px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 font-medium rounded-lg border border-green-900/50 transition-colors text-sm"
            >
              Importeer &amp; genereer
            </button>
            <button
              onClick={() => { setShowImport(false); setImportText(""); setImportError(""); }}
              className="px-4 py-2 text-muted hover:text-foreground text-sm"
            >
              Annuleer
            </button>
          </div>
        </div>
      )}

      {/* Song Inspiratie panel */}
      {showInspire && (
        <div className="bg-card border border-purple-900/50 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-purple-400 mb-2">Song Inspiratie</h3>
          <p className="text-xs text-muted mb-3">
            Vul een nummer in dat je vet vindt. Er wordt een prompt gegenereerd die je in een andere chat plakt.
            Die chat analyseert het nummer en geeft je een JSON terug die je kunt importeren in de generator.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Artiest</label>
              <input
                type="text"
                value={inspireArtist}
                onChange={(e) => setInspireArtist(e.target.value)}
                placeholder="Bijv. Lange Frans"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:border-purple-700"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Nummer</label>
              <input
                type="text"
                value={inspireSong}
                onChange={(e) => setInspireSong(e.target.value)}
                placeholder="Bijv. Hallo"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:border-purple-700"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generateInspirePrompt}
              disabled={!inspireSong.trim()}
              className="px-4 py-2 bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 font-medium rounded-lg border border-purple-900/50 transition-colors text-sm disabled:opacity-40"
            >
              {copiedField === "inspire" ? "Prompt gekopieerd!" : "Genereer & kopieer prompt"}
            </button>
            <button
              onClick={() => setShowInspire(false)}
              className="px-4 py-2 text-muted hover:text-foreground text-sm"
            >
              Annuleer
            </button>
          </div>
          {copiedField === "inspire" && (
            <div className="mt-3 bg-purple-950/20 border border-purple-900/30 rounded-lg p-3">
              <p className="text-xs text-purple-300">
                Prompt gekopieerd! Plak deze in ChatGPT, Gemini of Claude. Je krijgt een JSON terug die je via &quot;Importeer JSON&quot; kunt laden.
              </p>
            </div>
          )}
        </div>
      )}

      {showSaved ? (
        /* Saved outputs view */
        <div className="space-y-4">
          {savedOutputs.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted">Nog geen opgeslagen outputs. Genereer er een en klik op &quot;Opslaan&quot;.</p>
            </div>
          ) : (
            savedOutputs.map((output) => (
              <div key={output.id} className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLove(output.id, output.loved)}
                      className={`text-lg transition-colors ${
                        output.loved ? "text-red-500" : "text-muted hover:text-red-400"
                      }`}
                      title={output.loved ? "Unlike" : "Love"}
                    >
                      {output.loved ? "\u2764" : "\u2661"}
                    </button>
                    <span className="text-xs text-muted">
                      {new Date(output.created_at).toLocaleDateString("nl-NL", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadConfig(output.config_json)}
                      className="px-3 py-1 text-xs bg-accent/20 text-accent-light rounded hover:bg-accent/30 transition-colors"
                    >
                      Laad config
                    </button>
                    <button
                      onClick={() => copyToClipboard(output.suno_prompt, `saved-${output.id}`)}
                      className="px-3 py-1 text-xs bg-accent/20 text-accent-light rounded hover:bg-accent/30 transition-colors"
                    >
                      {copiedField === `saved-${output.id}` ? "Gekopieerd!" : "Kopieer"}
                    </button>
                    <button
                      onClick={() => deleteOutput(output.id)}
                      className="px-3 py-1 text-xs bg-red-900/20 text-red-400 rounded hover:bg-red-900/30 transition-colors"
                    >
                      Verwijder
                    </button>
                  </div>
                </div>
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background rounded-lg p-3 border border-border overflow-auto max-h-48">
                  {output.suno_prompt}
                </pre>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Generator view */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Configuration */}
          <div className="space-y-6">
            {/* Category */}
            <section className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-accent-light">Categorie</h3>
                <span className="text-xs text-muted">meerdere mogelijk</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategories(toggle(selectedCategories, cat.id))}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedCategories.includes(cat.id)
                        ? "border-accent bg-accent/10"
                        : "border-border hover:bg-card-hover"
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{cat.label}</p>
                    <p className="text-xs text-muted mt-0.5">{cat.description}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Themes - grouped */}
            <section className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-accent-light">Thema</h3>
                <span className="text-xs text-muted">{selectedThemes.length} geselecteerd</span>
              </div>
              <div className="space-y-2 mb-3">
                {themeGroups.map((group) => (
                  <div key={group.label}>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-background border border-border">
                      <span className="text-xs font-medium text-foreground">{group.label}</span>
                      {group.themes.filter((t) => selectedThemes.includes(t)).length > 0 && (
                        <span className="text-xs text-accent-light">
                          {group.themes.filter((t) => selectedThemes.includes(t)).length} geselecteerd
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-2">
                        {group.themes.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedThemes(toggle(selectedThemes, t))}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              selectedThemes.includes(t)
                                ? "bg-accent text-white"
                                : "bg-border text-muted hover:text-foreground"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Of typ een eigen thema..."
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent"
              />
            </section>

            {/* Mood */}
            <section className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-accent-light">Mood</h3>
                <span className="text-xs text-muted">meerdere mogelijk</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMoods(toggle(selectedMoods, mood.id))}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      selectedMoods.includes(mood.id)
                        ? "border-accent bg-accent/10"
                        : "border-border/50 hover:bg-card-hover"
                    }`}
                  >
                    <p className={`text-xs font-medium ${selectedMoods.includes(mood.id) ? "text-accent-light" : "text-foreground"}`}>{mood.id}</p>
                    <p className="text-[10px] text-muted mt-0.5">{mood.tooltip}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Artist Inspiratie */}
            <section className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-accent-light">Artist Inspiratie</h3>
                <span className="text-xs text-muted">{selectedArtists.length} geselecteerd — wordt Suno-safe vertaald</span>
              </div>
              <div className="space-y-2 mb-3">
                {artistGroups.map((group) => (
                  <div key={group.label}>
                    <button
                      onClick={() => setExpandedArtistGroup(expandedArtistGroup === group.label ? null : group.label)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-background border border-border hover:bg-card-hover transition-colors"
                    >
                      <span className="text-xs font-medium text-foreground">{group.label}</span>
                      <div className="flex items-center gap-2">
                        {group.artists.filter((a) => selectedArtists.includes(a.name)).length > 0 && (
                          <span className="text-xs text-accent-light">
                            {group.artists.filter((a) => selectedArtists.includes(a.name)).length}
                          </span>
                        )}
                        <span className="text-xs text-muted">
                          {expandedArtistGroup === group.label ? "\u25B2" : "\u25BC"}
                        </span>
                      </div>
                    </button>
                    {expandedArtistGroup === group.label && (
                      <div className="grid grid-cols-2 gap-1.5 mt-2 ml-2">
                        {group.artists.map((artist) => (
                          <button
                            key={artist.name}
                            onClick={() => setSelectedArtists(toggle(selectedArtists, artist.name))}
                            title={`Suno: ${artist.suno}`}
                            className={`p-2 rounded-lg border text-left transition-all ${
                              selectedArtists.includes(artist.name)
                                ? "border-accent bg-accent/10"
                                : "border-border/50 hover:bg-card-hover"
                            }`}
                          >
                            <p className="text-xs font-medium text-foreground">{artist.name}</p>
                            <p className="text-[10px] text-muted mt-0.5">{artist.tooltip}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {selectedArtists.length > 0 && (
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted mb-1 font-medium">Suno vertaling:</p>
                  <p className="text-[10px] text-accent/80 italic">
                    {selectedArtists
                      .map((name) => allArtists.find((a) => a.name === name)?.suno)
                      .filter(Boolean)
                      .join("; ")}
                  </p>
                </div>
              )}
            </section>

            {/* Tempo - with audience info */}
            <section className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-accent-light">Tempo &amp; Doelgroep</h3>
                <span className="text-xs text-muted">meerdere mogelijk</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {tempoOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTempos(toggle(selectedTempos, t.id))}
                    title={t.tooltip}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedTempos.includes(t.id)
                        ? "border-accent bg-accent/10"
                        : "border-border hover:bg-card-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <span className="text-xs text-accent-light font-mono">{t.bpm}</span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{t.description}</p>
                    <p className="text-xs text-muted/60 mt-0.5">Doelgroep: {t.audience}</p>
                    <p className="text-xs text-accent/60 mt-1 italic">{t.tooltip}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Instruments */}
            <section className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-accent-light">Instrumenten</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedInstruments([...availableInstruments])}
                    className="text-xs text-accent-light hover:text-accent transition-colors"
                  >
                    Alles
                  </button>
                  <span className="text-xs text-muted">|</span>
                  <button
                    onClick={() => setSelectedInstruments([])}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    Geen
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableInstruments.map((inst) => (
                  <button
                    key={inst}
                    onClick={() => setSelectedInstruments(toggle(selectedInstruments, inst))}
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

            {/* Song Length toggle */}
            <section className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-accent-light mb-3">Song Lengte</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSongLength("kort")}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    songLength === "kort"
                      ? "border-green-500 bg-green-900/20"
                      : "border-border hover:bg-card-hover"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">Kort &amp; Krachtig</p>
                  <p className="text-xs text-muted mt-0.5">2:30-3:15 — 6 secties, pakkend, meezingbaar</p>
                </button>
                <button
                  onClick={() => setSongLength("standaard")}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    songLength === "standaard"
                      ? "border-accent bg-accent/10"
                      : "border-border hover:bg-card-hover"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">Standaard</p>
                  <p className="text-xs text-muted mt-0.5">3:00-4:30 — 10+ secties, uitgebreider</p>
                </button>
              </div>
            </section>

            {/* Fresh Mode + Weirdness */}
            <section className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-accent-light">Creativiteit</h3>
              </div>
              {/* Fresh Mode toggle */}
              <button
                onClick={() => setFreshMode(!freshMode)}
                className={`w-full p-3 rounded-lg border text-left transition-all mb-3 ${
                  freshMode
                    ? "border-yellow-500 bg-yellow-900/20"
                    : "border-border hover:bg-card-hover"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Fresh Mode</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${freshMode ? "bg-yellow-500/20 text-yellow-400" : "bg-border text-muted"}`}>
                    {freshMode ? "AAN" : "UIT"}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">Schakelt trademark woorden en catalogus-invloed uit. Schone lei voor nieuwe creativiteit.</p>
              </button>
              <div className="grid grid-cols-2 gap-2">
                {weirdnessOptions.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWeirdness(w.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      weirdness === w.id
                        ? "border-accent bg-accent/10"
                        : "border-border hover:bg-card-hover"
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{w.label}</p>
                    <p className="text-xs text-muted mt-0.5">{w.description}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Word preferences — hidden in Fresh Mode */}
            {!freshMode && (avoided.length > 0 || kept.length > 0) && (
              <section className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-accent-light mb-3">Woordvoorkeuren</h3>
                {avoided.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-red-400 mb-1">Vermijden:</p>
                    <div className="flex flex-wrap gap-1">
                      {avoided.map((w) => (
                        <span key={w} className="px-2 py-0.5 rounded text-xs bg-red-950/30 text-red-400 border border-red-900/50">{w}</span>
                      ))}
                    </div>
                  </div>
                )}
                {kept.length > 0 && (
                  <div>
                    <p className="text-xs text-green-400 mb-1">Behouden:</p>
                    <div className="flex flex-wrap gap-1">
                      {kept.map((w) => (
                        <span key={w} className="px-2 py-0.5 rounded text-xs bg-green-950/30 text-green-400 border border-green-900/50">{w}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Custom notes */}
            <section className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-accent-light mb-3">Extra notities</h3>
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
              Genereer Suno Prompt &amp; Lyric Template
            </button>
          </div>

          {/* Right: Output */}
          <div className="space-y-6">
            {showOutput ? (
              <>
                {/* Save + Generate Lyrics buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={saveOutput}
                    className="flex-1 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 font-medium rounded-lg border border-green-900/50 transition-colors text-sm"
                  >
                    Opslaan in bibliotheek
                  </button>
                  <button
                    onClick={generateLyrics}
                    disabled={isGeneratingLyrics}
                    className="flex-1 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 font-medium rounded-lg border border-blue-900/50 transition-colors text-sm disabled:opacity-50"
                  >
                    {isGeneratingLyrics ? "Lyrics genereren..." : "Genereer Lyrics (ChatGPT)"}
                  </button>
                </div>

                {/* Status badges */}
                <div className="flex gap-2 flex-wrap">
                  {songLength === "kort" && (
                    <span className="px-2 py-1 text-xs rounded bg-green-900/20 text-green-400 border border-green-900/50">Kort &amp; Krachtig</span>
                  )}
                  {freshMode && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-900/20 text-yellow-400 border border-yellow-900/50">Fresh Mode</span>
                  )}
                </div>

                {/* Style of Music — max 1000 tekens */}
                <section className="bg-card border border-accent/30 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-accent-light">Style of Music (Suno)</h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono ${stylePrompt.length > 1000 ? "text-red-400 font-bold" : stylePrompt.length > 800 ? "text-yellow-400" : "text-muted"}`}>
                        {stylePrompt.length}/1000
                      </span>
                      <button
                        onClick={() => copyToClipboard(stylePrompt, "style")}
                        className="px-3 py-1 text-xs bg-accent/20 text-accent-light rounded hover:bg-accent/30 transition-colors"
                      >
                        {copiedField === "style" ? "Gekopieerd!" : "Kopieer"}
                      </button>
                    </div>
                  </div>
                  {stylePrompt.length > 1000 && (
                    <div className="mb-2 p-2 bg-red-950/30 border border-red-900/50 rounded text-xs text-red-400">
                      Te lang! Verwijder instrumenten of artiesten om onder 1000 tekens te komen.
                    </div>
                  )}
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background rounded-lg p-4 border border-border overflow-auto max-h-64">
                    {stylePrompt}
                  </pre>
                </section>

                {/* Lyrics + Metadata — max 5000 tekens */}
                <section className="bg-card border border-accent/30 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-accent-light">Lyrics + Metadata (Suno)</h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono ${lyricsPrompt.length > 5000 ? "text-red-400 font-bold" : lyricsPrompt.length > 4000 ? "text-yellow-400" : "text-muted"}`}>
                        {lyricsPrompt.length}/5000
                      </span>
                      <button
                        onClick={() => copyToClipboard(lyricsPrompt, "lyrics")}
                        className="px-3 py-1 text-xs bg-accent/20 text-accent-light rounded hover:bg-accent/30 transition-colors"
                      >
                        {copiedField === "lyrics" ? "Gekopieerd!" : "Kopieer"}
                      </button>
                    </div>
                  </div>
                  {lyricsPrompt.length > 5000 && (
                    <div className="mb-2 p-2 bg-red-950/30 border border-red-900/50 rounded text-xs text-red-400">
                      Te lang! Verwijder thema&apos;s of woordvoorkeuren om onder 5000 tekens te komen.
                    </div>
                  )}
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background rounded-lg p-4 border border-border overflow-auto max-h-96">
                    {lyricsPrompt}
                  </pre>
                </section>

                {/* Generated Lyrics from ChatGPT */}
                {(generatedLyrics || isGeneratingLyrics) && (
                  <section className="bg-card border border-blue-900/50 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-blue-400">Gegenereerde Lyrics (ChatGPT)</h3>
                      {generatedLyrics && (
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-mono ${generatedLyrics.length > 5000 ? "text-red-400 font-bold" : generatedLyrics.length > 4000 ? "text-yellow-400" : "text-muted"}`}>
                            {generatedLyrics.length}/5000
                          </span>
                          <button
                            onClick={() => copyToClipboard(generatedLyrics, "generated")}
                            className="px-3 py-1 text-xs bg-blue-900/20 text-blue-400 rounded hover:bg-blue-900/30 transition-colors"
                          >
                            {copiedField === "generated" ? "Gekopieerd!" : "Kopieer"}
                          </button>
                        </div>
                      )}
                    </div>
                    {isGeneratingLyrics ? (
                      <div className="flex items-center gap-3 p-4">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                        <span className="text-sm text-muted">ChatGPT schrijft lyrics...</span>
                      </div>
                    ) : (
                      <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background rounded-lg p-4 border border-border overflow-auto max-h-[600px]">
                        {generatedLyrics}
                      </pre>
                    )}
                  </section>
                )}

                {/* Tips */}
                <section className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-accent-light mb-3">Songwriting Tips</h3>
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
                      <span className="text-green-400 shrink-0">vocal</span>
                      Houd zang in A2-G4 range (warme baritone-tenor, comfortabel)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent-light shrink-0">let op</span>
                      Rebel/party nummers prima tussendoor, niet als lead single
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-400 shrink-0">niet</span>
                      Geen IT/coder/developer referenties in nieuwe nummers
                    </li>
                  </ul>
                </section>
              </>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-4 text-muted">🎸</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Configureer je nummer</h3>
                <p className="text-sm text-muted max-w-xs">
                  Alles is multiselect. Kies categorie, thema, mood, tempo en instrumenten.
                  Output komt in Suno-ready formaat met [brackets].
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
