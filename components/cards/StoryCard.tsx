import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { BookOpen } from 'lucide-react';

type Story = {
    slug: string;
    title: string;
    excerpt: string;
};

export function StoryCard({ story }: { story: Story }) {
    return (
        <Link href={`/stories/${story.slug}`}>
            <Card hoverable className="h-full">
                <CardBody className="space-y-3">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">
                        {story.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-neutral-600 line-clamp-3">{story.excerpt}</p>

                    {/* Read more */}
                    <div className="pt-2">
                        <span className="text-sm font-medium text-primary-600 flex items-center gap-1">
                            Read Story
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}
