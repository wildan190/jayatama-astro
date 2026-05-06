import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { WebConfig } from '../../../lib/models';

export const GET: APIRoute = async () => {
  try {
    await dbConnect();
    let config = await WebConfig.findOne();
    if (!config) {
      config = await WebConfig.create({ webName: 'Jayatama' });
    }
    return new Response(JSON.stringify(config), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await dbConnect();
    const body = await request.json();
    let config = await WebConfig.findOne();
    if (config) {
      config = await WebConfig.findByIdAndUpdate(config._id, body, { new: true });
    } else {
      config = await WebConfig.create(body);
    }
    return new Response(JSON.stringify(config), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};
