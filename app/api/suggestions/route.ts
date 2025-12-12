import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { resourceName, description, url, type, audience, category, chapterName, email } = body;

        // Basic validation
        if (!resourceName || !description || !audience || !category) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create suggestion
        const suggestion = await prisma.suggestion.create({
            data: {
                resourceName,
                description,
                url: url || null,
                audience,
                category,
                chapterName: chapterName || null,
                email: email || null,
                status: 'PENDING',
            },
        });

        return NextResponse.json({ success: true, suggestion }, { status: 201 });
    } catch (error) {
        console.error('Error creating suggestion:', error);
        return NextResponse.json(
            { error: 'Failed to create suggestion' },
            { status: 500 }
        );
    }
}
