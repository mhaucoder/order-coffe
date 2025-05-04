import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { CreateDrink, Drink, UpdateDrink } from '@/types/drink';
import { ObjectId } from 'mongodb';

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

export async function PUT(request: Request) {
  const body: UpdateDrink = await request.json();

  if (!body._id || !ObjectId.isValid(body._id)) {
    return NextResponse.json({ message: 'ID không hợp lệ' }, { status: 400 });
  }

  const { _id, ...updateFields } = body; // loại _id ra khỏi update
  const client = await clientPromise;
  const db = client.db('order-coffee');

  const result = await db
    .collection('drinks')
    .updateOne({ _id: new ObjectId(_id) }, { $set: updateFields });

  return NextResponse.json({ modified: result.modifiedCount });
}

export async function DELETE(request: Request) {
  const { _id } = await request.json();
  const client = await clientPromise;
  const db = client.db('order-coffee');
  const result = await db.collection('drinks').deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ deleted: result.deletedCount });
}