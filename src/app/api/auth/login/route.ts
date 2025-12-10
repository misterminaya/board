import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const validUsername = process.env.LOGIN_USERNAME;
    const validPassword = process.env.LOGIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { success: false, error: 'Login not configured' },
        { status: 500 }
      );
    }

    if (username === validUsername && password === validPassword) {
      const cookieStore = cookies();
      const token = Buffer.from(
        `${username}:${Date.now()}:${process.env.JWT_SECRET}`
      ).toString('base64');

      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Login successful' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
