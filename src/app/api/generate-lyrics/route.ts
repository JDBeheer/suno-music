import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const { stylePrompt, lyricTemplate, songLength, previousLyrics, feedback } = await request.json();

  const isShort = songLength === "kort";

  const systemPrompt = `Je bent een ervaren country/Americana songwriter die lyrics schrijft voor Erik Lindeman, een Nederlandse country singer-songwriter met een warme baritone stem (A2-G4).

REGELS:
- Schrijf ALLEEN in het Engels
- Geen IT/coder/developer referenties
- Gebruik specifieke, beeldende details in plaats van abstracte metaforen. Beschrijf wat je ZIET, RUIKT, HOORT — geen vage gevoelens
- Bedenk ALTIJD volledig nieuwe beelden en metaforen. Hergebruik NOOIT zinnen of beelden uit bestaande nummers
- Kwetsbaarheid + kracht = winnende combo
- Geen spoken word of rap secties — Erik's kracht zit in gezongen delen
- Houd de lyrics singbaar binnen A2-G4 bereik
- GEEN schrijfinstructies in de output — alleen echte lyrics die gezongen kunnen worden
${isShort ? `
KORT & KRACHTIG MODUS:
- Houd coupletten op MAX 4 regels
- Houd refreinen op MAX 4 regels
- Gebruik korte, pakkende zinnen (max 8-10 woorden per regel)
- Denk aan hits: simpel, herkenbaar, meezingbaar
- Totaal MAX 24 regels lyrics (excl. metadata tags)
- Dit moet een strak, punchy nummer worden — geen lange verhalen
` : `
- Houd coupletten op MAX 6 regels
- Houd refreinen op MAX 6 regels
- Totaal MAX 40 regels lyrics (excl. metadata tags)
`}
BELANGRIJK:
- Behoud ALLE [metadata tags] uit het template exact zoals ze zijn
- Vul de lege plekken in het template met lyrics
- De output moet DIRECT in Suno geplakt kunnen worden
- Het totaal (metadata + lyrics) moet ONDER de 5000 tekens blijven`;

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
  ];

  if (previousLyrics && feedback) {
    // Revision flow: send original context, previous result, and feedback
    messages.push({
      role: "user",
      content: `Hier is de Style of Music configuratie:\n${stylePrompt}\n\nHier is het lyric template met metadata tags — vul de lege plekken met lyrics:\n${lyricTemplate}\n\nSchrijf de volledige lyrics met alle metadata tags behouden. Output ALLEEN het ingevulde template, geen uitleg.`,
    });
    messages.push({
      role: "assistant",
      content: previousLyrics,
    });
    messages.push({
      role: "user",
      content: `Pas de lyrics aan op basis van deze feedback:\n\n${feedback}\n\nOutput ALLEEN de aangepaste lyrics met alle [metadata tags] behouden. Geen uitleg.`,
    });
  } else {
    // First generation
    messages.push({
      role: "user",
      content: `Hier is de Style of Music configuratie:\n${stylePrompt}\n\nHier is het lyric template met metadata tags — vul de lege plekken met lyrics:\n${lyricTemplate}\n\nSchrijf de volledige lyrics met alle metadata tags behouden. Output ALLEEN het ingevulde template, geen uitleg.`,
    });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.9,
    max_tokens: 2000,
  });

  const lyrics = completion.choices[0]?.message?.content || "";

  return NextResponse.json({ lyrics });
}
