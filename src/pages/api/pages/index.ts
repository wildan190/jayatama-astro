import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { CustomPage } from '../../../lib/models';

export const GET: APIRoute = async () => {
  try {
    await dbConnect();
    const pages = await CustomPage.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(pages), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as any).message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    await dbConnect();
    
    // Auto generate slug if not provided
    // If this page is set as home, reset others
    if (data.isHome) {
      await CustomPage.updateMany({}, { isHome: false });
    }

    const newPage = await CustomPage.create(data);
    return new Response(JSON.stringify(newPage), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as any).message }), { status: 500 });
  }
};
