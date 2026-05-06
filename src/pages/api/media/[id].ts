import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { MediaAsset } from '../../../lib/models';

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ message: 'ID required' }), { status: 400 });
    }

    await dbConnect();
    const deleted = await MediaAsset.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ message: 'Media not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Media deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error', error: (error as any).message }), { status: 500 });
  }
};
