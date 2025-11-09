import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const companies = await db.company.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        features: {
          orderBy: { order: 'asc' }
        },
        services: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(companies || []);
  } catch (error) {
    console.error('Error fetching companies:', error);
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const company = await db.company.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        imageUrl: data.imageUrl,
        color: data.color,
        order: data.order || 0,
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

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}