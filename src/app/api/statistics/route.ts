import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const statistics = await db.statistic.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const statistic = await db.statistic.create({
      data: {
        label: data.label,
        value: data.value,
        icon: data.icon,
        order: data.order || 0
      }
    });

    return NextResponse.json(statistic, { status: 201 });
  } catch (error) {
    console.error('Error creating statistic:', error);
    return NextResponse.json(
      { error: 'Failed to create statistic' },
      { status: 500 }
    );
  }
}