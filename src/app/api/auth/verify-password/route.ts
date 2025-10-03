import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();

    // Basic validation
    if (!userId || !password) {
      return NextResponse.json({ success: false, message: 'User ID and password are required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for password verification...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const usersCollection = db.collection('User');

    // Find user by id
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.log('User not found:', userId);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Check password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Invalid password for user:', userId);
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Password verified for user:', userId);
    return NextResponse.json({ success: true }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
