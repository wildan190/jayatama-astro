import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { User } from '../../../lib/models';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';
import { serialize } from 'cookie';

export const POST: APIRoute = async ({ request }) => {
  try {
    await dbConnect();
    const text = await request.text();
    console.log('Request Body Text:', text);
    if (!text) {
      return new Response(JSON.stringify({ message: 'Empty request body' }), { status: 400 });
    }
    const { username, password } = JSON.parse(text);

    const user = await User.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const token = signToken({ id: user._id, username: user.username });
    
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return new Response(JSON.stringify({ message: 'Server error', error: (error as any).message }), { status: 500 });
  }
};
