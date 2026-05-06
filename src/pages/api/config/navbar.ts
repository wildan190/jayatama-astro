import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { WebConfiguration } from '../../../lib/models';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { navbar } = body;
    console.log('API Navbar: Attempting to save', navbar.length, 'items');
    
    await dbConnect();
    
    // Find the config document or create it
    let config = await WebConfiguration.findOne();
    if (config) {
      // Use set() and save() for the most reliable array update in Mongoose
      config.navbar = navbar;
      await config.save();
      console.log('API Navbar: Updated existing config');
    } else {
      config = await WebConfiguration.create({ navbar });
      console.log('API Navbar: Created new config');
    }
    
    console.log('API Navbar: Final navbar count:', config.navbar.length);
    return new Response(JSON.stringify(config), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as any).message }), { status: 500 });
  }
};
