import { Metadata } from 'next';
import { Users, Lightbulb, Heart, Target } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About - WTSA Community Resource Hub',
    description: 'Learn about the WTSA Community Resource Hub and how we\'re fostering Unity Through Community among Washington TSA chapters.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="page-header-accent py-20 relative">
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900">About WTSA Coalesce</h1>
                        <p className="text-2xl text-neutral-600">
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
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-200">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-3xl font-bold text-neutral-900">The Challenge We Saw</h2>
                            </div>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                            Many TSA chapters across Washington (ours included) operate with uneven access to outside resources and support. Some chapters lack funding or essential materials to support their students, while others have them in surplus without a way to share.
                            </p>
                            <p className="text-lg text-neutral-700 leading-relaxed">
                            This imbalance makes it very difficult for new and existing chapters to operate smoothly and to provide the best experience for their members. We experienced this previously in the inaural year of the LWHS TSA chapter, where we struggled to find resources, funding, and mentorship to get started.
                            </p>
                        </div>

                        {/* The Solution */}
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-200">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-3xl font-bold text-neutral-900">Our Solution</h2>
                            </div>
                            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                                Coalesce is a Community Resource Hub built for WTSA that breaks down these barriers by creating place where:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Chapters can find and access resources created by WTSA and fellow chapters',
                                    'Students and advisors can find exactly what they need through search and filtering',
                                    'New or struggling chapters can connect with existing ones through resource postings',
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
                        <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold">Unity Through Community</h2>
                            </div>
                            <p className="text-lg text-primary-50 leading-relaxed mb-4">
                                This website is designed with the annual WTSA theme, "Unity Through Community," in mind. 
                            </p>
                        </div>

                        {/* How It Works */}
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-200">
                            <div className="flex items-center gap-3 mb-6">
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
                                            Search through guides, workshops, and tools shared by
                                            WTSA and individual chapters around the state.
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
                                            Browse through active chapter profiles on the platform, find mentorship and communal resources & opportunities .
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
                                            Help the community by contributing both physical and digital resources through the submission form. Students around the state can request to use these resources for their own chapters.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
