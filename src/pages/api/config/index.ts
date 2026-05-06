import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { WebConfiguration } from '../../../lib/models';

export const GET: APIRoute = async () => {
  try {
    await dbConnect();
    let config = await WebConfiguration.findOne();
    if (!config) {
      config = await WebConfiguration.create({ webName: 'Jayatama' });
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
    console.log('API: Receiving config update:', JSON.stringify(body, null, 2));
    
    // Always update the first document found, or create it if none exists
    const config = await WebConfiguration.findOneAndUpdate({}, body, { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true 
    });
    
    console.log('API: Config saved. Navbar count:', config.navbar?.length || 0);
    return new Response(JSON.stringify(config), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};
