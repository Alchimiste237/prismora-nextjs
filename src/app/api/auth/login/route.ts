import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB for login...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora');
    const usersCollection = db.collection('User');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Check password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Invalid password for:', email);
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Login successful for:', email);

    // Return user data (exclude password)
    const { password: _, _id, ...userData } = user;
    return NextResponse.json({ success: true, user: { id: _id.toString(), ...userData } }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
