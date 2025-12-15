import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { MapPin, Users, Award } from 'lucide-react';

type Props = {
    params: {
        slug: string;
    };
};

// Force dynamic rendering - no DB at build time
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
    const chapter = await prisma.chapter.findUnique({
        where: { slug: params.slug },
    });

    if (!chapter) {
        return { title: 'Chapter Not Found' };
    }

    return {
        title: `${chapter.name} - WTSA Chapters`,
        description: chapter.about,
    };
}

export default async function ChapterDetailPage({ params }: Props) {
    const chapter = await prisma.chapter.findUnique({
        where: { slug: params.slug },
        include: {
            resources: {
                include: {
                    chapter: {
                        select: { id: true, name: true },
                    },
                },
            },
        },
    });

    if (!chapter) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <section className="wtsa-header-gradient text-white py-16">
                <div className="container">
                    <div className="mb-4">
                        <Link href="/chapters" className="text-primary-100 hover:text-white font-medium">
                            ← Back to Chapters
                        </Link>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{chapter.schoolName}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-lg">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{chapter.city}, {chapter.region}</span>
                        </div>
                        {chapter.resources.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                <span>{chapter.resources.length} Shared Resources</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About */}
                            <div className="bg-white rounded-xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-neutral-900 mb-4">About Our Chapter</h2>
                                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                    {chapter.about}
                                </p>
                            </div>

                            {/* Shared Resources */}
                            {chapter.resources.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                                        Resources Shared by This Chapter
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {chapter.resources.map((resource) => (
                                            <ResourceCard key={resource.id} resource={resource} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar placeholder for future chapter details */}
                        <div className="space-y-6"></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
