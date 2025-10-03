import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for scan history...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const scanHistoryCollection = db.collection('ScanHistory');

    // Fetch scan history for user, sorted by timestamp desc
    const scanHistory = await scanHistoryCollection.find({ userId }).sort({ timestamp: -1 }).toArray();

    console.log('Scan history fetched:', scanHistory.length, 'items');

    return NextResponse.json({ success: true, scanHistory }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Scan history fetch error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, url, analysisResult, videoDetails } = await request.json();

    // Basic validation
    if (!userId || !url || !analysisResult || !videoDetails) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for adding to scan history...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const scanHistoryCollection = db.collection('ScanHistory');

    // Insert new scan history entry
    const scanEntry = {
      userId,
      url,
      analysisResult,
      videoDetails,
      timestamp: new Date(),
    };

    console.log('Inserting scan history entry:', scanEntry);
    const result = await scanHistoryCollection.insertOne(scanEntry);
    console.log('Scan history entry inserted with ID:', result.insertedId);

    return NextResponse.json({ success: true, message: 'Added to scan history successfully' }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Add to scan history error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for clearing scan history...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const scanHistoryCollection = db.collection('ScanHistory');

    // Delete all scan history for user
    const result = await scanHistoryCollection.deleteMany({ userId });

    console.log('Scan history cleared for user:', userId, 'deleted:', result.deletedCount);

    return NextResponse.json({ success: true, message: 'Scan history cleared successfully' }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Clear scan history error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
