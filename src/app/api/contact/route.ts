import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const contactMessage = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message
      }
    });

    return NextResponse.json(
      { message: 'Contact form submitted successfully', id: contactMessage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}