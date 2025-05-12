import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { adults, children, needs, skill, budget, time } = body;

    const prompt = `
Create a weekly dinner plan (7 days) for a household with:
- ${adults} adults
- ${children} children
- Specific needs: ${needs.join(', ') || 'none'}
- Cooking skill: ${skill}
- Budget: ${budget}
- Time available: ${time}

Include meal names and a simple grocery list. Format it clearly in plain text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const aiMessage = response.choices[0].message.content;

    return NextResponse.json({ plan: aiMessage });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
