import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { MapPin, Users, Award } from 'lucide-react';

type Props = {
    params: {
        slug: string;
    };
};

export async function generateStaticParams() {
    const chapters = await prisma.chapter.findMany({
        select: { slug: true },
    });

    return chapters.map((chapter) => ({
        slug: chapter.slug,
    }));
}

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
            storyLinks: {
                include: {
                    story: true,
                },
            },
        },
    });

    if (!chapter) {
        notFound();
    }

    // Get mentor relationships
    const mentorPairs = await prisma.mentorPair.findMany({
        where: {
            OR: [
                { mentorChapterId: chapter.id },
                { menteeChapterId: chapter.id },
            ],
            status: 'ACTIVE',
        },
        include: {
            mentorChapter: true,
            menteeChapter: true,
        },
    });

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
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

                            {/* Unity Stories */}
                            {chapter.storyLinks.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                                        Featured in Unity Stories
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {chapter.storyLinks.map((link) => (
                                            <StoryCard key={link.storyId} story={link.story} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Focus Areas */}
                            {chapter.focusTags.length > 0 && (
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg text-neutral-900 mb-4">Focus Areas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {chapter.focusTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 border border-primary-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mentor/Mentee Relationships */}
                            {mentorPairs.length > 0 && (
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg text-neutral-900 mb-4">
                                        Community Connections
                                    </h3>
                                    <div className="space-y-3">
                                        {mentorPairs.map((pair) => {
                                            const isMentor = pair.mentorChapterId === chapter.id;
                                            const otherChapter = isMentor ? pair.menteeChapter : pair.mentorChapter;

                                            return (
                                                <div key={pair.id} className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isMentor ? 'bg-accent-500' : 'bg-primary-500'}`}></div>
                                                    <div>
                                                        <div className="text-xs text-neutral-500 mb-1">
                                                            {isMentor ? 'Mentoring' : 'Learning from'}
                                                        </div>
                                                        <Link
                                                            href={`/chapters/${otherChapter.slug}`}
                                                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                                        >
                                                            {otherChapter.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
