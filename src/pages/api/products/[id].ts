import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { Product } from '../../../lib/models';

export const GET: APIRoute = async ({ params }) => {
  try {
    await dbConnect();
    const product = await Product.findById(params.id);
    if (!product) return new Response(null, { status: 404 });
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!product) return new Response(null, { status: 404 });
    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return new Response(null, { status: 404 });
    return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};
