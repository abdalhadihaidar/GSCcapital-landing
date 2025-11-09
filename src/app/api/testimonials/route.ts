import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(testimonials || []);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const testimonial = await db.testimonial.create({
      data: {
        name: data.name,
        company: data.company,
        role: data.role,
        content: data.content,
        rating: data.rating || 5,
        order: data.order || 0
      }
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}