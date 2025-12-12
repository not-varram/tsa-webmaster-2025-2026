import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Calendar, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

type Event = {
    slug: string;
    title: string;
    description: string;
    startDatetime: Date | string;
    type: string;
    location: string;
    audience: string[];
};

export function EventCard({ event }: { event: Event }) {
    return (
        <Link href={`/events#${event.slug}`}>
            <Card hoverable className="h-full">
                <CardBody className="space-y-3">
                    {/* Type badge */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800 w-fit">
                        {event.type}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-neutral-900">{event.title}</h3>

                    {/* Date/Time */}
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(event.startDatetime)}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 line-clamp-2">{event.description}</p>

                    {/* Audience */}
                    <div className="flex flex-wrap gap-1">
                        {event.audience.map((aud) => (
                            <span
                                key={aud}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-700"
                            >
                                {aud}
                            </span>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
}
