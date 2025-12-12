import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Tag, ExternalLink } from 'lucide-react';

type Resource = {
    slug: string;
    title: string;
    summary: string;
    type: string;
    audience: string[];
    tags: string[];
    origin: string;
    chapter?: {
        name: string;
    } | null;
};

export function ResourceCard({ resource }: { resource: Resource }) {
    return (
        <Link href={`/resources/${resource.slug}`}>
            <Card hoverable className="h-full">
                <CardBody className="space-y-3">
                    {/* Type badge */}
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {resource.type.replace('_', ' ')}
                        </span>
                        {resource.origin === 'WTSA' && (
                            <span className="text-xs font-semibold text-accent-600">WTSA Official</span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">
                        {resource.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-neutral-600 line-clamp-3">{resource.summary}</p>

                    {/* Audience */}
                    <div className="flex flex-wrap gap-1">
                        {resource.audience.map((aud) => (
                            <span
                                key={aud}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-700"
                            >
                                {aud}
                            </span>
                        ))}
                    </div>

                    {/* Tags */}
                    {resource.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap text-xs text-neutral-500">
                            <Tag className="w-3 h-3" />
                            {resource.tags.slice(0, 3).map((tag) => (
                                <span key={tag}>#{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Chapter attribution */}
                    {resource.chapter && (
                        <p className="text-xs text-neutral-500">From: {resource.chapter.name}</p>
                    )}
                </CardBody>
            </Card>
        </Link>
    );
}
