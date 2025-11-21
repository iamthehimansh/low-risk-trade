import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const queryOptions = {
      period1: oneMonthAgo.toISOString().split('T')[0],
      period2: today.toISOString().split('T')[0]
    }; // Fetch from 1 month ago to today
    const result = await yahooFinance.historical(symbol, queryOptions as any);

    // Also get quote for current price
    const quote = await yahooFinance.quote(symbol);

    return NextResponse.json({ historical: result, quote });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
