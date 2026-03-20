import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { ChapterCard } from '@/components/cards/ChapterCard';
import { HeroSection } from '@/components/home/HeroSection';
import prisma from '@/lib/db';
import { ArrowRight, Search } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {

    // Fetch highlighted resources and backfill with recent ones to always show 3
    const highlightedResources = await prisma.resource.findMany({
        where: { highlighted: true },
        include: { chapter: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
    });

    let featuredResources = highlightedResources;

    if (highlightedResources.length < 3) {
        const fallbackResources = await prisma.resource.findMany({
            where: { highlighted: false },
            include: { chapter: true },
            orderBy: { createdAt: 'desc' },
            take: 3 - highlightedResources.length,
        });

        featuredResources = [...highlightedResources, ...fallbackResources];
    }


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
                            Highlighted Resources & Guides
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            Official WTSA and chapter resources for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {featuredResources.map((resource) => (
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
                        <p className="text-lg text-neutral-600 max-w-2.2xl mx-auto">
                            Search and filter all materials & resources shared by official WTSA and our chapters
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

            
        </div>
    );
}
