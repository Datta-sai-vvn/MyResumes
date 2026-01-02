import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { template } = await request.json();

        const requiredMarkers = [
            'MARKER_BEGIN_SUMMARY',
            'MARKER_END_SUMMARY',
            'MARKER_BEGIN_SKILLS',
            'MARKER_END_SKILLS',
            'MARKER_BEGIN_PROJECTS',
            'MARKER_END_PROJECTS'
        ];

        const missingMarkers = requiredMarkers.filter(
            marker => !template.includes(`% ${marker}`)
        );

        if (missingMarkers.length > 0) {
            return NextResponse.json({
                valid: false,
                error: `Missing markers: ${missingMarkers.join(', ')}`,
                instructions: 'Add markers to your template. See documentation.'
            }, { status: 400 });
        }

        return NextResponse.json({ valid: true });

    } catch (error) {
        return NextResponse.json({
            valid: false,
            error: error.message
        }, { status: 500 });
    }
}
