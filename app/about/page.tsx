import { Metadata } from 'next';
import { Users, Lightbulb, Heart, Target } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About - WTSA Community Resource Hub',
    description: 'Learn about the WTSA Community Resource Hub and how we\'re fostering Unity Through Community among Washington TSA chapters.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
            {/* Header */}
            <section className="wtsa-header-gradient text-white py-20">
                <div className="container">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">About the WTSA Hub</h1>
                        <p className="text-2xl text-primary-50">
                            Building Unity Through Community across Washington TSA
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="section">
                <div className="container">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* The Problem */}
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                                    <Target className="w-6 h-6 text-accent-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-neutral-900">The Challenge We Saw</h2>
                            </div>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                                Many TSA chapters across Washington operate in isolation, especially new or
                                geographically distant ones. They often recreate resources from scratch, miss out on
                                collaboration opportunities, and struggle to find mentorship when they need it most.
                            </p>
                            <p className="text-lg text-neutral-700 leading-relaxed">
                                Meanwhile, established chapters have years of experience, proven templates, and
                                successful strategies—but no easy way to share them with chapters that need help.
                            </p>
                        </div>

                        {/* The Solution */}
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Lightbulb className="w-6 h-6 text-primary-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-neutral-900">Our Solution</h2>
                            </div>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                                The WTSA Community Resource Hub breaks down these barriers by creating a central
                                place where:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Chapters can discover and access resources created by WTSA and fellow chapters',
                                    'Students and advisors can find exactly what they need through powerful search and filtering',
                                    'New or struggling chapters can connect with mentors through our buddy program',
                                    'Anyone can contribute by suggesting new resources to help the community grow',
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-neutral-700 text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Unity Through Community */}
                        <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold">Unity Through Community</h2>
                            </div>
                            <p className="text-lg text-primary-50 leading-relaxed mb-4">
                                This isn't just a website—it's a embodiment of our theme. When chapters share their
                                best resources, experienced teams mentor newcomers, and students across the state
                                learn from each other's successes, we create something bigger than any single chapter.
                            </p>
                            <p className="text-lg text-primary-50 leading-relaxed">
                                We create a unified WTSA community where every chapter, regardless of size or
                                location, has access to the support and resources they need to thrive.
                            </p>
                        </div>

                        {/* How It Works */}
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-neutral-900">How It Works</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                            Browse the Resource Directory
                                        </h3>
                                        <p className="text-neutral-700">
                                            Search and filter hundreds of templates, guides, workshops, and tools shared by
                                            WTSA and chapters statewide.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                            Connect with Chapters
                                        </h3>
                                        <p className="text-neutral-700">
                                            Explore chapter profiles to see what others are working on, find mentorship
                                            opportunities, and build relationships.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                            Share & Contribute
                                        </h3>
                                        <p className="text-neutral-700">
                                            Help the community grow by suggesting new resources or having your chapter share
                                            what's working for you.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* For Judges Note */}
                        <div className="bg-neutral-100 border-2 border-neutral-300 rounded-xl p-6">
                            <p className="text-neutral-700">
                                <strong className="text-neutral-900">For Competition Judges:</strong> This site
                                fulfills the "Community Resource Hub" brief by providing an interactive directory,
                                highlighting key resources, offering a suggestion form, and adding substantial value
                                through chapter profiles, events calendar, and a mentorship program. See the{' '}
                                <a href="/judges" className="text-primary-600 hover:text-primary-700 font-medium">
                                    For Judges page
                                </a>{' '}
                                for technical details and compliance information.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
