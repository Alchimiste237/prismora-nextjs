import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
  try {
    const { userId, playlistId, video } = await request.json();

    // Basic validation
    if (!userId || !playlistId || !video || !video.url || !video.videoTitle) {
      return NextResponse.json({ success: false, message: 'User ID, playlist ID, and video details are required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for adding to playlist...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const playlistsCollection = db.collection('Playlist');

    // Find the playlist
    const playlist = await playlistsCollection.findOne({ _id: new ObjectId(playlistId), userId });
    if (!playlist) {
      return NextResponse.json({ success: false, message: 'Playlist not found' }, { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if video already in playlist
    const videoExists = playlist.videos.some((v: any) => v.url === video.url);
    if (videoExists) {
      return NextResponse.json({ success: false, message: 'Video already in playlist' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Add video to playlist
    const newVideo = {
      url: video.url,
      videoTitle: video.videoTitle,
      thumbnailUrl: video.thumbnailUrl,
      addedAt: new Date(),
    };

    await playlistsCollection.updateOne(
      { _id: new ObjectId(playlistId) },
      { $push: { videos: newVideo } } as any
    );

    console.log('Video added to playlist:', playlistId);

    return NextResponse.json({ success: true, message: 'Video added to playlist successfully' }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Add to playlist error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
