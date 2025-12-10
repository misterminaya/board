import { NextResponse } from 'next/server';
import { fetchAllData } from '@/lib/notion';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await fetchAllData();
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data from Notion',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
