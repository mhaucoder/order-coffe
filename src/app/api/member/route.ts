import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { CreateMember, Member } from '@/types/member';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('order-coffee');
  const members = await db.collection('members').find({}).toArray();
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const body: CreateMember = await request.json();

  if (!body.name) {
    return NextResponse.json(
      { message: 'Tên không được bỏ trống' },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db('order-coffee');
  const result = await db.collection('members').insertOne(body);
  const insertedMember: Member = { ...body, _id: result.insertedId.toString() };

  return NextResponse.json(insertedMember, { status: 201 });
}
