import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { idea, availableOptions } = await request.json();

  const systemPrompt = `Je bent een muziekproducent en songwriter die songconfiguraties maakt voor Erik Lindeman, een Nederlandse country/Americana singer-songwriter.

Erik heeft een warme baritone stem (A2-G4), 54K monthly listeners op Spotify, en scoort het best met:
- Vaderschap-thema's (hoogste save rates, gem. 7.9%)
- Specifieke, beeldende details
- Kwetsbaarheid + kracht combinatie
- Geen IT/coder/developer referenties

Op basis van een song-idee kies je de BESTE opties uit de beschikbare keuzes. Kies realistisch — niet te veel opties, focus op wat past bij het idee.

REGELS:
- categories: kies 1-2 max
- moods: kies 2-4 max
- tempos: kies 1 max
- themes: kies 1-3 max (of laat leeg als customTheme beter past)
- artists: kies 0-3 max
- instruments: kies 4-8 max
- weirdness: 0, 10, 20, of 30
- styleInfluence: 0-100 (hoeveel % de style prompt de muziek beïnvloedt. Standaard 50. Hoger = meer volgens de style prompt, lager = meer creatieve vrijheid voor Suno)
- songLength: "kort" voor pakkende, simpele nummers, "standaard" voor uitgebreidere nummers
- customTheme: vrije tekst die het idee samenvat als thema
- notes: BELANGRIJK — als de gebruiker specifieke situaties, beelden, scènes of details noemt, zet die hier LETTERLIJK als bullet points. Bijvoorbeeld: als iemand zegt "biertje drinken, BBQ staat aan, kinderen rennen rond", dan komt dat hier als concrete songwriting-aanwijzingen. Dit veld wordt door de lyricschrijver gebruikt om de juiste beelden te kiezen.

Geef je antwoord als PURE JSON (geen markdown, geen uitleg).`;

  const userPrompt = `Song idee: "${idea}"

Beschikbare opties:
${JSON.stringify(availableOptions, null, 2)}

Geef een JSON object terug met deze exacte keys:
{
  "categories": ["id1"],
  "moods": ["Mood1", "Mood2"],
  "tempos": ["id1"],
  "themes": ["thema tekst"],
  "artists": ["Artist Name"],
  "instruments": ["Instrument1", "Instrument2"],
  "weirdness": 0,
  "styleInfluence": 50,
  "songLength": "kort",
  "customTheme": "beschrijving",
  "notes": "specifieke situaties en beelden uit het idee als bullet points"
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const raw = completion.choices[0]?.message?.content || "{}";

  // Strip markdown code blocks if present
  const cleaned = raw.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    const config = JSON.parse(cleaned);
    return NextResponse.json({ config });
  } catch {
    return NextResponse.json({ config: null, error: "Kon geen geldige configuratie genereren." });
  }
}
