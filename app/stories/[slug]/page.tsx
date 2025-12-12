import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Props = {
    params: {
        slug: string;
    };
};

export async function generateStaticParams() {
    const stories = await prisma.story.findMany({
        select: { slug: true },
    });

    return stories.map((story) => ({
        slug: story.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const story = await prisma.story.findUnique({
        where: { slug: params.slug },
    });

    if (!story) {
        return { title: 'Story Not Found' };
    }

    return {
        title: `${story.title} - Unity Stories`,
        description: story.excerpt,
    };
}

export default async function StoryDetailPage({ params }: Props) {
    const story = await prisma.story.findUnique({
        where: { slug: params.slug },
        include: {
            chapterLinks: {
                include: {
                    chapter: true,
                },
            },
        },
    });

    if (!story) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <section className="bg-white border-b border-neutral-200">
                <div className="container py-12">
                    <div className="mb-4">
                        <Link href="/stories" className="text-primary-600 hover:text-primary-700 font-medium">
                            ← Back to Unity Stories
                        </Link>
                    </div>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                            <BookOpen className="w-4 h-4" />
                            <span>Unity Story</span>
                            <span>•</span>
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(story.createdAt)}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                            {story.title}
                        </h1>

                        <p className="text-xl text-neutral-600 leading-relaxed">{story.excerpt}</p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm">
                                <div className="prose prose-lg max-w-none">
                                    {story.body.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx} className="text-neutral-700 leading-relaxed mb-6">
                                            {paragraph.trim()}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            {story.chapterLinks.length > 0 && (
                                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                                    <h3 className="font-semibold text-lg text-neutral-900 mb-4">
                                        Featured Chapters
                                    </h3>
                                    <div className="space-y-3">
                                        {story.chapterLinks.map((link) => (
                                            <Link
                                                key={link.chapterId}
                                                href={`/chapters/${link.chapter.slug}`}
                                                className="block p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                                            >
                                                <div className="font-medium text-neutral-900 text-sm">
                                                    {link.chapter.schoolName}
                                                </div>
                                                <div className="text-xs text-neutral-500 mt-1">
                                                    {link.chapter.city}, {link.chapter.region}
                                                </div>
                                            </Link>
                                        ))}
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
