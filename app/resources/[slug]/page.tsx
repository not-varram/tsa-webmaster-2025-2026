import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { ExternalLink, Tag, Users, Building } from 'lucide-react';
import Link from 'next/link';

type Props = {
    params: {
        slug: string;
    };
};

// Force dynamic rendering - no DB at build time
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
    const resource = await prisma.resource.findUnique({
        where: { slug: params.slug },
    });

    if (!resource) {
        return {
            title: 'Resource Not Found',
        };
    }

    return {
        title: `${resource.title} - WTSA Resource Hub`,
        description: resource.summary,
    };
}

export default async function ResourceDetailPage({ params }: Props) {
    const resource = await prisma.resource.findUnique({
        where: { slug: params.slug },
        include: {
            chapter: true,
        },
    });

    if (!resource) {
        notFound();
    }

    // Get related resources (same category or type)
    const relatedResources = await prisma.resource.findMany({
        where: {
            OR: [
                { category: resource.category },
                { type: resource.type },
            ],
            NOT: {
                id: resource.id,
            },
        },
        include: {
            chapter: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        take: 3,
    });

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <section className="bg-white border-b border-neutral-200">
                <div className="container py-12">
                    <div className="mb-4">
                        <Link href="/resources" className="text-primary-600 hover:text-primary-700 font-medium">
                            ← Back to Resources
                        </Link>
                    </div>

                    <div className="flex items-start justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                                    {resource.type.replace('_', ' ')}
                                </span>
                                {resource.highlighted && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800">
                                        ⭐ Highlighted
                                    </span>
                                )}
                                {resource.origin === 'WTSA' && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        WTSA Official
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{resource.title}</h1>
                            <p className="text-xl text-neutral-600">{resource.summary}</p>
                        </div>

                        {resource.url && (
                            <div>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg">
                                        Access Resource
                                        <ExternalLink className="ml-2 w-5 h-5" />
                                    </Button>
                                </a>
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
                            <div className="bg-white rounded-xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Resource</h2>
                                <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                    {resource.description}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Details */}
                            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                                <h3 className="font-semibold text-lg text-neutral-900">Details</h3>

                                <div>
                                    <div className="flex items-center gap-2 text-neutral-600 mb-2">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm font-medium">Target Audience</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {resource.audience.map((aud) => (
                                            <span
                                                key={aud}
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                                            >
                                                {aud}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-neutral-600 mb-2">
                                        <Tag className="w-4 h-4" />
                                        <span className="text-sm font-medium">Category</span>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                        {resource.category}
                                    </span>
                                </div>

                                {resource.tags.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-neutral-600 mb-2">
                                            <Tag className="w-4 h-4" />
                                            <span className="text-sm font-medium">Tags</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {resource.tags.map((tag) => (
                                                <span key={tag} className="text-xs text-primary-600">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {resource.chapter && (
                                    <div>
                                        <div className="flex items-center gap-2 text-neutral-600 mb-2">
                                            <Building className="w-4 h-4" />
                                            <span className="text-sm font-medium">Shared By</span>
                                        </div>
                                        <Link
                                            href={`/chapters/${resource.chapter.slug}`}
                                            className="text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            {resource.chapter.name}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Resources */}
                    {relatedResources.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Related Resources</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedResources.map((related) => (
                                    <ResourceCard key={related.id} resource={related} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
