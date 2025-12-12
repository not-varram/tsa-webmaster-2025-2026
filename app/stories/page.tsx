import prisma from '@/lib/db';
import { StoryCard } from '@/components/cards/StoryCard';
import { Metadata } from 'next';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Unity Stories - WTSA Community',
    description: 'Read inspiring stories of collaboration, mentorship, and community building among Washington TSA chapters.',
};

export const revalidate = 3600;

export default async function StoriesPage() {
    const stories = await prisma.story.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
                <div className="container">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-10 h-10" />
                            <h1 className="text-4xl md:text-5xl font-bold">Unity Stories</h1>
                        </div>
                        <p className="text-xl text-primary-50">
                            Real stories of collaboration, mentorship, and community building that demonstrate
                            Unity Through Community in action across WTSA chapters.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story) => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>

                    {stories.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500 text-lg">No stories published yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
