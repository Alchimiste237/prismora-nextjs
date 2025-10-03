import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { userId, name } = await request.json();

    if (!userId || !name) {
      return NextResponse.json({ success: false, message: 'User ID and playlist name are required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for creating playlist...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const playlistsCollection = db.collection('Playlist');

    const newPlaylist = {
      userId,
      name,
      videos: [],
      createdAt: new Date(),
    };

    const result = await playlistsCollection.insertOne(newPlaylist);
    console.log('Playlist created with ID:', result.insertedId);

    return NextResponse.json({ success: true, playlist: { id: result.insertedId.toString(), name, videos: [] } }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Create playlist error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for fetching playlists...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const playlistsCollection = db.collection('Playlist');

    const playlists = await playlistsCollection.find({ userId }).toArray();

    // Map to include id as string
    const playlistsWithId = playlists.map(playlist => ({
      id: playlist._id.toString(),
      name: playlist.name,
      videos: playlist.videos || [],
    }));

    return NextResponse.json({ success: true, playlists: playlistsWithId }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Fetch playlists error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
