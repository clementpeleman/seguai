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

  try {
    const response = await together.chat.completions.create({
      messages: [
        { role: 'user', content: `Geef een vloeiende overgang, een zogenaamde segue, tussen de volgende onderwerpen: ${topics.join(', ')}.
        Geef enkel een overgang tussen  2 opeenvolgende onderwerpen. Zorg dat de overgangen doordacht zijn en uniek zijn. 
        Antwoord in dezelfde taal als de vraag. Voeg niets anders toe bij het antwoord dan de overgangen. Som de overgangen op. Wijk niet af.
        Geef een schematische voorstelling` },
      ],
      model: 'Qwen/Qwen2-72B-Instruct',
    });
    const segue = response?.choices?.[0]?.message?.content?.trim() || '';
    return NextResponse.json({ segue });
  } catch (error) {
    return NextResponse.json({ error: 'Fout bij het genereren van segue' }, { status: 500 });
  }
}
