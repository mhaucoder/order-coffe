import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { CreateOrderHistory, OrderHistory } from '@/types/order';

export async function GET() {
    const client = await clientPromise;
    const db = client.db('order-coffee');
    const history = await db.collection('order-history').find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(history);
}

export async function POST(request: Request) {
    const body: CreateOrderHistory = await request.json();

    if (!body.orderItem || !Array.isArray(body.orderItem) || body.orderItem.length === 0) {
        return NextResponse.json({ message: 'Order không hợp lệ' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('order-coffee');

    const now = new Date().toISOString();
    const result = await db.collection('order-history').insertOne({
        ...body,
        createdAt: now,
        updatedAt: now,
    });
    const insertedHistory: OrderHistory = { ...body, _id: result.insertedId.toString(), createdAt: now, updatedAt: now };
    return NextResponse.json(insertedHistory, { status: 201 });
}
