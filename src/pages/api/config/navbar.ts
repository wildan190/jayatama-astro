import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { WebConfig } from '../../../lib/models';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { navbar } = await request.json();
    await dbConnect();
    
    let config = await WebConfig.findOne();
    if (!config) {
      config = await WebConfig.create({ navbar });
    } else {
      config.navbar = navbar;
      await config.save();
    }

    return new Response(JSON.stringify(config), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as any).message }), { status: 500 });
  }
};
