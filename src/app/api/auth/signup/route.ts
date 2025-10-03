import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function GET() {
  return NextResponse.json({ success: false, message: 'Method GET not allowed, use POST' }, { status: 405, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('prismora'); // or your DB name
    const usersCollection = db.collection('User'); // Match Prisma model name

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('Email already exists:', email);
      return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name: name,
      email,
      password: hashedPassword,
      role: 'parent', // assuming parent signup
      createdAt: new Date(),
    };

    console.log('Inserting user:', newUser);
    const result = await usersCollection.insertOne(newUser);
    console.log('User inserted with ID:', result.insertedId);

    return NextResponse.json({ success: true, message: 'User registered successfully' }, { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
