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
          content: `Provide smooth transitions, called segues, between the following pairs of topics:
          ${topicPairs.map(pair => `${pair[0]} to ${pair[1]}`).join('; ')}.
          Only provide a transition between two consecutive topics. Make sure the transitions are thoughtful and unique. 
          Answer in the same language as the question. Do not add anything to the answer other than the transitions. Do not deviate.
          
          Above all, keep it short and to the point. Use a maximum of 1 short sentence per transition.
          
          Be creative and original. Avoid clichés and obvious transitions.`
        },
      ],
      model: 'mistralai/Mixtral-8x7B-v0.1',
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
