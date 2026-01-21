import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Code, CheckCircle, Users, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'For Judges - WTSA Community Resource Hub',
    description: 'Information for TSA Webmaster competition judges including technical details, accessibility, and required documentation.',
};

export default function JudgesPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="page-header-accent py-16 relative">
                <div className="container relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">Reference & For Competition Judges</h1>
                    <p className="text-xl text-neutral-600">
                        Technical documentation and compliance information for the 2025-2026 TSA Webmaster event
                    </p>
                </div>
            </section>

            {/* Quick Links */}
            <section className="bg-white border-b border-neutral-200 py-6">
                <div className="container">
                    <div className="flex flex-wrap gap-4">
                        <Link href="/student-work-log">
                            {/* <Button variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                Student Work Log
                            </Button> */}
                        </Link>
                        <Link href="/copyright-checklist">
                            <Button variant="outline">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Copyright Checklist
                            </Button>
                        </Link>

                        <Link href="https://drive.google.com/file/d/14g07aAAc7EBf2r5feGKrVW8CoWnZNl1v/view?usp=sharing">
                            <Button variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                Signed Copyright PDF
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
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
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
                                        from each other's successes building on the theme of "Unity Through Community."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Website Usage Tutorial */}
                        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-8 shadow-sm border-2 border-primary-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Play className="w-6 h-6 text-primary-600" />
                                <h2 className="text-2xl font-bold text-neutral-900">Website Usage Tutorial</h2>
                            </div>

                            <p className="text-neutral-700 mb-6">
                                This website is production-ready and serves sessions for two different types of user accounts: 
                                <strong> Student Accounts</strong> (for the average TSA student member) and <strong>Advisor/Teacher Accounts</strong> (for chapter advisors).
                            </p>

                            <div className="bg-white rounded-lg p-6 mb-4">
                                <h3 className="font-semibold text-neutral-900 mb-3">
                                    Testing the Community Resource Hub Feature
                                </h3>
                                <p className="text-neutral-700 mb-4">
                                    Follow these steps to experience one of our website's main features from both Student and Advisor perspectives:
                                </p>

                                <ol className="space-y-4 text-neutral-700">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-primary-600 flex-shrink-0">1.</span>
                                        <div>
                                            <strong>Create a new student account.</strong> Click "Sign Up" in the top right corner of the navbar. 
                                            Create an arbitrary name and password, but be sure to select <strong>"Lake Washington High School"</strong> for 
                                            the TSA chapter the student is affiliated with, so that this new account can be linked to the existing 
                                            advisor accounts granted by the website administrator. Make sure to note the email address and password 
                                            that you chose for this new account.
                                        </div>
                                    </li>

                                    <li className="flex gap-3">
                                        <span className="font-bold text-primary-600 flex-shrink-0">2.</span>
                                        <div>
                                            <strong>Approve the student account as an advisor.</strong> The new student account needs to be approved 
                                            by the advisor of their chapter for safety purposes. Sign in to the pre-existing advisor account using 
                                            the following credentials by clicking on "Sign In" in the top right corner of the navbar:
                                            <div className="mt-2 p-3 bg-neutral-50 rounded border border-neutral-200 font-mono text-sm">
                                                <div>Email: <strong>admin@lwhs.edu</strong></div>
                                                <div>Password: <strong>password123</strong></div>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex gap-3">
                                        <span className="font-bold text-primary-600 flex-shrink-0">3.</span>
                                        <div>
                                            <strong>Approve the pending student.</strong> Click the green "Approve" button to approve the new 
                                            student account you created.
                                        </div>
                                    </li>

                                    <li className="flex gap-3">
                                        <span className="font-bold text-primary-600 flex-shrink-0">4.</span>
                                        <div>
                                            <strong>Sign in as the student.</strong> To experience the website from the perspective of the student, 
                                            sign out of the advisor account (click the account profile dropdown on the top right corner of the navbar 
                                            and select "Sign Out"), then sign into the newly approved student account using the credentials from step 1.
                                        </div>
                                    </li>

                                    <li className="flex gap-3">
                                        <span className="font-bold text-primary-600 flex-shrink-0">5.</span>
                                        <div>
                                            <strong>Create a resource post.</strong> As a student, you may now use one of the website's main features: 
                                            the cross-chapter resource sharing/request forum. Head over to the "Resource Hub" page on the navbar and 
                                            create a new post with arbitrary content in each of the fields to your liking.
                                        </div>
                                    </li>

                                    <li className="flex gap-3">
                                        <span className="font-bold text-primary-600 flex-shrink-0">6.</span>
                                        <div>
                                            <strong>Approve the post as an advisor.</strong> The post needs to be approved by the chapter advisor. 
                                            Sign out of the student account and sign in to the advisor account. At the top of the advisor dashboard, 
                                            you should see the pending post. Click the dropdown and approve the post.
                                        </div>
                                    </li>

                                    <li className="flex gap-3">
                                        <span className="font-bold text-primary-600 flex-shrink-0">7.</span>
                                        <div>
                                            <strong>View the public post.</strong> The resource request/offering is now public to all users! Any user 
                                            can now fulfill the request or accept the offering to receive help or help out members from other TSA chapters. 
                                            The post also contains a comments section for discussion purposes.
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-neutral-700">
                                    <strong className="text-neutral-900">Note:</strong> This tutorial demonstrates the moderated content workflow 
                                    that ensures safety and quality across the platform. Both student posts and account registrations require 
                                    advisor approval before becoming active in the community.
                                </p>
                            </div> */}

                            <div className="mt-6">
                                <h3 className="font-semibold text-neutral-900 mb-4">Video Tutorial</h3>
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                        src="https://www.youtube.com/embed/xN50hKIzD00"
                                        title="Website Usage Tutorial"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Brief Compliance */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                                Competition Compliance
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
                                            Functional search and filtering system on the{' '}
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
                                            : Chapter Startup Toolkit, Leadership Workshop Series, and Webmaster Startup Guide.
                                        </p>
                                    </div>
                                </div>

                                {/* <div className="flex items-start gap-4">
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
                                </div> */}

                                {/* <div className="flex items-start gap-4">
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
                                </div> */}
                            </div>
                        </div>

                        {/* Technology Stack */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
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
                                        <li>• Automatic deployment via Docker + CI/CD </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
