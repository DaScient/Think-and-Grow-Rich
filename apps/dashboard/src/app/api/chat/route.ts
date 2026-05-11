import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return NextResponse.json(
      {
        content:
          'The AI Mentor is not yet configured. Add your `OPENAI_API_KEY` to `apps/dashboard/.env.local` to enable live coaching.\n\n*"Whatever the mind can conceive and believe, it can achieve."* — Napoleon Hill',
      },
      { status: 200 },
    );
  }

  const body = (await req.json()) as ChatRequest;
  const { messages, model = 'gpt-4o-mini' } = body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { content: 'The mentor is temporarily unavailable. Please try again shortly.' },
      { status: 200 },
    );
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices[0]?.message.content ?? 'No response from the mentor.';

  return NextResponse.json({ content });
}
