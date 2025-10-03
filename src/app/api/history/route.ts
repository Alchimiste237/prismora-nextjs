import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for history...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const historyCollection = db.collection('History');

    // Fetch history for user, sorted by timestamp desc
    const history = await historyCollection.find({ userId }).sort({ timestamp: -1 }).toArray();

    console.log('History fetched:', history.length, 'items');

    return NextResponse.json({ success: true, history: history.map(h => h.video) }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, video } = await request.json();

    // Basic validation
    if (!userId || !video) {
      return NextResponse.json({ success: false, message: 'User ID and video are required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for adding to history...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const historyCollection = db.collection('History');

    // Insert new history entry
    const historyEntry = {
      userId,
      video,
      timestamp: new Date(),
    };

    console.log('Inserting history entry:', historyEntry);
    const result = await historyCollection.insertOne(historyEntry);
    console.log('History entry inserted with ID:', result.insertedId);

    return NextResponse.json({ success: true, message: 'Added to history successfully' }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Add to history error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
