import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { CreateDrink, Drink } from '@/types/drink';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('order-coffee');
  const drinks = await db.collection('drinks').find({}).toArray();
  return NextResponse.json(drinks);
}

export async function POST(request: Request) {
  const body: CreateDrink = await request.json();

  if (!body.name) {
    return NextResponse.json(
      { message: 'Tên đồ uống không được bỏ trống' },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db('order-coffee');
  const result = await db.collection('drinks').insertOne(body);
  const insertedDrink: Drink = { ...body, _id: result.insertedId.toString() };

  return NextResponse.json(insertedDrink, { status: 201 });
}
