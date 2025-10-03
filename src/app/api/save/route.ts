import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
  try {
    const { userId, video } = await request.json();

    // Basic validation
    if (!userId || !video || !video.url || !video.videoTitle) {
      return NextResponse.json({ success: false, message: 'User ID and video details are required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for saving video...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const savedVideosCollection = db.collection('SavedVideo');

    // Check if video already saved by this user
    const existingVideo = await savedVideosCollection.findOne({ userId, url: video.url });
    if (existingVideo) {
      return NextResponse.json({ success: false, message: 'Video already saved' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Save the video
    const savedVideo = {
      userId,
      url: video.url,
      videoTitle: video.videoTitle,
      thumbnailUrl: video.thumbnailUrl,
      savedAt: new Date(),
    };

    console.log('Inserting saved video:', savedVideo);
    const result = await savedVideosCollection.insertOne(savedVideo);
    console.log('Video saved with ID:', result.insertedId);

    return NextResponse.json({ success: true, message: 'Video saved successfully' }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Save video error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
