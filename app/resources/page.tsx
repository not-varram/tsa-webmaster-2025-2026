import prisma from '@/lib/db';
import { ResourcesClient } from '@/components/resources/ResourcesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Resource Hub - WTSA Community',
    description: 'Browse and search our comprehensive directory of TSA resources including templates, guides, workshops, and tools shared by WTSA and chapters.',
};

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function ResourcesPage() {
    const resources = await prisma.resource.findMany({
        include: {
            chapter: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: [
            { highlighted: 'desc' },
            { createdAt: 'desc' },
        ],
    });

    const serializedResources = resources.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
            {/* Header */}
            <section className="wtsa-header-gradient text-white py-16">
                <div className="container">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Resource Hub</h1>
                        <p className="text-xl text-primary-50">
                            Discover tools, templates, guides, and workshops created by WTSA and shared by
                            chapters across Washington. Everything you need to strengthen your chapter and
                            succeed in competition.
                        </p>
                    </div>
                </div>
            </section>

            {/* Resources */}
            <section className="section">
                <div className="container">
                    <ResourcesClient initialResources={serializedResources} />
                </div>
            </section>
        </div>
    );
}
