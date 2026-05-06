import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { MediaAsset } from '../../../lib/models';

export const GET: APIRoute = async () => {
  try {
    await dbConnect();
    const media = await MediaAsset.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(media), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await dbConnect();
    const { name, data, mimeType, size } = await request.json();

    // Check size (500kb = 512000 bytes)
    if (size > 512000) {
      return new Response(JSON.stringify({ message: 'File too large (max 500kb)' }), { status: 400 });
    }

    const newMedia = await MediaAsset.create({
      name,
      data,
      mimeType,
      size
    });

    return new Response(JSON.stringify(newMedia), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};
