import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { MapPin, Users } from 'lucide-react';

type Chapter = {
    slug: string;
    name: string;
    schoolName: string;
    city: string;
    region: string;
};

export function ChapterCard({ chapter }: { chapter: Chapter }) {
    return (
        <Link href={`/chapters/${chapter.slug}`}>
            <Card hoverable className="h-full">
                <CardBody className="space-y-3">
                    {/* School name */}
                    <h3 className="text-lg font-semibold text-neutral-900">{chapter.schoolName}</h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span>{chapter.city}, {chapter.region}</span>
                    </div>

                    {/* View profile CTA */}
                    <div className="pt-2">
                        <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
                            View Chapter Profile
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
