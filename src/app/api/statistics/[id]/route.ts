import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const statistic = await db.statistic.findUnique({
      where: { id }
    });

    if (!statistic) {
      return NextResponse.json(
        { error: 'Statistic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(statistic);
  } catch (error) {
    console.error('Error fetching statistic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistic' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const statistic = await db.statistic.update({
      where: { id },
      data: {
        label: data.label,
        value: data.value,
        icon: data.icon,
        imageUrl: data.imageUrl,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });

    return NextResponse.json(statistic);
  } catch (error) {
    console.error('Error updating statistic:', error);
    return NextResponse.json(
      { error: 'Failed to update statistic' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.statistic.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Statistic deleted successfully' });
  } catch (error) {
    console.error('Error deleting statistic:', error);
    return NextResponse.json(
      { error: 'Failed to delete statistic' },
      { status: 500 }
    );
  }
}

