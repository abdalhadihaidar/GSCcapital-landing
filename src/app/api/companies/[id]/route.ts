import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await db.company.findUnique({
      where: { id },
      include: {
        features: {
          orderBy: { order: 'asc' }
        },
        services: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
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
    
    // Delete existing features and services
    await db.companyFeature.deleteMany({
      where: { companyId: id }
    });
    await db.companyService.deleteMany({
      where: { companyId: id }
    });

    const company = await db.company.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        imageUrl: data.imageUrl,
        color: data.color,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        features: data.features ? {
          create: data.features.map((feature: any, index: number) => ({
            title: feature.title,
            order: index
          }))
        } : undefined,
        services: data.services ? {
          create: data.services.map((service: any, index: number) => ({
            title: service.title,
            description: service.description,
            order: index
          }))
        } : undefined
      },
      include: {
        features: true,
        services: true
      }
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
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
    await db.company.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}

