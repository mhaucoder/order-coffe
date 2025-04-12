import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { CreateCustomer, Customer } from '@/types/customer';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('order-coffee');
  const customers = await db.collection('members').find({}).toArray();
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const body: CreateCustomer = await request.json();

  if (!body.name) {
    return NextResponse.json(
      { message: 'Tên không được bỏ trống' },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db('order-coffee');
  const result = await db.collection('members').insertOne(body);
  const insertedCustomer: Customer = { ...body, _id: result.insertedId.toString() };

  return NextResponse.json(insertedCustomer, { status: 201 });
}
