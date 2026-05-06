import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { Product } from '../../../lib/models';

export const GET: APIRoute = async () => {
  try {
    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);
    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};
