import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { ChapterCard } from '@/components/cards/ChapterCard';
import { HeroSection } from '@/components/home/HeroSection';
import prisma from '@/lib/db';
import { ArrowRight, Search } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
    // Fetch highlighted resources
    const highlightedResources = await prisma.resource.findMany({
        where: { highlighted: true },
        include: { chapter: true },
        take: 3,
    });

    // Fetch recent resources for preview
    const recentResources = await prisma.resource.findMany({
        include: { chapter: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
    });

    // Fetch some chapters
    const chapters = await prisma.chapter.findMany({
        take: 4,
        orderBy: { name: 'asc' },
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HeroSection />

            {/* Highlighted Resources */}
            <section className="section">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                            Highlighted Resources
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            Essential tools and programs that bring our community together
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {highlightedResources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>

                    <div className="text-center">
                        <Link href="/resources">
                            <Button size="lg">
                                View All Resources
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Interactive Directory Preview */}
            <section className="section border-y border-neutral-200">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                            Explore the Resource Directory
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            Search and filter hundreds of resources shared by WTSA and our chapters
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto mb-8">
                        <Link href="/resources">
                            <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-primary-200 hover:border-primary-400 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Search className="w-5 h-5 text-neutral-400" />
                                    <span className="text-neutral-500">
                                        Search for templates, guides, workshops, and more...
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentResources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Chapter Connection Section */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                                Connect with Chapters Across Washington
                            </h2>
                            <p className="text-lg text-neutral-600 mb-6">
                                From Spokane to Seattle, find chapters near you, ask questions, discover
                                mentorship opportunities, and share what works.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Find chapters in your region',
                                    'See what other chapters are working on',
                                    'Join the mentor/mentee program',
                                    'Share your chapter\'s resources',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-neutral-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/chapters">
                                <Button size="lg">
                                    Explore Chapters
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {chapters.map((chapter) => (
                                <ChapterCard key={chapter.id} chapter={chapter} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
