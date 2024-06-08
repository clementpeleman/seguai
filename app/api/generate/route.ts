import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function POST(req: NextRequest) {
  const { topics } = await req.json();

  if (!topics || topics.length === 0) {
    return NextResponse.json({ error: 'Geen onderwerpen opgegeven' }, { status: 400 });
  }

  const topicPairs = [];
  for (let i = 0; i < topics.length - 1; i++) {
    topicPairs.push([topics[i], topics[i + 1]]);
  }

  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Geef vloeiende overgangen, zogenaamde segues, tussen de volgende paren van onderwerpen:
          ${topicPairs.map(pair => `${pair[0]} naar ${pair[1]}`).join('; ')}.
          Geef enkel een overgang tussen twee opeenvolgende onderwerpen. Zorg dat de overgangen doordacht en uniek zijn.
          Antwoord in dezelfde taal als de vraag. Voeg niets anders toe bij het antwoord dan de overgangen. Som de overgangen op. Wijk niet af.
          Geef een schematische voorstelling. Houd het beknopt.`
        },
      ],
      model: 'Qwen/Qwen2-72B-Instruct',
    });

    const seguesText = response?.choices?.[0]?.message?.content?.trim() || '';
    const seguesArray = seguesText.split('\n').filter(Boolean);

    const segues = topicPairs.map((pair, index) => ({
      pair,
      segue: seguesArray[index]?.trim() || ''
    }));

    return NextResponse.json({ segues });
  } catch (error) {
    return NextResponse.json({ error: 'Fout bij het genereren van segue' }, { status: 500 });
  }
}
