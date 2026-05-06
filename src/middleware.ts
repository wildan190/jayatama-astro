import { defineMiddleware } from 'astro:middleware';
import { verifyToken } from './lib/auth';
import { parse } from 'cookie';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookieHeader = context.request.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const token = cookies.auth_token;

    if (!token || !verifyToken(token)) {
      return context.redirect('/admin/login');
    }
  }

  // Protect API routes (except login)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    const cookieHeader = context.request.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const token = cookies.auth_token;

    if (!token || !verifyToken(token)) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
  }

  return next();
});
