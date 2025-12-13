import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Code, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'For Judges - WTSA Community Resource Hub',
    description: 'Information for TSA Webmaster competition judges including technical details, accessibility, and required documentation.',
};

export default function JudgesPage() {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <section className="wtsa-header-gradient text-white py-16">
                <div className="container">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">For Competition Judges</h1>
                    <p className="text-xl text-neutral-300">
                        Technical documentation and compliance information for the 2025-2026 TSA Webmaster event
                    </p>
                </div>
            </section>

            {/* Quick Links */}
            <section className="bg-white border-b border-neutral-200 py-6">
                <div className="container">
                    <div className="flex flex-wrap gap-4">
                        <Link href="/student-work-log">
                            <Button variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                Student Work Log
                            </Button>
                        </Link>
                        <Link href="/copyright-checklist">
                            <Button variant="outline">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Copyright Checklist
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="section">
                <div className="container max-w-5xl">
                    <div className="space-y-8">
                        {/* Problem & Solution */}
                        <div className="bg-white rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                                Problem Statement & Solution
                            </h2>
                            <div className="space-y-4 text-neutral-700">
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-2">The Problem</h3>
                                    <p>
                                        Many Washington TSA chapters operate in isolation, particularly new or
                                        geographically distant ones. They lack easy access to resources, mentorship, and
                                        collaboration opportunities that could strengthen their programs.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-2">Our Solution</h3>
                                    <p>
                                        The WTSA Community Resource Hub creates a centralized platform where chapters can
                                        discover resources, connect with mentors, share their own materials, and learn
                                        from each other's successes—embodying our theme of "Unity Through Community."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Brief Compliance */}
                        <div className="bg-white rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                                Competition Brief Compliance
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-1">
                                            Interactive Resource Directory
                                        </h3>
                                        <p className="text-neutral-700">
                                            Full-featured search and filtering system on the{' '}
                                            <Link href="/resources" className="text-primary-600 hover:underline">
                                                Resource Hub
                                            </Link>{' '}
                                            page with filters for type, category, and audience.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-1">
                                            Highlighted Resources (3+)
                                        </h3>
                                        <p className="text-neutral-700">
                                            Three key resources highlighted on the{' '}
                                            <Link href="/" className="text-primary-600 hover:underline">
                                                home page
                                            </Link>
                                            : Chapter Startup Toolkit, Leadership Workshop Series, and Fundraising Playbook.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-1">Resource Suggestion Form</h3>
                                        <p className="text-neutral-700">
                                            Public form on the{' '}
                                            <Link href="/suggest" className="text-primary-600 hover:underline">
                                                Suggest page
                                            </Link>{' '}
                                            allows anyone to contribute resources to the community.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-1">Additional Content</h3>
                                        <p className="text-neutral-700">
                                            Chapter directory with profiles, Events calendar, and
                                            Mentor/Mentee program tracking—all adding substantial value beyond basic
                                            requirements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technology Stack */}
                        <div className="bg-white rounded-xl p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Code className="w-6 h-6 text-primary-600" />
                                <h2 className="text-2xl font-bold text-neutral-900">Technology Stack</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-3">Frontend</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li>• Next.js 14 (React framework)</li>
                                        <li>• TypeScript (type-safe development)</li>
                                        <li>• Tailwind CSS (styling)</li>
                                        <li>• Server & Client Components</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-3">Backend</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li>• PostgreSQL (database)</li>
                                        <li>• Prisma ORM (data modeling)</li>
                                        <li>• Next.js API Routes</li>
                                        <li>• Server-side rendering (SSR)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-3">Performance</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li>• Static generation where possible</li>
                                        <li>• Incremental static regeneration</li>
                                        <li>• Optimized images and assets</li>
                                        <li>• Database indexing</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-3">Deployment</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li>• Production-ready build</li>
                                        <li>• Environment-based config</li>
                                        <li>• Database migrations</li>
                                        <li>• Vercel/similar hosting ready</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Accessibility */}
                        <div className="bg-white rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                                Accessibility & Responsive Design
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-2">WCAG Compliance</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Semantic HTML5 elements (header, nav, main, section, footer)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>WCAG AA color contrast ratios throughout</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Keyboard navigation support for all interactive elements</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Focus indicators on buttons, links, and form inputs</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>Alt text for images and icons</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>ARIA labels where appropriate</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-2">Responsive Design</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary-600 mt-1">✓</span>
                                            <span>Mobile-first approach (320px and up)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary-600 mt-1">✓</span>
                                            <span>Breakpoints: mobile (sm), tablet (md), desktop (lg, xl)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary-600 mt-1">✓</span>
                                            <span>Responsive navigation with hamburger menu</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary-600 mt-1">✓</span>
                                            <span>Flexible grid layouts that adapt to screen size</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Testing */}
                        <div className="bg-white rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Testing Strategy</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-3">Functional Testing</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li>• All navigation links verified</li>
                                        <li>• Search and filtering tested</li>
                                        <li>• Form validation working</li>
                                        <li>• Database queries verified</li>
                                        <li>• API endpoints tested</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-3">Cross-Browser Testing</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li>• Chrome (latest)</li>
                                        <li>• Firefox (latest)</li>
                                        <li>• Safari (latest)</li>
                                        <li>• Edge (latest)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-3">Performance</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li>• Lighthouse audits run</li>
                                        <li>• Image optimization verified</li>
                                        <li>• Load times measured</li>
                                        <li>• Database query optimization</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-3">Accessibility</h3>
                                    <ul className="space-y-2 text-neutral-700">
                                        <li>• Keyboard navigation tested</li>
                                        <li>• Color contrast checked</li>
                                        <li>• Automated accessibility scans</li>
                                        <li>• Screen reader compatibility</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Required Documentation */}
                        <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-6 h-6 text-primary-600" />
                                <h2 className="text-2xl font-bold text-neutral-900">Required Documentation</h2>
                            </div>

                            <p className="text-neutral-700 mb-6">
                                As required by the Webmaster competition, we've provided comprehensive documentation:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    href="/student-work-log"
                                    className="block p-6 bg-white rounded-lg border-2 border-primary-200 hover:border-primary-400 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="w-5 h-5 text-primary-600" />
                                        <h3 className="font-semibold text-neutral-900">Student Work Log</h3>
                                    </div>
                                    <p className="text-sm text-neutral-600">
                                        Detailed timeline of tasks, team responsibilities, and development process
                                    </p>
                                </Link>

                                <Link
                                    href="/copyright-checklist"
                                    className="block p-6 bg-white rounded-lg border-2 border-primary-200 hover:border-primary-400 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <CheckCircle className="w-5 h-5 text-primary-600" />
                                        <h3 className="font-semibold text-neutral-900">Copyright Checklist</h3>
                                    </div>
                                    <p className="text-sm text-neutral-600">
                                        Complete list of assets, sources, licenses, and attributions
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
