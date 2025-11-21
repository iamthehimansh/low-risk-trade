import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { symbol, historical, quote } = await request.json();

        if (!symbol || !historical || !quote) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        // Prepare data for prompt (limit to last 10 days to save tokens and focus on recent trend)
        const recentHistory = historical.slice(-30).map((day: any) => ({
            date: day.date,
            close: day.close,
            volume: day.volume,
        }));

        const prompt = `
      Analyze the following stock data for ${symbol}.
      Current Price: ${quote.regularMarketPrice}
      Recent History (last 30 days): ${JSON.stringify(recentHistory)}

      Based on this data, determine if the trend suggests a "BUY" or "SELL" or "HOLD".
      Provide a recommendation and a short textual explanation (max 3 sentences) explaining the trend.
      
      Format the response as JSON:
      {
        "recommendation": "BUY" | "SELL" | "HOLD",
        "explanation": "string"
      }
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4o',
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }
        const result = JSON.parse(content);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error analyzing stock:', error);
        return NextResponse.json({ error: 'Failed to analyze stock' }, { status: 500 });
    }
}
