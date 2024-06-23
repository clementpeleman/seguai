import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from "groq-sdk";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topics } = await req.json();

    if (!topics || topics.length === 0) {
      return NextResponse.json({ error: 'No subjects defined' }, { status: 400 });
    }

    const topicPairs = [];
    for (let i = 0; i < topics.length - 1; i++) {
      topicPairs.push([topics[i], topics[i + 1]]);
    }

    const prompt = `Provide smooth transitions, called segues, between the following pairs of topics:
          ${topicPairs.map(pair => `${pair[0]} to ${pair[1]}`).join('; ')}.
          Provide a segue between each consecutive topic, do not go back around from last to first.
          (for example: segue between only topic 1 and 2, segue between only topic 2 and 3, etc.) split each segue with a "\n".
          
          Make sure the transitions are thoughtful and unique. 
          Answer in the same language as the question. Do not add anything to the answer other than the transitions. Do not deviate.
          
          Above all, keep it short and to the point. Use a maximum of 1 short sentence per transition.
          
          Be creative and original. Avoid clichés and obvious transitions.
          
          Answer in the same language as the subejects.`;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }],
    });

    if (
      !response ||
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message ||
      !response.choices[0].message.content
    ) {
      throw new Error('Invalid response structure from OpenAI');
    }

    const seguesText = response.choices[0].message.content.trim();
    const seguesArray = seguesText.split('\n').filter(Boolean);

    const segues = topicPairs.map((pair, index) => ({
      pair,
      segue: seguesArray[index]?.trim() || ''
    }));

    return NextResponse.json({ segues });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error while generating segue' }, { status: 500 });
  }
}
