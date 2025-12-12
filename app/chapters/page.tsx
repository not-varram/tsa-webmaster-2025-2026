import prisma from '@/lib/db';
import { ChapterCard } from '@/components/cards/ChapterCard';
import { Metadata } from 'next';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Chapters - WTSA Community',
    description: 'Explore Washington TSA chapters across the state. Find chapters near you, discover their focus areas, and connect with other student leaders.',
};

export const revalidate = 3600;

export default async function ChaptersPage() {
    const chapters = await prisma.chapter.findMany({
        orderBy: { name: 'asc' },
    });

    // Group by region
    const chaptersByRegion = chapters.reduce((acc, chapter) => {
        if (!acc[chapter.region]) {
            acc[chapter.region] = [];
        }
        acc[chapter.region].push(chapter);
        return acc;
    }, {} as Record<string, typeof chapters>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
                <div className="container">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">WTSA Chapters</h1>
                        <p className="text-xl text-primary-50">
                            Connect with TSA chapters across Washington. From Spokane to Seattle, discover what
                            other chapters are working on and find mentorship opportunities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Chapter Stat Cards */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-4xl font-bold text-primary-600 mb-2">{chapters.length}</div>
                            <div className="text-neutral-600">Active Chapters</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-4xl font-bold text-primary-600 mb-2">
                                {Object.keys(chaptersByRegion).length}
                            </div>
                            <div className="text-neutral-600">Regions</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-4xl font-bold text-primary-600 mb-2">
                                {await prisma.mentorPair.count({ where: { status: 'ACTIVE' } })}
                            </div>
                            <div className="text-neutral-600">Active Mentor Pairs</div>
                        </div>
                    </div>

                    {/* Chapters by Region */}
                    <div className="space-y-12">
                        {Object.entries(chaptersByRegion).map(([region, regionChapters]) => (
                            <div key={region}>
                                <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-primary-600" />
                                    {region}
                                    <span className="text-lg font-normal text-neutral-500 ml-2">
                                        ({regionChapters.length})
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {regionChapters.map((chapter) => (
                                        <ChapterCard key={chapter.id} chapter={chapter} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
