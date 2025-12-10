import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      const decoded = Buffer.from(token.value, 'base64').toString();
      const secret = process.env.JWT_SECRET;
      
      if (decoded.includes(secret || '')) {
        return NextResponse.json({ authenticated: true });
      }
    } catch {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Verify auth error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
