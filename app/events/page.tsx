import prisma from '@/lib/db';
import { EventCard } from '@/components/cards/EventCard';
import { Metadata } from 'next';
import { Calendar as CalendarIcon } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Events - WTSA Community',
    description: 'Stay up to date with WTSA events, workshops, competitions, and training sessions for chapters across Washington.',
};

export const revalidate = 1800;

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { startDatetime: 'asc' },
    });

    const upcomingEvents = events.filter((e) => new Date(e.startDatetime) > new Date());
    const pastEvents = events.filter((e) => new Date(e.startDatetime) <= new Date());

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-accent-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-accent-600 to-primary-600 text-white py-16">
                <div className="container">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <CalendarIcon className="w-10 h-10" />
                            <h1 className="text-4xl md:text-5xl font-bold">Events & Programs</h1>
                        </div>
                        <p className="text-xl text-accent-50">
                            Workshops, competitions, training sessions, and community events designed to support
                            your TSA journey and strengthen chapter connections.
                        </p>
                    </div>
                </div>
            </section>

            {/* Events */}
            <section className="section">
                <div className="container">
                    {/* Upcoming Events */}
                    {upcomingEvents.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-neutral-900 mb-8">Upcoming Events</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Events */}
                    {pastEvents.length > 0 && (
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-900 mb-8">Past Events</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pastEvents.map((event) => (
                                    <div key={event.id} className="opacity-60">
                                        <EventCard event={event} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {events.length === 0 && (
                        <div className="text-center py-20">
                            <CalendarIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500 text-lg">No events scheduled at this time.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
